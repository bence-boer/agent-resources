# Helpers and Observability

Use this when integrating Hono helpers, proxying, cookies, route debugging, request IDs, logging, ETag/cache/compress, timeout, or server timing.

## Owned surface

This file owns compact helper selection and operational middleware that is not primarily security, validation, rendering, or deployment. It should not duplicate full auth, static, or RPC recipes.

## Helper matrix

| Need | Hono surface | Caveat |
|---|---|---|
| Cookies | `getCookie`, `setCookie`, signed variants from `hono/cookie` | Security options belong in `security-auth.md`. |
| Proxy | `proxy()` from `hono/proxy` | Explicitly control forwarded sensitive headers. |
| Runtime env helper | `env(c)`, `getRuntimeKey()` from `hono/adapter` | Prefer typed `c.env` where runtime supports bindings. |
| Connection info | runtime-specific `getConnInfo()` | Required for IP restriction. |
| Route debugging | `matchedRoutes`, `routePath`, `baseRoutePath`, `basePath` from `hono/route` | Use helpers instead of deprecated `c.req.routePath` / `c.req.matchedRoutes`. |
| Dev route list | `showRoutes()` | Development/debug only. |
| JWT token operations | `sign`, `verify`, `decode` from `hono/jwt` | `decode()` is not authentication. |
| Content negotiation | `accepts()` | Keep fallback/default explicit. |

## Operational middleware matrix

| Need | Middleware | Caveat |
|---|---|---|
| Request ID | `requestId()` | Node requires crypto support or custom generator. |
| Logging | `logger()` or third-party logger | Include request ID correlation when available. |
| ETag | `etag()` | 304 responses retain selected headers. |
| Cache | `cache()` | Cache API support is runtime-specific; Deno may need `wait: true`. |
| Compression | `compress()` | Cloudflare Workers and Deno Deploy often compress automatically. |
| Timeout | `timeout()` | Do not use directly with streams. |
| Server Timing | `timing()` | Runtime timers and header exposure can differ. |
| Pretty JSON | `prettyJSON()` | Development/debug only unless clients require it. |

## Proxy safety pattern

```ts
import { proxy } from 'hono/proxy'

app.all('/upstream/*', (c) => {
  const upstream = new URL(c.req.url)
  upstream.protocol = 'https:'
  upstream.host = 'api.example.com'
  upstream.pathname = upstream.pathname.replace(/^\/upstream/, '')

  const headers = new Headers(c.req.raw.headers)
  headers.delete('authorization')
  headers.delete('cookie')

  return proxy(upstream, {
    method: c.req.method,
    headers,
    body: ['GET', 'HEAD'].includes(c.req.method) ? undefined : c.req.raw.body,
  })
})
```

## Anti-patterns

- **Helpers junk drawer:** route scenario-owned helpers to their scenario file.
- **Sensitive proxy forwarding:** strip auth, cookie, and hop-by-hop headers unless intentionally forwarding.
- **Deprecated route properties:** use `hono/route` helpers.
- **Cache everywhere:** do not cache authenticated or user-specific responses without varying and auth-aware policy.
- **Compression duplication:** avoid explicit compression where the platform already handles it.

## Template

Use [helper-cookie-proxy.ts](../assets/templates/helper-cookie-proxy.ts).
