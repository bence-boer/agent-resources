---
name: hono-engineer
description: >
  Hono engineering skill for building, debugging, reviewing, and refactoring
  Hono apps using Web Standards Request/Response, middleware onion execution,
  typed Context Bindings/Variables, validators, Hono RPC hc clients, runtime
  adapters, secure headers, CORS, JWT/JWK auth, streaming/SSE/WebSocket, JSX/SSG,
  static files, and app.request/testClient testing. Use when users say "build a
  Hono API", "add middleware", "validate a route", "fix Hono types", "deploy
  Hono", "use Hono client", or "secure this Hono endpoint." Do NOT use for
  non-Hono backends, database schema design, frontend-only UI, or general DevOps
  unrelated to Hono runtime adapters.
---

# Hono Engineer

Use Hono's Web Standards model, type inference rules, middleware order, and runtime boundaries to produce correct Hono code without loading the full documentation.

## Expert vocabulary payload

**Core runtime model:** Web Standards `Request`/`Response`, Fetch handler, `Hono` app, `Context` (`c`), `HonoRequest` (`c.req`), `app.fetch`.

**Routing and composition:** route registration order, strict mode, `app.route()`, `basePath()`, path parameters, regex parameters, fallback handler.

**Middleware and context:** middleware onion, `await next()`, `createMiddleware()`, `factory.createHandlers()`, `Bindings`, `Variables`, `c.var`, `ContextVariableMap`.

**Contracts and clients:** validator target, `c.req.valid()`, `zValidator`, chained route inference, `AppType`, `hc`, `InferRequestType`, `InferResponseType`, `testClient`.

**Platform and specialized surfaces:** runtime adapter, Cloudflare Workers bindings, Node `serve()`, AWS Lambda `handle`, `secureHeaders`, `streamSSE`, `upgradeWebSocket`, `jsxRenderer`.

## Anti-pattern watchlist

1. **Rails-style controller inference loss** — Detection: handlers typed as `(c: Context)` and registered later, so `c.req.param('id')` loses path inference. Resolution: prefer inline handlers after path definitions; if separated handlers are required, use `factory.createHandlers()`.
2. **Unchained RPC/test-client type collapse** — Detection: `export type AppType = typeof app` from an app mutated over many statements and `hc` or `testClient` lacks route autocomplete. Resolution: chain routes or export `typeof route`; for large apps chain `app.route()` calls into a `routes` variable.
3. **Middleware onion misuse** — Detection: middleware that should continue omits `await next()`, wraps routine `next()` in boilerplate `try/catch`, or mutates `c.res` before downstream handlers run. Resolution: do pre-work, `await next()`, then post-work; use `app.onError()` for global errors unless a scenario requires local handling.
4. **Route order shadowing** — Detection: `app.get('*', ...)`, broad route patterns, or fallback handlers are registered before specific routes. Resolution: register specific routes first and fallback handlers last.
5. **Premature sub-app mounting** — Detection: `app.route('/prefix', child)` runs before the child app's routes are registered. Resolution: define child routes before mounting because `route()` copies the current routing state.
6. **Validator body/header surprises** — Detection: JSON/form validators see `{}` or header validators miss expected keys. Resolution: send matching `Content-Type` for `json`/`form`; use lowercase keys inside `validator('header')`.
7. **Runtime API portability leak** — Detection: Cloudflare code uses `process.env`, Node code assumes Workers bindings, static files or WebSockets are copied between runtimes unchanged. Resolution: keep route logic portable, but select adapter/env/static/WebSocket code per runtime.
8. **Authentication without authorization** — Detection: JWT/JWK/Bearer middleware verifies a token and handlers immediately trust tenant, role, or resource access. Resolution: treat token verification as authentication only; add authorization checks after auth middleware.
9. **Streaming error rewrite fantasy** — Detection: stream code expects `app.onError()` to replace an already-started response. Resolution: use streaming helper error callbacks and abort/close handling inside the stream.
10. **Raw HTML or proxy header leakage** — Detection: `raw()` receives user data or proxy code forwards all request headers. Resolution: escape untrusted content and explicitly allowlist forwarded headers.

## Owned surface and boundaries

This skill owns Hono file-level engineering: app setup, routes, request/response handling, middleware, validation, errors, RPC clients, testing, runtime entrypoints, security middleware, streaming, rendering, static files, and Hono helper integration.

This skill does not own database schema design, non-Hono server frameworks, frontend-only component design, cloud account provisioning, or deployment console walkthroughs. For runtime deployment, it owns the Hono adapter shape and code caveats, not full provider operations.

## Universal Hono operating model

