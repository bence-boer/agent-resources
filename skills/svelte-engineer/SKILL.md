---
name: svelte-engineer
description: >
  File-level implementation skill for Svelte 5 + SvelteKit. Use when creating or editing
  `.svelte`, `.svelte.ts`, `+page.svelte`, `+page.server.ts`, `+server.ts`, hooks, actions,
  or typed component utilities; when migrating Svelte 4 patterns to Svelte 5; or when
  splitting, extracting, and refining Svelte files to match an existing architecture. Do not
  use for broad app architecture, route-group strategy, dependency selection, or structural
  audits; use svelte-architect for those.
---

# Svelte 5 Engineer

Implement the chosen architecture cleanly and precisely. Stay at the file, component, and route level.

## What this skill owns

Use this skill for:

- creating or editing Svelte components and rune-based utilities
- implementing pages, load functions, actions, hooks, and API handlers
- defining concrete prop, callback, snippet, and export surfaces
- splitting large files and extracting minimal abstractions
- migrating Svelte 4 patterns to Svelte 5 patterns

Do not use this skill to:

- redesign the app's overall route grouping or information architecture
- choose the stack unless the project has already standardized it
- invent new global patterns when a local implementation decision will solve the task

If architecture is genuinely undecided and blocks the work, pause and route to [svelte-architect](../svelte-architect/SKILL.md). Ask for the missing handoff items explicitly: route/group placement, state ownership, data boundary, approved dependencies, and required UX states.

## Reference routing

Read only what matches the change surface.

- UI component or primitive work -> [component-patterns](references/component-patterns.md)
- rune logic, Context, or shared state -> [state-reactivity](references/state-reactivity.md)
- routes, loads, actions, hooks, or invalidation -> [sveltekit-patterns](references/sveltekit-patterns.md)
- typing, schemas, or frontend/backend contracts -> [typescript-patterns](references/typescript-patterns.md)
- migration or review of old code -> [anti-patterns](references/anti-patterns.md)

## File placement defaults

Choose the narrowest file that can own the change.

| If you are changing... | Default file | Do not default to |
| --- | --- | --- |
| DOM rendering and interactive UI | `.svelte` component | `.svelte.ts` |
| Rune-based reusable logic with no DOM | `.svelte.ts` | plain `.ts` |
| Pure types, schemas, constants, helpers | `.ts` | `.svelte.ts` |
| Page-owned server reads or actions | `+page.server.ts` | client fetch in the page |
| Thin page composition | `+page.svelte` | one giant feature component |
| Complex page-local client workflow | `page.svelte.ts` alongside the page | global singleton |
| External or webhook API endpoint | `+server.ts` | page action |
| Cross-route auth or request wiring | `hooks.server.ts` / `hooks.client.ts` | ad hoc logic in pages |

## Svelte 5 correctness rules

These are implementation boundaries, not stylistic preferences.

- Use `$props()` instead of `export let`.
- Use callback props instead of `createEventDispatcher`.
- Use snippets instead of `<slot>`.
- Use `$derived` for computed state and reserve `$effect` for side effects.
- Use `.svelte.ts` for files that contain runes outside a component.
- Prefer named exports and barrel files for components.
- Pass DOM classes through `class: class_name` and compose with `cn()`.
- Define reusable variants and exported component types in `<script lang="ts" module>`.
- Use arrays in `tv()` and multi-line template classes once a class list stops being readable on one line.
- Use enums for closed string domains such as variants, sizes, modes, and statuses. Enum members use `SCREAMING_SNAKE_CASE`; enum values stay kebab-case.
- Use `type` imports and exports only for true types. Enums, const maps, variant helpers, and other runtime values stay value imports and exports.

## Component API defaults

Make component surfaces small, typed, and predictable.

