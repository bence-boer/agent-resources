# Deployment and Routing Strategy

Use this guide when choosing an adapter, planning advanced routing, or designing hook composition.

---

## 1. Adapter Selection

### Decision matrix

| Requirement | Recommended adapter | Key tradeoffs |
|---|---|---|
| Full SSR + database + custom server needs | `adapter-node` | Full control, self-hosted, requires server ops |
| Serverless, automatic scaling, edge support | `adapter-vercel` | Zero-ops, ISR support, vendor lock-in |
| Edge-first, Cloudflare ecosystem (KV, D1, R2) | `adapter-cloudflare` | Fast cold starts, limited Node APIs |
| Pure static site, CDN hosting | `adapter-static` | Cheapest, no SSR, prerender-only |
| GitHub Pages, Netlify static | `adapter-static` + `trailingSlash: 'always'` | No dynamic routes |
| Unknown or early stage | `adapter-auto` | Switch when target is clear |

### Platform capabilities

| Capability | node | vercel | cloudflare | static |
|---|---|---|---|---|
| SSR | ✅ | ✅ | ✅ | ❌ |
| Edge functions | ❌ | ✅ | ✅ | ❌ |
| Streaming | ✅ | ✅ | ✅ | ❌ |
| WebSockets | ✅ | ❌ | ✅ (Durable Objects) | ❌ |
| File system | ✅ | ❌ (read-only /tmp) | ❌ | ❌ |
| ISR | ❌ | ✅ | ❌ | ❌ |
| Custom server | ✅ | ❌ | ❌ | ❌ |

> **ISR note:** `adapter-vercel` supports Incremental Static Regeneration via `isr: { expiration: 60 }` in route config — useful for content that changes infrequently but must not be fully static.

---

## 2. Advanced Routing Strategy

### Route parameter matchers

- **When to use:** Validate route parameters at the routing level, not inside load functions.
- **Location:** `src/params/` — sync functions returning boolean.
- **Use for:** integer IDs, UUIDs, date formats, enum values, locale codes.
- **Architectural decision:** Matchers prevent invalid URLs from reaching load functions, reducing error handling complexity.

### Layout breaking with `@`

- **When to use:** A page in a route group needs a different layout than its siblings (e.g., a print view that should skip the app shell).
- **Syntax:** `+page@.svelte` resets to root layout. `+page@(group).svelte` targets a specific group's layout.
- **Architectural decision:** Use sparingly — frequent layout breaking signals the route group boundaries are wrong.

### Multi-language routing

- **Pattern:** Optional parameters `[[lang=locale]]` with a locale matcher.
- **Hook:** The `reroute` hook (in `hooks.js`) translates localized URLs to canonical paths.
- **Architectural decision:** Choose between URL-based (`/en/about`, `/de/about`) vs subdomain-based (`en.site.com`) early — it affects the entire route structure.

### Versioned APIs

- **Pattern:** `api/[[version=apiVersion]]/endpoint` with a version matcher.
- **Architectural decision:** Version the API surface only when backward compatibility is needed for external consumers. Internal SvelteKit page loads don't need versioning.

### Transport hook

- **When to use:** Custom types (Date objects, classes, Map/Set) must cross the server→client boundary.
- **Mechanism:** Define `transport` in `hooks.js` with encode/decode pairs.
- **Architectural decision:** Keep transport types minimal — prefer plain serializable data in load functions.

---

## 3. Hook Composition Strategy

### Server hooks (`hooks.server.ts`)

Compose with `sequence()` from `@sveltejs/kit/hooks`. Each handle function should be single-purpose.

**Recommended handle order:**

| Order | Responsibility | Rationale |
|---|---|---|
| 1 | Rate limiting / IP blocking | Fail fast before any work |
| 2 | Authentication | Populate `event.locals.user` |
| 3 | Authorization redirects | Guard protected routes |
| 4 | Request decoration | Add tracing IDs, set headers |
| 5 | Response transformation | Analytics injection via `transformPageChunk` |

### Key hook decisions

| Hook / API | When to use |
|---|---|
| `handleFetch` | Server must rewrite fetch URLs (internal service discovery) or forward cookies to subdomains |
| `filterSerializedResponseHeaders` | Whitelist headers visible to client-side `fetch` calls during universal load |
| `preload` callback in handle | Control which JS, CSS, and font assets are link-preloaded — critical rendering path optimization |
| `handleError` | **Always implement.** Default exposes raw errors. Return a safe `App.Error` shape |
| `getRequestEvent()` | Extract from `$app/server` for reusable auth utilities needing current request context |

---

## 4. Configuration Strategy

### CSP (Content Security Policy)

- Enable when the app serves user-generated content.
- `mode: 'hash'` for static content, `'nonce'` for dynamic inline scripts.
- Start with `reportOnly` to detect violations before enforcing.

### Version detection

- Set `version.pollInterval` to enable client-side update detection.
- The `updated` store from `$app/state` signals when a new deployment is available.

### Prerendering

- Configure `prerender.handleMissingId` and `handleHttpError` to catch broken links at build time.
- Use `prerender.entries` to seed the crawler with dynamic paths.

### Environment variables

Choose the right import path based on visibility and timing:

| | Private (server-only) | Public (server + client) |
|---|---|---|
| **Static (build-time)** | `$env/static/private` — inlined, tree-shakeable | `$env/static/public` — inlined into client bundle |
| **Dynamic (runtime)** | `$env/dynamic/private` — reads `process.env` | `$env/dynamic/public` — served at runtime |

- **Default to static imports.** Use dynamic only when values must change between deploys without rebuilding.
- Static private is the most secure and performant option — values never leave the server and are eliminated by tree-shaking when unused.