1. Start from Web Standards: Hono handlers ultimately return `Response` objects, either directly or through helpers such as `c.json()`, `c.text()`, `c.html()`, `c.body()`, and `c.redirect()`.
2. Treat `Context` as request-scoped. Use `c.req` for request access, `c.env` for runtime bindings, `c.set()`/`c.get()`/`c.var` for request variables, and `c.res` only after downstream response creation.
3. Preserve TypeScript inference by placing handlers close to path definitions. Use `new Hono<{ Bindings; Variables }>()` for app-wide context typing and `createMiddleware<{ Variables }>()` for reusable typed middleware.
4. Register middleware before the routes it should affect. The before-`next()` phase runs in registration order; the after-`next()` phase unwinds in reverse order.
5. Use validators at request boundaries. Read typed data through `c.req.valid(target)` after validator middleware; coerce query/path strings explicitly.
6. For RPC clients, return explicit JSON status codes and export the type of the route/app variable that contains the chained route definitions.
7. Select the runtime adapter deliberately. Cloudflare Workers and Bun can often export the app; Node uses `serve()`; AWS Lambda uses `handle()`; static files, raw server APIs, and WebSockets are runtime-specific.

Minimal portable app:

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

export default app
```

## One-hop reference routing

Load exactly one primary reference when possible. Load a companion only when the user explicitly crosses a boundary such as validation plus RPC, auth plus runtime secrets, or static files plus platform deployment.

| User scenario | Load |
|---|---|
| Create or restructure Hono API routes, params, query/body access, app splitting | [build-hono-api](references/build-hono-api.md) |
| Add validators, Zod, Standard Schema, `c.req.valid()`, typed input | [validated-routes](references/validated-routes.md) |
| Compose middleware, set variables, use `createMiddleware`, reason about order | [middleware-composition](references/middleware-composition.md) |
| Design error handling, 404s, `HTTPException`, typed error responses | [error-handling](references/error-handling.md) |
| Use Hono RPC, Hono Client `hc`, `AppType`, inferred request/response types | [rpc-client](references/rpc-client.md) |
| Test with `app.request()`, mock env, or use `testClient()` | [testing-hono-apps](references/testing-hono-apps.md) |
| Deploy/run on Cloudflare, Node, Bun, Deno, Vercel, Netlify, AWS, Fastly, Cloud Run | [deploy-runtimes](references/deploy-runtimes.md) |
| Add CORS, auth, JWT/JWK, secure headers, CSRF, cookies, body limits, IP restriction | [security-auth](references/security-auth.md) |
| Generate OpenAPI/Swagger/Scalar docs | [openapi-docs](references/openapi-docs.md) |
| Build streams, SSE, WebSocket, realtime endpoints | [streaming-realtime](references/streaming-realtime.md) |
| Render HTML/JSX, serve static files, use CSS helper or SSG | [rendering-static-jsx](references/rendering-static-jsx.md) |
| Integrate cookies, proxy, route/dev helpers, caching, logging, request IDs, ETag | [helpers-observability](references/helpers-observability.md) |

## Execution rules

1. Classify the user's Hono scenario and load the matching reference before producing non-trivial code.
2. Prefer Hono built-ins and documented helpers before third-party packages unless the user selected a package.
3. Ask for the target runtime only when runtime-specific code affects correctness: env bindings, static files, WebSockets, raw server APIs, Lambda event access, or deployment entrypoint.
4. Use templates from `assets/templates/` when creating a new code pattern; adapt names, paths, and env bindings to the project.
5. Do not mirror the full docs. Preserve Hono-specific invariants, gotchas, and canonical snippets.
6. Do not invent exact APIs for third-party OpenAPI or ecosystem packages that are only listed by the Hono docs; mark placeholders and verify package docs when implementation requires exact syntax.
7. When reviewing or fixing code, check the anti-pattern watchlist first, then verify the affected scenario reference.

## Output expectations

When producing Hono code, include the file-level change and any required dependency/import. When explaining a decision, name the Hono invariant involved: route inference, middleware order, validator target, runtime adapter, typed RPC response, or security boundary.

## Examples

### BAD: separated controller loses path inference

```ts
import type { Context } from 'hono'

const getBook = (c: Context) => c.json({ id: c.req.param('id') })
app.get('/books/:id', getBook)
```

### GOOD: inline or factory-created handlers keep Hono inference

```ts
app.get('/books/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id }, 200)
})
```

### GOOD: large app with RPC-safe route export

```ts
const books = new Hono()
  .get('/', (c) => c.json({ books: [] }, 200))
  .get('/:id', (c) => c.json({ id: c.req.param('id') }, 200))

const routes = new Hono().route('/books', books)

export type AppType = typeof routes
export default routes
```

## Questions this skill answers

- How do I build or refactor a Hono API?
- How should Hono middleware be ordered?
- How do I validate Hono route input with Zod or Standard Schema?
- Why is my Hono RPC client missing route types?
- How do I deploy Hono to Cloudflare, Node, Bun, Deno, AWS Lambda, Vercel, or Netlify?
- How do I test a Hono app with `app.request()` or `testClient()`?
- How do I secure Hono endpoints with CORS, JWT, JWK, cookies, CSRF, or secure headers?
- How do I stream responses, use SSE, or add WebSockets in Hono?
- How do I render HTML/JSX, serve static files, or generate SSG output with Hono?
