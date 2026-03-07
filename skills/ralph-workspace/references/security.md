# Security Patterns

## Authentication: Passkeys (WebAuthn)

The system uses passwordless authentication via the WebAuthn standard.

### Registration Flow

```
1. User receives invite token → navigates to /register?token=TOKEN
2. Frontend: GET /api/auth/invite/status?token=TOKEN → validates token exists and is unused
3. Frontend: POST /api/auth/register/options → server generates challenge, stores it keyed by challenge ID
4. Browser: navigator.credentials.create() → user creates passkey
5. Frontend: POST /api/auth/register/verify → server verifies attestation, creates passkey + session
6. Server: Atomically marks invite token as used in the SAME transaction as passkey creation
```

### Login Flow

```
1. Frontend: POST /api/auth/login/options → server generates challenge
2. Browser: navigator.credentials.get() → user authenticates with passkey
3. Frontend: POST /api/auth/login/verify → server verifies assertion, creates session
4. Session token set as httpOnly cookie
```

### Critical Implementation Details

- **Challenge storage is keyed per-challenge** (`auth:${challenge}`), not a single global key.
  Concurrent login attempts must not clobber each other.
- **Invite token claiming is atomic.** The token is marked as used in the same database operation
  that creates the passkey. A non-atomic flow allows double-use of invite tokens.
- **`crypto.randomUUID()` requires a secure context** (HTTPS). In HTTP/development, use a fallback.
- **Session cookies:** `httpOnly`, `secure` (in production), `sameSite: 'lax'`.

## Authorization

### Role Model

Two roles: `admin` and `user`. Stored on the `passkeys` table (not sessions).

### Middleware

```typescript
// auth_middleware: validates session, sets context.user and context.role
// admin_middleware: checks context.role === 'admin', returns 403 if not
```

### Supabase FK Join Shape

When querying a session with its passkey (`session → passkey` is many-to-one):

```typescript
// PostgREST returns a SINGLE OBJECT for many-to-one joins, NOT an array
const role = session.passkeys?.role ?? 'user';

// WRONG: Treating it as an array silently fails, defaulting everyone to 'user'
const role = session.passkeys?.[0]?.role ?? 'user'; // BUG: admins lose admin
```

### Admin Self-Protection

Admin endpoints that modify roles must prevent self-demotion and self-deletion. An admin removing
their own admin role locks everyone out of admin functionality.

## Rate Limiting

### Per-Instance Isolation

Each `rate_limit()` call creates its own counter map. Do NOT share state at module scope:

```typescript
// CORRECT: factory creates isolated instance
export function rate_limit(max_requests: number, window_ms: number) {
    const request_counts = new Map(); // Per-instance
    return async (c, next) => { ... };
}

// WRONG: shared map across all middleware instances
const request_counts = new Map(); // Module scope — shared
```

### Tiered Limits

| Scope | Limit | Rationale |
|-------|-------|-----------|
| Global | 100 req/min | Baseline DDoS protection |
| Auth (login/register) | 10 req/min | Brute-force protection |
| Chat | 20 req/min | Agent resource protection |
| Spawn | 5 req/min | Concurrency protection |

**Rate limits must distinguish read from write operations.** Auth status/polling endpoints fire on
every navigation and must NOT share limits with credential submission endpoints.

### IP Extraction

Use the **rightmost** `X-Forwarded-For` entry (last trusted proxy):

```typescript
const forwarded = c.req.header('x-forwarded-for');
const ip = forwarded?.split(',').pop()?.trim() || 'unknown';
// NOT .split(',')[0] — that's client-spoofable
```

## SSRF Prevention

Validate all user-supplied URLs before making outbound requests:

```typescript
function is_ssrf_target(url: string): boolean {
    // Block: 127.x, 10.x, 172.16-31.x, 192.168.x, 169.254.x (link-local)
    // Block: ::1, fc00::/7 (IPv6 private)
    // Block: decimal IP representations
    // Block: file:// and other non-HTTP schemes
    // Block: .internal, .local, .localhost domains
}
```

## Environment Variable Security

**Agent processes receive only allowlisted environment variables** via `build_agent_env()`.

Never:
- Spread `...process.env` into `Bun.spawn`
- Pass database credentials to agent processes
- Include API keys in agent environments

The allowlist pattern is in [agent-system.md](agent-system.md).

## Request Size Limits

Body size is capped at 1MB to prevent denial-of-service via large payloads.

## CORS

Origins are configured from environment variables, not hardcoded:

```typescript
cors({ origin: env.CORS_ORIGINS.split(',') })
```

## Prompt Injection

User-supplied content in agent prompts is delimited with `<user_input>` tags. This is a defense
in depth measure — it reduces the attack surface but does not eliminate it. Agent output is always
validated with Zod schemas before database insertion.
