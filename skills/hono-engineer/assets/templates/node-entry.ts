import { serve } from '@hono/node-server'
import app from './app'

const server = serve({
  fetch: app.fetch,
  port: Number(process.env.PORT ?? 3000),
})

process.on('SIGTERM', () => {
  server.close()
})
