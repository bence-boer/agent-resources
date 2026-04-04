---
name: svelte-architect
description: >
  Architecture planning and review for Svelte 5 + SvelteKit applications. Use when deciding
  the app's route/layout structure, state and data boundaries, design system scope,
  dependency choices, migration strategy, or how a new feature should fit the existing
  system. Trigger on greenfield setup, structural review, architectural debt analysis,
  feature integration planning, or stack standardization. Do not use for file-level
  component implementation, route handler authoring, or Svelte 4→5 migration — those
  are implementation-level tasks.
---

# Svelte 5 Architect

Decide the shape of the system. Do not drift into file-level implementation.

## What this skill owns

This skill is responsible for:

- route, layout, and feature boundaries
- data ownership and state placement decisions
- design system scope and library choices
- greenfield project defaults
- architectural reviews and migrations
- feature completeness, UX coverage, and extensibility tradeoffs

This skill is not responsible for:

- writing `.svelte`, `.svelte.ts`, `+page.svelte`, or `+page.server.ts`
- defining exact prop, callback, snippet, or barrel-file APIs
- deciding how one large component should be split across concrete files
- giving code snippets unless a tiny example is unavoidable to explain a boundary

If the request becomes file-level, stop at the architectural boundary — file-level component, route, and action authoring is an implementation concern.

## Routing order

- New app or new product area -> read [greenfield-setup](references/greenfield-setup.md)
- Existing app review, refactor, or migration -> read [architecture-review](references/architecture-review.md)
- Mixed task -> read the review first to understand constraints, then the greenfield guide to define the target state
- Once the architecture is decided, produce the structured handoff below, then stop and let the engineer implement

## Expert vocabulary payload

**SvelteKit Architecture:** route groups, layout hierarchy, `+page.server.ts`, `+layout.server.ts`, `hooks.server.ts`, handle chain, `+layout.ts` universal load, `+error.svelte` boundary, `params` matcher, rest parameters, optional parameters, layout reset (`+layout@`), `$app/navigation` (`goto`, `invalidate`, `invalidateAll`), `$app/environment` (`browser`, `building`)

**State Architecture:** `$state` (Svelte 5 rune), `$derived`, `$effect`, Context API (`setContext`/`getContext`), `$app/state` (page, navigating, updated), `.svelte.ts` reactive modules, page-local vs global state, reactive boundaries, fine-grained reactivity, universal vs server load separation

**Component Architecture:** Svelte 5 runes, snippet blocks (`{#snippet}`), render delegation (`{@render}`), `{#each}` keyed lists, component composition vs inheritance, `$props()`, `$bindable()`, event forwarding via callback props, slot replacement with snippets

**Design System:** CSS custom properties, Tailwind CSS v4, design tokens (`@theme`), `tailwind-variants`, component variants, `data-slot` convention, `bits-ui` headless primitives, `class` prop merging (`clsx`/`cn`), responsive container queries, dark mode via `color-scheme`

**Data Flow:** server load functions, universal load functions, form actions (`use:enhance`), `ActionData`, `PageData`, progressive enhancement, streaming with `Promise` in load, `fail()` validation errors, `redirect()`, typed API clients (Hono `hc`, generated clients)

## Architectural anti-patterns

Treat these as structural problems, not style preferences. Check for them before finalizing any architecture decision.

### 1. Global state hoarding
**Detection:** Page CRUD data placed in global stores or singletons; components import global state for data that only one route uses.
**Resolution:** Move data to `+page.server.ts` load functions. Use the state scope hierarchy — start local, escalate only with evidence.

### 2. Flat route sprawl
**Detection:** All routes live at the top level with no route groups; layouts are either absent or a single deeply-nested chain; no clear shell boundaries.
**Resolution:** Introduce route groups by shell and access boundary (`(marketing)`, `(app)`, `(auth)`). Each group gets its own layout reflecting its navigation and chrome.

### 3. Shared folder as dumping ground
**Detection:** A generic `shared/` or `common/` directory with components that have no clear ownership; files added there by default rather than by proven reuse.
**Resolution:** Keep page-only components with their route. Promote to `$lib/components/[feature]/` only after a second real consumer exists. Group shared components by function, not by page.

### 4. Primitives carrying business logic
**Detection:** Design-system components (`Button`, `Dialog`, `Input`) import domain services, make API calls, or contain feature-specific branching.
**Resolution:** Strip business logic from primitives. Feature behavior belongs in feature components that compose primitives, not inside the primitives themselves.

