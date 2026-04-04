# Greenfield Setup

Use this guide when planning a new Svelte 5 + SvelteKit application from scratch. It provides a concrete baseline so the app starts with a coherent shape instead of growing accidental patterns.

## 1. Starter defaults

Start with these defaults unless the task names a stronger constraint.

| Concern | Default |
| --- | --- |
| Framework | SvelteKit + TypeScript |
| Rendering model | SSR first, hydrate only where interaction needs it |
| Styling | Tailwind CSS v4 with explicit design tokens |
| Variant system | `tailwind-variants` for primitives |
| Headless behavior | `bits-ui` |
| Validation | Zod |
| Data reads | `+page.server.ts` / `+layout.server.ts` |
| Mutations | Form actions |
| Global client state | Keep minimal: auth/session, theme, feature flags |
| Type safety across backend | One typed client boundary, not scattered manual types |
| Shared component placement | Group reusable UI by function in `$lib/components`; keep page-only UI in `routes/**/components` |

If you deviate from one of these defaults, name the reason explicitly.

## 2. Start with shell boundaries

Plan route groups before feature directories.

Default shell map:

- `(marketing)` for public landing, docs, pricing, and SEO-heavy pages
- `(app)` for authenticated product flows
- `(auth)` only when sign-in, recovery, or onboarding needs a distinct shell
- `api/` only for external consumers, webhooks, or endpoints that are not naturally page-owned

Avoid grouping by domain first. A route tree like `(billing)/`, `(projects)/`, `(reports)/` at the top level usually bakes product taxonomy into the shell and makes layouts rigid.

## 3. Use a four-layer UI model

Start with these UI boundaries:

1. design tokens in `app.css`
2. `ui/` primitives in `$lib/components/ui/`
3. feature components in `$lib/components/[feature]/`
4. route-local components in `routes/**/components/`

Group shared components by function, not by page. Colocate route-only UI with its route and promote to shared only when proven reuse demands it (the engineer skill defines the concrete promotion threshold).

## 4. Plan state before creating stores

Apply the state scope hierarchy from the root skill — start with the most local scope and escalate only with evidence. A new app rarely needs more than a few true globals on day one. If a proposed global state item is really just route data, keep it on the server instead.

## 5. Choose a minimal primitive inventory

Do not try to build an entire design system before the first feature ships.

Good starter inventory:

- `Button`
- `Input`
- `Textarea`
- `Select` or combobox wrapper if the product needs it
- `Dialog` or drawer primitive
- `FormField` wrapper for labels, hints, and errors
- one loading primitive and one empty-state primitive

Add new primitives only when a second feature needs them or a consistency problem becomes obvious.

## 6. Make UX states part of the structure

Apply the UX completeness checklist from the root skill to each planned feature. If these states have nowhere natural to live, the feature boundary is not ready.

## 7. Lock in quality gates early

Set these expectations before the codebase grows:

- strict TypeScript
- ESLint with Svelte support
- Prettier with Svelte support
- shared validation at the boundary
- server and client error handling conventions

It is much cheaper to standardize these at project start than after several features exist.

## 8. Suggested directory blueprint

Use this as a starting point, then extend by domain rather than inventing new top-level buckets.

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── index.ts
│   │   │   └── button/
│   │   │       ├── button.svelte
│   │   │       └── index.ts
│   │   └── [feature]/
│   │       ├── widget.svelte
│   │       └── index.ts
│   ├── features/
│   ├── server/
│   ├── utils/
│   └── validation/
├── routes/
│   ├── (marketing)/
│   │   └── components/
│   ├── (app)/
│   │   └── [route]/
│   │       └── components/
│   ├── (auth)/
│   └── api/
├── hooks.server.ts
├── hooks.client.ts
├── app.d.ts
└── app.css
```

`app.css` owns design tokens, reusable utility classes, and shared data-attribute variants. The `ui/index.ts` barrel exposes primitives from `$lib/components/ui`; concrete export mechanics belong in the engineer layer.

Keep the number of top-level concepts small. If a new folder does not express ownership clearly, it probably does not belong yet.

## 9. Choose an adapter early

The deployment target affects architectural decisions. Pick before building features.

Default decision tree:

| Requirement | Default adapter |
| --- | --- |
| Full SSR + database access + custom server | `adapter-node` |
| Serverless with edge support | `adapter-vercel` or `adapter-cloudflare` |
| Static site or SPA | `adapter-static` with `fallback: '200.html'` if SPA |
| Don't know yet | `adapter-auto` — switch when the target is clear |

If deploying to a static host, set `trailingSlash: 'always'` and ensure all data comes from prerendering or client-side fetching.

## 10. Plan environment variables

SvelteKit provides four import paths for env vars. Choose deliberately:

| Import | When available | Access |
| --- | --- | --- |
| `$env/static/private` | Build time | Server only — inlined by bundler |
| `$env/static/public` | Build time | Server + client |
| `$env/dynamic/private` | Runtime | Server only — read from process.env |
| `$env/dynamic/public` | Runtime | Server + client |

Default: use static imports unless the value must change between deploys without a rebuild.

Validate required env vars at startup in `hooks.server.ts` and fail fast if missing.

## 11. Set performance baselines

Establish these targets before the first feature ships:

- LCP < 2.5s, FID < 100ms, CLS < 0.1
- Enable `cssMinify: 'lightningcss'` and `cssCodeSplit: true` in Vite build config
- Configure `manualChunks` for large vendor libraries to prevent one giant bundle
- Plan `data-sveltekit-preload-data="hover"` on primary navigation links

## 12. First-pass architecture checklist

Before implementation starts, confirm:

- route groups reflect shells and access boundaries
- server data flow is the default, not an afterthought
- global state is intentionally tiny
- design-system scope is intentionally small
- the first feature can show loading, empty, error, and success states naturally
- dependency choices are explicit and justified
- the implementation handoff is specific enough for an engineer to start without guessing
- adapter choice is explicit and matches the deployment target
- environment variable strategy follows the 4-path model
- performance baselines are set before features ship
