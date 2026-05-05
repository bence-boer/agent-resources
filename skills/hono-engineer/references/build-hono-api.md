# Build Hono API

Use this when creating routes, splitting an app into modules, reading params/query/body data, or returning JSON/text/html responses.

## Owned surface

This file owns app construction, route methods, request extraction, response helpers, strict mode, grouping, and route ordering. It does not own validation packages, RPC clients, auth middleware, or runtime entrypoints.

## Route construction rules

| Need | Pattern | Caveat |
|---|---|---|
| Single route | `app.get('/books/:id', (c) => ...)` | Inline handler preserves path-param inference. |
| Multiple methods | `app.on(['GET', 'POST'], '/x', handler)` | Keep method-specific auth near the route when behavior differs. |
| Prefix all routes | `new Hono().basePath('/api')` | Do not double-prefix when mounting with `app.route()`. |
| Larger app | `app.route('/books', books)` | Build `books` routes before mounting. |
| Fallback | `app.get('*', ...)` or `app.notFound()` | Register fallback last; top-level `notFound()` owns final 404 behavior. |
| Strict slash | `new Hono({ strict: false })` | Default strict mode treats `/hello` and `/hello/` differently. |

## Request and response API

- Path params: `c.req.param('id')` or `c.req.param()` for all params.
- Query params: `c.req.query('q')` for first value, `c.req.queries('tag')` for repeated values.
- Headers: `c.req.header('X-Request-Id')`; use validation for required headers.
- Bodies: `await c.req.json()`, `text()`, `parseBody()`, `arrayBuffer()`, `blob()`, `formData()`. Plan body reads because raw request bodies are streams.
- Responses: prefer `c.json(body, status)`, `c.text(text, status)`, `c.html(html)`, `c.body(body)`, and `c.redirect(url, status)` over raw `new Response()` unless direct Web API control is needed.

## Large app composition

```ts
// books.ts
import { Hono } from 'hono'

export const books = new Hono()
  .get('/', (c) => c.json({ books: [] }, 200))
  .post('/', async (c) => {
    const body = await c.req.json()
    return c.json({ created: body }, 201)
  })
  .get('/:id', (c) => c.json({ id: c.req.param('id') }, 200))
```

```ts
// index.ts
import { Hono } from 'hono'
import { books } from './books'

const app = new Hono().basePath('/api')

const routes = app.route('/books', books)

export type AppType = typeof routes
export default app
```

## Anti-patterns

- **Fallback before specific route:** move catch-all handlers to the end.
- **Mounted empty sub-app:** define child routes before `app.route()`.
- **Implicit coercion:** route params and query values are strings; coerce explicitly.
- **Controller by default:** avoid detached `(c: Context)` handlers when path-param inference matters.
- **Response helper avoidance:** use `c.json()`/`c.text()`/`c.html()` for ordinary responses so status and content type are explicit.

## Template

Use [api-app.ts](../assets/templates/api-app.ts) for a new REST-style route module.
