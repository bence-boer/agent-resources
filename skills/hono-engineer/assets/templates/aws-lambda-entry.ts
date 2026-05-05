import { handle } from 'hono/aws-lambda'
import { Hono } from 'hono'

const app = new Hono()

app.get('/health', (c) => c.json({ ok: true }, 200))

export const handler = handle(app)

// For Lambda response streaming, use `streamHandle(app)` instead.