| Concern | Default |
| --- | --- |
| Prop order | `ref`, `class`, variant props, behavior props, snippet props, `...rest_props` |
| Ref exposure | `ref = $bindable(null)` as the first prop when the root element needs to be exposed |
| Child content | `children` is the default snippet; add named snippets only for stable regions like `header`, `footer`, or `trigger` |
| Semantic events | Use callback props named for the action: `on_save`, `on_select`, `on_close` |
| DOM events | Pass through native event attributes like `onclick` rather than wrapping them into a custom callback unless the meaning changes |
| Variant API | Define visual variants once in module scope, back closed string domains with enums, export runtime helpers as values, and export prop types with `type` |
| Export surface | Shared primitives use both a local barrel (`ui/button/index.ts`) and the package barrel (`ui/index.ts`) so consumers import from `$lib/components/ui` |
| Data props | Pass the narrow data shape the component needs, not a whole service or store object |

## Shared component organization

- Put each reusable component in its own directory under `$lib/components/ui/` or `$lib/components/[feature]/`.
- Keep page-specific components in `routes/**/components/`.
- Promote a page-local component into `$lib/components` only after a second consumer appears.
- Use the local `index.ts` barrel as the component surface and re-export shared primitives again from `$lib/components/ui/index.ts`; see [component-patterns](references/component-patterns.md) for the concrete pattern.

## Page defaults

Pages should stay as thin orchestrators.

Default split:

- `+page.server.ts` owns auth checks, parameter parsing, server reads, and actions
- `+page.svelte` consumes typed `data`, renders layout, and wires feature components together
- `page.svelte.ts` exists only when the page has meaningful client-side coordination that would otherwise bloat `+page.svelte`

Create `page.svelte.ts` when at least one of these is true:

- the page owns more than one async client workflow
- optimistic UI or reconciliation logic would crowd the page
- real-time or browser-only behavior is page-scoped
- the page script would otherwise exceed roughly 40 lines of non-trivial stateful logic

## State ownership defaults

Keep state where the interaction naturally lives.

| State type | Default owner |
| --- | --- |
| One component's visual state | the component |
| A form field controlled by a parent | `$bindable` prop at the nearest real owner |
| Shared state across parts of one compound component | Context at the compound root |
| Page-specific interaction state | `+page.svelte` or `page.svelte.ts` |
| Route data from the server | `load` data + invalidation |
| Session, theme, feature flags | singleton `.svelte.ts` module if the app already uses that pattern |

Do not reach for global state just because two siblings need the same value. Lift state first.

## Splitting and abstraction rules

Use these defaults to keep files cohesive.

### Split a component when

- the file exceeds roughly 150 lines and contains more than one real responsibility
- a subsection has its own prop contract and can be understood independently
- a piece of state belongs to only one subsection of the template
- future edits are likely to touch one part without touching the rest

### Do not split a component when

- the new file would only pass props through
- the extracted piece has no meaningful public interface
- the split would scatter one cohesive interaction across several files

### Extract to `.svelte.ts` when

- rune-based logic is reused
- component script logic is stateful and independently understandable
- Context or a page handler needs its own file

### Extract to plain `.ts` when

- the code is pure and rune-free
- it is a type, schema, constant, mapper, or helper

### Create an abstraction when

- the same shape appears in at least three real uses
- the abstraction reduces decisions for future callers
- the interface is smaller than the duplicated knowledge it replaces

## Naming and exposure defaults

- component files: kebab-case
- component exports: PascalCase
- rune utilities: snake_case function or class exports in `.svelte.ts`
- enum members: `SCREAMING_SNAKE_CASE` with kebab-case runtime values
- callback props: `on_verb` or `on_domain_action`
- snippet props: semantic names, but keep the set small
- `data-slot` values: semantic and stable, matching the rendered part name

## Output expectations

When implementing, be concrete:

- identify the files that should own the change
- keep ownership boundaries explicit
- avoid widening the abstraction surface unless the task really needs it
- if an architectural gap blocks implementation, name the exact missing decision instead of asking for a broad re-plan
