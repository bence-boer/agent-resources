# Security and Auth

Use this when adding CORS, Basic/Bearer/JWT/JWK auth, CSRF, secure headers, cookies, body limits, IP restriction, or proxy-related security controls.

## Owned surface

This file owns security middleware behavior and security-sensitive helper usage. Generic middleware mechanics belong in `middleware-composition.md`; platform secret setup belongs in `deploy-runtimes.md`.

## Security middleware matrix

| Need | Hono surface | Rule |
|---|---|---|
| CORS | `cors()` from `hono/cors` | Register before routes; avoid wildcard origins with credentials. |
| Basic auth | `basicAuth()` | Use constant-time credential verification where possible. |
| Bearer auth | `bearerAuth()` | Tokens may be multiple or route/method-specific. |
| JWT auth | `jwt()` and `JwtVariables` | Verification authenticates; authorization still follows. |
| JWK/JWKS | `jwk()` from `hono/jwk` | Requires asymmetric algorithms and validates signature/time claims. |
| CSRF | `csrf()` | Protect unsafe methods and form-like content types. |
| Secure headers | `secureHeaders()` | Coordinate CSP with JSX/CSS nonce usage. |
| Cookies | `hono/cookie` helpers | Signed-cookie helpers are async; use secure prefixes correctly. |
| Body limit | `bodyLimit()` | Apply before handlers that parse large bodies. |
| IP restriction | `ipRestriction(getConnInfo, ...)` | Use runtime-specific `getConnInfo`. |

## Auth pattern

```ts
import { jwt } from 'hono/jwt'

type Bindings = {
  JWT_SECRET: string
}

const app = new Hono<{ Bindings }>()

app.use('/api/*', async (c, next) => {
  return jwt({ secret: c.env.JWT_SECRET })(c, next)
})

app.get('/api/admin', (c) => {
  const payload = c.get('jwtPayload')
  if (payload.role !== 'admin') {
    return c.json({ error: 'forbidden' }, 403)
  }
  return c.json({ ok: true }, 200)
})
```

## JWK/JWKS notes

`jwk()` verifies JWT header format, requires `kid`, rejects symmetric algorithms, enforces configured `alg`, verifies signatures, and validates time claims by default. Configure issuer/audience verification when tokens cross trust boundaries. Add application authorization after `jwk()`.

## CORS and secure headers

```ts
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

app.use('*', secureHeaders())
app.use('/api/*', cors({
  origin: 'https://example.com',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}))
```

When using JSX/CSS helpers with CSP, pass and apply nonces instead of weakening CSP.

## Cookie security

- Use `__Host-` cookies only with `Secure`, `Path=/`, and no `Domain`.
- Use `__Secure-` cookies only with `Secure`.
- Prefer `HttpOnly`, `Secure`, `SameSite=Lax` or stricter for session cookies.
- Use signed cookies for tamper detection; do not store secrets client-side.

## Anti-patterns

- **JWT `decode()` as auth:** decode does not verify signature.
- **AuthN as AuthZ:** token validity does not prove role, tenant, or resource access.
- **Wildcard CORS with credentials:** define an allowlist or dynamic policy.
- **Header middleware conflict:** order `secureHeaders()`, CORS, and custom header writers deliberately.
- **Sensitive proxy forwarding:** allowlist outbound headers.

## Template

Use [secure-endpoints.ts](../assets/templates/secure-endpoints.ts).
