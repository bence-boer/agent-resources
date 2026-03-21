---
name: svelte-architect
description: >
  Architecture planning and review for Svelte 5 + SvelteKit applications. Use when deciding
  the app's route/layout structure, state and data boundaries, design system scope,
  dependency choices, migration strategy, or how a new feature should fit the existing
  system. Trigger on greenfield setup, structural review, architectural debt analysis,
  feature integration planning, or stack standardization. Do not use for file-level code
  changes, component implementation, or route/action authoring; use svelte-engineer for that.
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

If the request becomes file-level, hand off to [svelte-engineer](../svelte-engineer/SKILL.md).

## Routing order

- New app or new product area -> read [greenfield-setup](references/greenfield-setup.md)
- Existing app review, refactor, or migration -> read [architecture-review](references/architecture-review.md)
- Mixed task -> read the review first to understand constraints, then the greenfield guide to define the target state
- Once the architecture is decided, produce the structured handoff below, then stop and let the engineer implement

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

Use this ordering unless there is evidence otherwise:

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

Every feature plan should cover, at minimum:

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

1. **Architecture summary** - the recommended direction in a few sentences
2. **Chosen defaults** - the concrete defaults being adopted for routes, data, state, styling, validation, and API boundaries
3. **Structure map** - route groups, layout boundaries, feature areas, and shared layers; be specific enough to place work (for example, `routes/(app)/dashboard`, `routes/(app)/settings`, `routes/(marketing)/pricing`), but stop short of naming concrete implementation files
4. **State and data ownership** - what lives locally, in Context, on the server, or globally
5. **UX coverage** - where loading, error, empty, auth, and success states belong
6. **Risks and rejected alternatives** - the main tradeoffs and what was intentionally not chosen
7. **Implementation handoff** - what the engineer should now build, in what order, and under which constraints

Keep each section short, decisive, and implementation-ready. The handoff should be structured, not essay-like.

## Architectural red flags

Treat these as meaningful problems, not style nits:

- more than one state pattern for the same scope
- page CRUD data moved into global state without a strong reason
- feature code scattered across unrelated shared folders
- design-system primitives carrying domain logic
- route groups mirroring product domains instead of shells or access boundaries
- custom client fetching used where load/actions would be simpler and safer
- every new feature requiring a new abstraction before any real repetition exists
- architecture advice that never commits to an actual default
- page-specific components placed in the shared library without a second consumer
- shared component folders mirroring pages instead of reusable functions
- reusable UI with no clear primitive vs feature vs page-local ownership

## Handoff to the engineer

Stop once the architectural decisions are concrete enough to implement. Pass the engineer:

- the chosen route/layout map
- allowed state scopes for the feature
- the data-loading and mutation boundary
- required UX states
- approved libraries and conventions
- any migration sequencing or constraints
