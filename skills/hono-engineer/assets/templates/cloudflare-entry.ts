import { Hono } from 'hono'

type Bindings = {
  API_TOKEN: string
}

const app = new Hono<{ Bindings }>()

app.get('/health', (c) => c.json({ hasToken: Boolean(c.env.API_TOKEN) }, 200))

export default app

// If the Worker also handles scheduled or other events, export an object:
// export default { fetch: app.fetch, scheduled(event, env, ctx) { ... } }
