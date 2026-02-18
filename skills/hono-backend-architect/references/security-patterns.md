# Security Patterns

## Mandatory Middleware Stack

Apply in this order on every production Hono app:

```ts
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';

import { pino_logger } from '@/middleware/logger.js';

app.use('*',
  requestId(),
  secureHeaders(),
  cors({
    origin: ['https://app.example.com'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  }),
  csrf({ origin: ['https://app.example.com'] }),
  pino_logger(),
);
```

### What Each Does

| Middleware | Purpose |
|-----------|---------|
| `requestId()` | Adds X-Request-Id for tracing |
| `secureHeaders()` | Sets X-Content-Type-Options, X-Frame-Options, CSP, etc. |
| `cors()` | Strict origin allowlist, credentials mode |
| `csrf()` | Origin-check CSRF protection for state-changing requests |
| `pino_logger()` | Structured request logging |

## Supabase Auth — The Correct Way

### Anti-Pattern: Manual JWT Decoding

```ts
// ❌ NEVER DO THIS — bypasses signature verification
const base64 = auth_token.split('-')[1];
const session = JSON.parse(atob(base64));
```

### Correct Pattern: getUser() Validation

```ts
// ✅ ALWAYS use getUser() — validates JWT signature server-side
export const auth_guard = (): MiddlewareHandler => {
  return async (context, next) => {
    const { data: { user }, error } = await context.var.supabase.auth.getUser();
    if (error || !user) {
      return context.json({ message: 'Unauthorized' }, 401);
    }
    context.set('user', user);
    await next();
  };
};
```

### Per-Request Client Creation

```ts
// ✅ Create a fresh Supabase client per request with cookie forwarding
export const supabase_middleware = (): MiddlewareHandler => {
  return async (context, next) => {
    const client = createServerClient<Database>(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => parseCookieHeader(context.req.header('Cookie') ?? ''),
          setAll: (cookies) =>
            cookies.forEach(({ name, value, options }) =>
              setCookie(context, name, value, { ...options, secure: true, sameSite: 'None' })
            ),
        },
      },
    );
    context.set('supabase', client);
    await next();
  };
};
```

## Error Sanitization

### Anti-Pattern: Leaking DB Errors

```ts
// ❌ Passes raw Supabase error as cause — may leak table names, RLS details
throw new HTTPException(500, { message: 'Failed', cause: supabase_error });
```

### Correct Pattern: Sanitized Error Boundary

```ts
// ✅ Log full error server-side, return sanitized message to client
export const error_boundary: ErrorHandler = (error, context) => {
  const request_id = context.var?.requestId ?? 'unknown';

  if (error instanceof HTTPException) {
    // Expected errors — return the message (already developer-controlled)
    return context.json({ message: error.message, request_id }, error.status);
  }

  // Unexpected errors — log full details, return generic message
  context.var?.logger?.error({ error, request_id }, 'Unhandled error');
  return context.json({ message: 'Internal server error', request_id }, 500);
};
```

## Input Validation Boundaries

Validate at the **edge** of the system (route definition), not inside handlers:

```ts
// Route definition — Zod schema IS the validation + OpenAPI doc
export const create = createRoute({
  method: 'post',
  path: '/expenses',
  request: {
    body: json_content_required(insert_expense_schema, 'New expense'),
  },
  responses: {
    [200]: json_content(select_expense_schema, 'Created'),
    [422]: json_content(create_error_schema(insert_expense_schema), 'Validation error'),
  },
});

// Handler — input is already validated and typed
export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const expense = context.req.valid('json'); // Already validated by Zod
  // ... business logic
};
```

## Rate Limiting

```ts
import { rateLimiter } from 'hono-rate-limiter';

// Apply to auth endpoints to prevent brute force
app.use('/api/auth/*', rateLimiter({
  windowMs: 60 * 1000,
  limit: 10,
  keyGenerator: (context) => context.req.header('x-forwarded-for') ?? 'unknown',
}));

// Apply to expensive endpoints (AI, uploads)
app.use('/api/ai/*', rateLimiter({
  windowMs: 60 * 1000,
  limit: 5,
  keyGenerator: (context) => context.var.user?.id ?? 'anon',
}));
```

## Environment Validation

Validate env vars at startup with Zod — fail fast on misconfiguration:

```ts
import { z } from 'zod';

const env_schema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  CORS_ORIGIN: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8000),
});

export const env = env_schema.parse(process.env);
export type Env = z.infer<typeof env_schema>;
```
