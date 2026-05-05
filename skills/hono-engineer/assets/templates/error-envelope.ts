import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

app.notFound((c) => c.json({ error: 'not_found' }, 404))

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json(
      { error: error.message || 'http_error' },
      error.status
    )
  }

  console.error(error)
  return c.json({ error: 'internal_error' }, 500)
})

export default app
