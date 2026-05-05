import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

type Env = {
  Variables: {
    requestStart: number
  }
}

const timingMiddleware = createMiddleware<Env>(async (c, next) => {
  c.set('requestStart', performance.now())
  await next()
  const duration = performance.now() - c.var.requestStart
  c.res.headers.set('X-Response-Time', `${duration}`)
})

const app = new Hono<Env>()

app.get('/timed', timingMiddleware, (c) => c.json({ ok: true }, 200))

export default app