### 5. Client fetching bypassing server loads
**Detection:** `fetch()` or `$effect`-based data loading in components where `+page.server.ts` or `+layout.server.ts` would work; duplicated auth/validation logic on the client.
**Resolution:** Default to server load functions and form actions. Escalate to client fetching only for real-time data, browser-only APIs, or polling requirements.

### 6. Monolithic page components
**Detection:** A single `+page.svelte` exceeding 300 lines; the page mixes layout chrome, data display, form handling, and interaction logic in one file.
**Resolution:** Decompose into layout (handled by `+layout.svelte`), feature components, and page-local components. Each piece should have one clear responsibility.

### 7. Premature abstraction
**Detection:** Abstraction layers (service wrappers, middleware, generic factories) introduced before any real repetition exists; new features require learning the abstraction before writing business logic.
**Resolution:** Default to the smallest durable abstraction. Add layers only when a clear ownership problem or proven duplication demands it.

## Default architectural baseline

Start here unless the task supplies a stronger constraint.

| Concern | Default decision | Escalate only when |
| --- | --- | --- |
| App shells | Use top-level route groups by shell or access boundary, usually `(marketing)` + `(app)`; add `(auth)` only if auth screens need a separate shell | You have multiple products, tenants, or admin surfaces |
| Data reads | Prefer `+page.server.ts` / `+layout.server.ts` so the server stays the source of truth | The feature is browser-only or requires live client polling/subscriptions |
| Mutations | Prefer SvelteKit form actions for app-owned forms and CRUD | The endpoint is consumed externally or is not page-owned |
| UI state | Keep it local to the page or component that owns the interaction | Multiple distant consumers truly need the same live state |
| Shared subtree state | Use Context at the compound/root boundary | The state must survive route changes or exist outside one subtree |
| Global shared state | Reserve singletons for auth/session, theme, feature flags, and rare long-lived client workflows | The state is just page data or a short-lived interaction |
| Styling stack | Tailwind CSS v4 + design tokens + `tailwind-variants` | The organization has a mandated styling system |
| Headless behavior | `bits-ui` for accessible primitives, styled in-house | The needed primitive does not exist or a dependency ban applies |
| Validation | Shared Zod schemas at form, route, and API boundaries | Another schema system is already mandated across the stack |
| API typing | Prefer one typed boundary between frontend and backend, such as Hono `hc` or generated clients | The backend stack cannot expose typed contracts |

## Architecture decision rules

### 1. Organize by ownership, not by convenience

- Group routes by shell, navigation, and access control, not by an arbitrary feature taxonomy.
- Keep domain UI close to the feature it serves. Avoid a generic `shared/` dumping ground.
- Keep design-system primitives separate from feature components. If a primitive needs business logic, it is no longer a primitive.
- Keep page-only UI with the route that owns it. Move components into `$lib/components` only after they have more than one real consumer, and group that shared library by function rather than by page.

### 2. Keep server-owned data on the server by default

Use the server as the source of truth for entity data, authorization, and validation unless the product truly needs a richer client model.

Good default:

- reads in `+page.server.ts` or `+layout.server.ts`
- writes through actions
- client invalidation or progressive enhancement after writes

Escalate to a richer client-side state layer only for:

- real-time collaboration
- local-first or offline flows
- long-running optimistic workflows
- browser APIs that cannot be mediated through normal page actions

### 3. Make state scope explicit

Use this hierarchy unless there is evidence otherwise:

1. component-local state
2. page-local state
3. subtree Context
4. route-shared layout state
5. global singleton

If a proposal jumps straight to global state, justify why the lower scopes fail.

### 4. Design the UI as layers

Default layering:

1. design tokens
2. `ui/` primitives
3. feature components in `$lib/components/[feature]`
4. page-local components in `routes/**/components`

Promote page-local pieces only when reuse is proven. Avoid collapsing these layers together. A page should not become the design system, and a primitive should not become the feature.

### 5. Architect for complete user journeys

Every feature plan must cover these UX states, at minimum:

- loading state
- empty state
- expected error state
- unauthorized or unavailable state
- success confirmation or post-submit transition
- responsive/mobile behavior
- accessibility implications

If the architecture makes these states awkward to place, the structure is probably wrong.

### 6. Prefer the smallest durable abstraction

Default to a small number of obvious architectural seams:

- route groups for shells and access control
- a feature directory per domain or product area
- one design-system layer
- one data-boundary strategy

Avoid adding extra abstraction layers "just in case." New layers need a clear ownership problem to solve.

## Concrete deliverables

Do not return a vague essay. Make decisions.

Use this response structure:

