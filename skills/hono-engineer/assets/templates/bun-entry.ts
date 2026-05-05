import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Bun'))

export default {
  port: Number(process.env.PORT ?? 3000),
  fetch: app.fetch,
}

// For Bun WebSocket support, also import/export `websocket` from `hono/bun`.
