# Middleware Composition

Use this when adding middleware, setting request variables, reasoning about order, or extracting reusable middleware.

## Owned surface

This file owns middleware mechanics: `app.use()`, route-local middleware, `await next()`, early responses, response mutation after `next()`, `createMiddleware()`, typed `Variables`, and dynamic middleware using `c.env`. Security middleware details belong in `security-auth.md`.

## Middleware model

- A handler returns a `Response`; only one terminal handler responds.
- Middleware either returns a `Response` to short-circuit or `await next()` to continue.
- Registration order controls the before phase; after `await next()` unwinds in reverse.
- Hono catches thrown errors and sends them to `app.onError()` or converts them to 500, so routine `await next()` does not need defensive `try/catch`.

## Core patterns

```ts
app.use(async (c, next) => {
  const start = performance.now()
  await next()
  c.res.headers.set('X-Response-Time', String(performance.now() - start))
})
```

```ts
import { createMiddleware } from 'hono/factory'

type Env = {
  Variables: {
    user: { id: string }
  }
}

export const userMiddleware = createMiddleware<Env>(async (c, next) => {
  c.set('user', { id: '123' })
  await next()
})

const app = new Hono<Env>()
app.get('/me', userMiddleware, (c) => c.json(c.var.user))
```

## Dynamic middleware with env

When middleware options depend on `c.env`, construct and call the middleware inside a wrapper:

```ts
import { cors } from 'hono/cors'

app.use('*', async (c, next) => {
  return cors({ origin: c.env.CORS_ORIGIN })(c, next)
})
```

## Context variable typing

- Prefer `Variables` generics on `new Hono()` or `createMiddleware()` when the variable is route- or middleware-scoped.
- Use global `ContextVariableMap` augmentation only for variables guaranteed by app-wide middleware. It otherwise hides `undefined` runtime bugs.
- Chained `.use()` calls accumulate `Variables` types for following handlers.

## Middleware selection table

| Need | Middleware/helper |
|---|---|
| Security headers, CORS, auth, CSRF, body limit, IP restriction | `security-auth.md` |
| Request ID, logger, server timing, ETag, cache, compress, timeout | `helpers-observability.md` |
| Typed reusable middleware/handlers | `createMiddleware()`, `createFactory()`, `factory.createHandlers()` |
| Request context outside handlers | `contextStorage()`, `getContext()`, only when runtime supports `AsyncLocalStorage` |

## Anti-patterns

- **Missing `await next()`:** downstream handler never runs.
- **Accidental early `Response`:** returning a response short-circuits all later middleware.
- **Competing header writers:** order header-mutating middleware deliberately.
- **Global variable overtyping:** avoid `ContextVariableMap` for route-local data.
- **Module-level env middleware:** do not construct env-dependent middleware outside request context.

## Template

Use [middleware-chain.ts](../assets/templates/middleware-chain.ts).
