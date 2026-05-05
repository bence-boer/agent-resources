# RPC Client

Use this when sharing Hono server route types with a client through `hc`, `AppType`, and inference helpers.

## Owned surface

This file owns `hc`, `AppType`, route type export strategy, request object shapes, status-code inference, `$url()`, `$path()`, file uploads, custom fetch, query serializers, `InferRequestType`, `InferResponseType`, performance mitigations, and version mismatch warnings.

## Server route type

```ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import * as z from 'zod'

const route = new Hono().post(
  '/posts',
  zValidator('json', z.object({ title: z.string() })),
  (c) => {
    const body = c.req.valid('json')
    return c.json({ post: body }, 201)
  }
)

export type AppType = typeof route
export default route
```

For larger apps:

```ts
const routes = new Hono()
  .route('/authors', authors)
  .route('/books', books)

export type AppType = typeof routes
```

## Client usage

```ts
import { hc, type InferRequestType, type InferResponseType } from 'hono/client'
import type { AppType } from './server'

const client = hc<AppType>('http://localhost:8787/')

const $post = client.posts.$post
type CreatePostInput = InferRequestType<typeof $post>['json']
type CreatePostResponse = InferResponseType<typeof $post, 201>

const res = await $post({ json: { title: 'Hono' } })
const data: CreatePostResponse = await res.json()
```

Request shape:

- `param` for path params.
- `query` for query strings; pass strings and coerce server-side.
- `json` for JSON bodies.
- `form` for form fields or uploads.
- `header` or `headers`/`init` for request headers and fetch options.

## Status-code typing

Explicit `c.json(body, 200)` and `c.json(error, 404)` allow clients to narrow by `res.status`. Avoid `c.notFound()` inside typed routes when response inference matters.

## Runtime and tooling caveats

- Set TypeScript `strict: true` in client and server projects.
- Keep Hono versions aligned across client, server, and middleware packages.
- For large apps with IDE slowdown, use project references, precompiled client helpers, or split clients by route group.
- `$url()` requires a usable base URL; use absolute base URLs unless framework routing guarantees a base.
- Use custom `fetch` for credentials, tracing, or platform-specific request behavior.

## Anti-patterns

- **Exporting pre-route app type:** export the chained route/app variable.
- **Version mismatch:** pin one Hono version across server, client, and middleware.
- **Numeric query params:** send strings; validate/coerce on the server.
- **Unbounded route tree:** split clients if type expansion slows the IDE.
- **Untyped global errors:** use route statuses or `ApplyGlobalResponse`.

## Template

Use [rpc-server-client.ts](../assets/templates/rpc-server-client.ts).
