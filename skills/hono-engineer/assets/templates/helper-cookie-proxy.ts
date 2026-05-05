import { Hono } from 'hono'
import { getSignedCookie, setSignedCookie } from 'hono/cookie'
import { proxy } from 'hono/proxy'

type Bindings = {
  COOKIE_SECRET: string
}

const app = new Hono<{ Bindings }>()

app.get('/session', async (c) => {
  const session = await getSignedCookie(c, c.env.COOKIE_SECRET, 'session')
  return c.json({ session: session ?? null }, 200)
})

app.post('/session', async (c) => {
  await setSignedCookie(c, 'session', 'value', c.env.COOKIE_SECRET, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
  })
  return c.json({ ok: true }, 201)
})

app.all('/proxy/*', (c) => {
  const upstream = new URL(c.req.url)
  upstream.protocol = 'https:'
  upstream.host = 'api.example.com'
  upstream.pathname = upstream.pathname.replace(/^\/proxy/, '')

  const headers = new Headers(c.req.raw.headers)
  headers.delete('authorization')
  headers.delete('cookie')

  return proxy(upstream, {
    method: c.req.method,
    headers,
    body: ['GET', 'HEAD'].includes(c.req.method) ? undefined : c.req.raw.body,
  })
})

export default app