1. **Architecture summary** — the recommended direction in a few sentences
2. **Chosen defaults** — the concrete defaults being adopted for routes, data, state, styling, validation, and API boundaries
3. **Structure map** — route groups, layout boundaries, feature areas, and shared layers; be specific enough to place work (for example, `routes/(app)/dashboard`, `routes/(app)/settings`, `routes/(marketing)/pricing`), but stop short of naming concrete implementation files
4. **State and data ownership** — what lives locally, in Context, on the server, or globally
5. **UX coverage** — where loading, error, empty, auth, and success states belong
6. **Risks and rejected alternatives** — the main tradeoffs and what was intentionally not chosen
7. **Implementation handoff** — what the engineer should now build, in what order, and under which constraints

Keep each section short, decisive, and implementation-ready. The handoff should be structured, not essay-like.

## Handoff to the engineer

Stop once the architectural decisions are concrete enough to implement. Pass the engineer:

- the chosen route/layout map
- allowed state scopes for the feature
- the data-loading and mutation boundary
- required UX states
- approved libraries and conventions
- any migration sequencing or constraints

## Examples

### BAD: Flat route structure → GOOD: Grouped routes with shared layouts

**BAD:**
```
src/routes/
├── +layout.svelte        ← one layout for everything
├── landing/+page.svelte
├── pricing/+page.svelte
├── dashboard/+page.svelte
├── settings/+page.svelte
├── login/+page.svelte
└── signup/+page.svelte
```
No shell boundaries. Marketing pages share layout chrome with the authenticated app. Adding a sidebar to the dashboard forces conditional logic in the single root layout.

**GOOD:**
```
src/routes/
├── (marketing)/
│   ├── +layout.svelte        ← marketing chrome: navbar, footer
│   ├── landing/+page.svelte
│   └── pricing/+page.svelte
├── (auth)/
│   ├── +layout.svelte        ← minimal centered layout
│   ├── login/+page.svelte
│   └── signup/+page.svelte
└── (app)/
    ├── +layout.svelte        ← app shell: sidebar, header
    ├── +layout.server.ts     ← auth guard, shared user data
    ├── dashboard/+page.svelte
    └── settings/+page.svelte
```
Each group gets a layout matching its shell. Auth guards load once in `(app)/+layout.server.ts`. Marketing pages stay SSR-optimized without app-shell overhead.

### BAD: Global store for page-local state → GOOD: Page-scoped state

**BAD:**
```typescript
// $lib/stores/dashboard.ts — global store
import { writable } from 'svelte/store';
export const dashboardFilters = writable({ dateRange: 'week', status: 'all' });
export const dashboardData = writable([]);
```
Dashboard filter state is global even though only one page uses it. Navigating away and back may show stale state. Other pages can accidentally import and mutate it.

**GOOD:**
```typescript
// routes/(app)/dashboard/dashboard-state.svelte.ts — page-scoped
export function createDashboardState(initial: PageData) {
  let filters = $state({ dateRange: 'week', status: 'all' });
  let data = $derived(/* compute from initial + filters */);
  return {
    get filters() { return filters; },
    set filters(v) { filters = v; },
    get data() { return data; }
  };
}
```
State lives with its owning route. Destroyed on navigation. No global pollution. Uses Svelte 5 runes instead of legacy stores.

### BAD: Monolithic page → GOOD: Decomposed architecture

**BAD:**
```svelte
<!-- +page.svelte: 400+ lines mixing every concern -->
<script>
  let { data } = $props();
  // auth checks, filter logic, form handling, modal state,
  // table sorting, toast notifications — all in one file
</script>

<!-- 300+ lines of template: layout chrome, forms, tables, modals -->
```
The page is the layout, the feature, and the design system all at once. Every change risks breaking unrelated behavior.

**GOOD:**
```
routes/(app)/projects/
├── +layout.svelte           ← app chrome (sidebar, breadcrumbs)
├── +layout.server.ts        ← auth guard, shared project context
├── +page.svelte             ← thin orchestrator: composes feature components
├── +page.server.ts          ← data loading and form actions
└── components/
    ├── project-filters.svelte
    ├── project-table.svelte
    └── create-project-dialog.svelte
```
Layout handles chrome. Server files handle data and auth. The page composes focused feature components. Each piece has one job and can change independently.

## Questions this skill answers

- "How should I structure this SvelteKit app?"
- "Plan the route groups and layouts"
- "Where should this feature live in the codebase?"
- "Review the architecture of this Svelte project"
- "What state management approach should I use?"
- "Should I use server load or client fetch?"
- "Help me plan a new SvelteKit project"
- "How do I organize routes and layouts?"
- "What's the right data boundary for this feature?"
- "Audit this app's architectural decisions"
