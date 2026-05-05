/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'

const app = new Hono()

app.use('*', jsxRenderer(({ children }) => (
  <html>
    <body>{children}</body>
  </html>
)))

app.get('/', (c) => c.render(<h1>Hello Hono</h1>))

export default app
