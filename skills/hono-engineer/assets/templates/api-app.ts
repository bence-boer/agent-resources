import { Hono } from 'hono'

type Bindings = {
  // Add runtime bindings such as DB, KV, or secrets here.
}

const app = new Hono<{ Bindings }>().basePath('/api')

const resources = new Hono()
  .get('/', (c) => c.json({ items: [] }, 200))
  .post('/', async (c) => {
    const body = await c.req.json()
    return c.json({ item: body }, 201)
  })
  .get('/:id', (c) => {
    const id = c.req.param('id')
    return c.json({ id }, 200)
  })

const routes = app.route('/resources', resources)

export type AppType = typeof routes
export default app
