# Testing Hono Apps

Use this when testing Hono route behavior, request parsing, env bindings, middleware effects, or typed test clients.

## Owned surface

This file owns `app.request()`, `Request` object tests, mock env as third argument, JSON/form test caveats, `testClient()`, and runtime-specific testing notes.

## `app.request()`

```ts
import { describe, expect, it } from 'vitest'
import app from './app'

describe('posts', () => {
  it('creates a post', async () => {
    const res = await app.request('/posts', {
      method: 'POST',
      body: JSON.stringify({ title: 'Hono' }),
      headers: { 'Content-Type': 'application/json' },
    })

    expect(res.status).toBe(201)
    await expect(res.json()).resolves.toEqual({ title: 'Hono' })
  })
})
```

You can also pass a `Request` object when testing lower-level Fetch behavior:

```ts
const req = new Request('http://localhost/posts', {
  method: 'POST',
  body: JSON.stringify({ title: 'Hono' }),
  headers: { 'Content-Type': 'application/json' },
})

const res = await app.request(req)
```

## Mock env bindings

Pass env as the third argument:

```ts
const res = await app.request(
  '/admin',
  { headers: { Authorization: 'Bearer test' } },
  { TOKEN: 'test' }
)
```

## `testClient()`

Use `testClient(app)` from `hono/testing` for typed route calls in tests. It depends on the same route inference rules as RPC: routes should be chained directly into the app/route variable.

```ts
import { testClient } from 'hono/testing'

const client = testClient(app)
const res = await client.posts.$post({
  json: { title: 'Hono' },
})
```

## Runtime notes

- Bun projects can use `bun:test`.
- Cloudflare Workers behavior should be tested with `@cloudflare/vitest-pool-workers` when bindings, caches, or Worker runtime APIs matter.
- Node adapter behavior that uses raw incoming/outgoing objects should be tested at the adapter/integration level, not only through pure `app.request()`.

## Anti-patterns

- **JSON test without content type:** validators receive `{}`.
- **Mock env omitted:** `c.env` values are undefined in tests.
- **Untyped test client:** route declarations are not chained.
- **Wrong runtime simulator:** generic tests cannot prove Cloudflare-specific bindings or caches.

## Template

Use [hono-test.ts](../assets/templates/hono-test.ts).
