import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'

const app = new Hono()

app.get('/events', (c) => {
  c.header('Content-Encoding', 'Identity')

  return streamSSE(c, async (stream) => {
    let running = true
    let id = 0

    stream.onAbort(() => {
      running = false
    })

    while (running) {
      await stream.writeSSE({
        event: 'tick',
        data: new Date().toISOString(),
        id: String(id++),
      })
      await stream.sleep(1000)
    }
  })
})

export default app
