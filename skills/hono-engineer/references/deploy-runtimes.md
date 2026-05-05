# Deploy Runtimes

Use this when selecting or fixing Hono runtime entrypoints, env bindings, static files, raw runtime APIs, or platform-specific server adapters.

## Owned surface

This file owns Hono adapter code and runtime caveats. It does not own provider console steps, account setup, DNS, or full CI/CD configuration.

## Runtime matrix

| Runtime | Entry/export | Env access | Static files | Key caveat |
|---|---|---|---|---|
| Cloudflare Workers | `export default app` or object with `fetch: app.fetch` | `c.env` typed through `Bindings` | Workers Static Assets | Use `c.env`, not `process.env`, unless compatibility flags deliberately allow it. |
| Cloudflare Pages | `handle(app)` from `hono/cloudflare-pages` | Pages context/bindings | Pages assets/build output | API routes often live under functions middleware. |
| Node.js | `serve({ fetch: app.fetch, port })` from `@hono/node-server` | process/env or typed adapter bindings | `@hono/node-server/serve-static` | Static root is relative to `process.cwd()` unless resolved with `import.meta.url`. |
| Bun | `export default app` or `{ port, fetch: app.fetch }` | `Bun.env` or app env pattern | `serveStatic` from `hono/bun` | WebSocket support requires exporting `websocket` with `fetch`. |
| Deno | Deno serve/default export patterns | Deno env or bindings per platform | `serveStatic` from `hono/deno` | Keep Hono and middleware imports on the same registry/version. |
| AWS Lambda | `handle(app)` from `hono/aws-lambda` | `c.env.event`, `c.env.lambdaContext` | Platform integration | Binary responses are base64-encoded when content type is binary. |
| Lambda streaming | `streamHandle(app)` | Lambda context | N/A | Streaming has runtime-specific response behavior. |
| Vercel/Netlify/Fastly/Cloud Run | Platform adapter entrypoint | Platform-specific context/env | Platform-specific | Keep the reference to a minimal Hono entry shape; verify provider deployment settings. |

## Common snippets

Node:

```ts
import { serve } from '@hono/node-server'
import app from './app'

serve({ fetch: app.fetch, port: 3000 })
```

Cloudflare Worker with bindings:

```ts
type Bindings = {
  API_TOKEN: string
}

const app = new Hono<{ Bindings }>()

export default app
```

Bun with custom port:

```ts
export default {
  port: 3000,
  fetch: app.fetch,
}
```

AWS Lambda:

```ts
import { handle } from 'hono/aws-lambda'
import app from './app'

export const handler = handle(app)
```

## Runtime-specific decisions

- Ask for runtime before writing static file, WebSocket, raw Node API, Lambda event, or Worker binding code.
- Use `getConnInfo` from the runtime-specific module when middleware needs client IP.
- For Node static paths, resolve source-relative roots with `fileURLToPath(new URL('./public', import.meta.url))`.
- `app.fire()` is deprecated; use `fire()` from `hono/service-worker` for Service Worker syntax.

## Anti-patterns

- **Copying adapter code across runtimes:** route logic is portable; entrypoints are not.
- **Cloudflare `process.env`:** prefer typed `c.env`.
- **Bun WebSocket export omitted:** export both `fetch` and `websocket`.
- **Deno version drift:** align Hono and middleware versions/registries.
- **Static file root surprise:** avoid process-CWD assumptions on Node.

## Templates

Use [node-entry.ts](../assets/templates/node-entry.ts), [cloudflare-entry.ts](../assets/templates/cloudflare-entry.ts), [bun-entry.ts](../assets/templates/bun-entry.ts), or [aws-lambda-entry.ts](../assets/templates/aws-lambda-entry.ts).
