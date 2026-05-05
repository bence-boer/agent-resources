import { Hono } from 'hono'

const app = new Hono()

// Placeholder: verify exact imports and APIs for the selected package
// such as Zod OpenAPI, Scalar, Swagger UI, Hono OpenAPI, or hono-zod-openapi.

app.get('/openapi.json', (c) => {
  return c.json({
    openapi: '3.1.0',
    info: { title: 'API', version: '0.1.0' },
    paths: {},
  }, 200)
})

app.get('/docs', (c) => {
  return c.html('<p>Mount the selected OpenAPI UI here.</p>')
})

export default app
