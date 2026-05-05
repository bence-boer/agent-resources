# Streaming and Realtime

Use this when building streaming responses, SSE endpoints, WebSockets, or runtime-specific realtime entrypoints.

## Owned surface

This file owns `stream()`, `streamText()`, `streamSSE()`, abort/error lifecycle, streaming caveats, `upgradeWebSocket()`, WebSocket runtime imports, and `$ws()` notes.

## Streaming rules

- Once a stream starts, normal `app.onError()` cannot replace the response. Handle errors inside the stream callback.
- Always register cleanup with `stream.onAbort()`.
- Timeout middleware cannot be used directly with streams; close streams manually with timers.
- Cloudflare local streaming behavior may need `Content-Encoding: Identity` for development parity.

## SSE pattern

```ts
import { streamSSE } from 'hono/streaming'

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
```

## WebSocket matrix

| Runtime | Import/export |
|---|---|
| Cloudflare Workers | `upgradeWebSocket` from `hono/cloudflare-workers` |
| Deno | `upgradeWebSocket` from `hono/deno` |
| Bun | `upgradeWebSocket, websocket` from `hono/bun`; export `{ fetch: app.fetch, websocket }` |
| Node | use Node WebSocket helper package such as `@hono/node-ws` |

```ts
app.get('/ws', upgradeWebSocket(() => ({
  onMessage(event, ws) {
    ws.send(`echo: ${event.data}`)
  },
})))
```

## Anti-patterns

- **Global error rewrite:** stream errors must be handled in the streaming callback.
- **No abort cleanup:** long loops continue after clients disconnect.
- **Timeout middleware on stream:** close the stream manually.
- **Bun export omission:** WebSocket routes need the runtime websocket export.
- **Header middleware on upgrade:** CORS/header middleware can interfere with WebSocket upgrades; apply deliberately.

## Templates

Use [sse-endpoint.ts](../assets/templates/sse-endpoint.ts) or [websocket-endpoint.ts](../assets/templates/websocket-endpoint.ts).
