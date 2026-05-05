# Rendering, Static Files, and JSX

Use this when returning HTML, using Hono JSX, adding layouts, using the CSS helper, serving static files, or generating static output.

## Owned surface

This file owns `c.html()`, `hono/html`, `raw()`, JSX setup, renderer middleware, CSS helper, static-file serving differences, and SSG helpers. Security header details belong in `security-auth.md`.

## HTML and raw output

```ts
import { html, raw } from 'hono/html'

app.get('/', (c) => c.html(html`<h1>Hello Hono</h1>`))
```

Use `raw()` only for trusted literals. Escape or encode user-controlled data.

## JSX setup

Use `.tsx` files and configure JSX for Hono:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

```tsx
const Page = () => <h1>Hello</h1>

app.get('/', (c) => c.html(<Page />))
```

## Renderer middleware

```tsx
import { jsxRenderer } from 'hono/jsx-renderer'

app.use('*', jsxRenderer(({ children }) => (
  <html>
    <body>{children}</body>
  </html>
)))

app.get('/', (c) => c.render(<h1>Home</h1>))
```

## Static files by runtime

| Runtime | Pattern |
|---|---|
| Node | `serveStatic` from `@hono/node-server/serve-static`; resolve root carefully. |
| Bun | `serveStatic` from `hono/bun`. |
| Cloudflare Workers | Prefer platform Static Assets configuration. |
| Deno | `serveStatic` from `hono/deno`. |

## SSG

Use SSG helpers for routes that should be rendered to files: `toSSG`, `ssgParams`, `isSSGContext`, `disableSSG`, `onlySSG`, and plugins. Keep route rendering deterministic and separate platform static hosting configuration from app rendering.

## Anti-patterns

- **Missing JSX setup:** use `.tsx`, `jsx: react-jsx`, and `jsxImportSource: hono/jsx`.
- **Raw user content:** never pass untrusted input to `raw()`.
- **CSP without nonce:** integrate secure headers nonce with inline scripts/styles and CSS helper output.
- **Static runtime copy-paste:** Node, Bun, Cloudflare, and Deno static-file mechanics differ.

## Templates

Use [jsx-renderer.tsx](../assets/templates/jsx-renderer.tsx) or [static-files.ts](../assets/templates/static-files.ts).
