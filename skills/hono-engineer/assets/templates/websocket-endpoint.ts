import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/cloudflare-workers'

const app = new Hono()

app.get('/ws', upgradeWebSocket(() => ({
  onMessage(event, ws) {
    ws.send(`echo: ${event.data}`)
  },
  onClose() {
    console.log('closed')
  },
})))

export default app

// Bun: import { upgradeWebSocket, websocket } from 'hono/bun'
// and export { fetch: app.fetch, websocket }.
