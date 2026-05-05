# Error Handling

Use this when implementing `app.onError()`, `app.notFound()`, `HTTPException`, consistent JSON errors, or RPC-friendly error response types.

## Owned surface

This file owns global error handlers, top-level 404 behavior, `HTTPException`, error envelopes, `c.error`, and typed error response implications. Auth-specific failure options belong in `security-auth.md`; stream errors belong in `streaming-realtime.md`.

## Global handlers

```ts
import { HTTPException } from 'hono/http-exception'

app.notFound((c) => c.json({ error: 'not_found' }, 404))

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json(
      { error: error.message || 'http_error' },
      error.status
    )
  }
  console.error(error)
  return c.json({ error: 'internal_error' }, 500)
})
```

Rules:

- `app.notFound()` is called from the top-level app; do not rely on sub-app `notFound()` for final behavior.
- Route-level `onError` handlers have priority over parent app handlers.
- `c.error` is visible to upstream middleware after a downstream throw.
- `HTTPException.getResponse()` is status-aware, but a JSON API should usually translate it into the same JSON envelope used by the rest of the API.

## RPC-friendly errors

Hono RPC does not automatically infer response bodies from global `app.onError()` handlers. For route-specific typed errors, prefer explicit status responses:

```ts
const route = app.get('/posts/:id', async (c) => {
  const post = await findPost(c.req.param('id'))
  if (!post) {
    return c.json({ error: 'not_found' }, 404)
  }
  return c.json({ post }, 200)
})
```

Use `ApplyGlobalResponse` only when you intentionally want global response types merged into all client routes.

```ts
import type { ApplyGlobalResponse } from 'hono/client'

type AppWithErrors = ApplyGlobalResponse<
  typeof route,
  { 500: { json: { error: string } } }
>
```

## Error envelope policy

For APIs, keep all error responses JSON and consistent:

```ts
type ErrorBody = {
  error: string
  message?: string
}
```

Use stable machine-readable `error` codes and avoid leaking raw internal errors. Log unexpected errors server-side before returning a generic 500.

## Anti-patterns

- **HTML errors in JSON API:** return JSON envelopes for API routes.
- **Sub-app 404 assumption:** top-level `notFound()` owns final fallback.
- **`c.notFound()` in typed RPC route:** use `c.json({ error }, 404)` unless augmenting NotFound types deliberately.
- **Global error type assumption:** use explicit route statuses or `ApplyGlobalResponse`.
- **Streaming error mismatch:** after a stream starts, handle stream errors inside the stream.

## Template

Use [error-envelope.ts](../assets/templates/error-envelope.ts).
