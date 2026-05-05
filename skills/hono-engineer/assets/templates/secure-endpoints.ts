import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { secureHeaders } from 'hono/secure-headers'

type Bindings = {
  JWT_SECRET: string
  CORS_ORIGIN: string
}

const app = new Hono<{ Bindings }>()

app.use('*', secureHeaders())
app.use('/api/*', async (c, next) => cors({ origin: c.env.CORS_ORIGIN })(c, next))
app.use('/api/*', async (c, next) => jwt({ secret: c.env.JWT_SECRET })(c, next))

app.get('/api/me', (c) => {
  const payload = c.get('jwtPayload')
  return c.json({ user: payload }, 200)
})

export default app
