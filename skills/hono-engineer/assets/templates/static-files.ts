import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { fileURLToPath } from 'node:url'

const app = new Hono()

const root = fileURLToPath(new URL('./public', import.meta.url))

app.use(
  '/static/*',
  serveStatic({
    root,
    rewriteRequestPath: (path) => path.replace(/^\/static/, ''),
  })
)

export default app

// Bun uses `serveStatic` from `hono/bun`.
// Cloudflare Workers should usually use platform Static Assets instead.
