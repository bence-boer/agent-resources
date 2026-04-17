---
name: svelte-engineer
description: >
  File-level implementation skill for Svelte 5 + SvelteKit. Use when creating or editing
  `.svelte`, `.svelte.ts`, `+page.svelte`, `+page.server.ts`, `+server.ts`, hooks, actions,
  or typed component utilities; when migrating Svelte 4 patterns to Svelte 5; or when
  splitting, extracting, and refining Svelte files to match an existing architecture. Do not
  use for broad app architecture, route-group strategy, dependency selection, or structural
  audits; those are architecture-level decisions.
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

If architecture is genuinely undecided and blocks the work, pause and route to the architecture-level skill. Ask for the missing handoff items explicitly: route/group placement, state ownership, data boundary, approved dependencies, and required UX states.

## Reference routing

Read only what matches the change surface.

- UI component or primitive work -> [component-patterns](references/component-patterns.md)
- rune logic, Context, or shared state -> [state-reactivity](references/state-reactivity.md)
- routes, loads, actions, hooks, or invalidation -> [sveltekit-patterns](references/sveltekit-patterns.md)
- typing, schemas, or frontend/backend contracts -> [typescript-patterns](references/typescript-patterns.md)
- `{@attach}`, `fromAction()`, function bindings, `<svelte:boundary>`, `ClassValue`, style/`:global` directives -> [attachments-and-directives](references/attachments-and-directives.md)
- `createContext`, `Spring`/`Tween`, `MediaQuery`, `SvelteMap`/`Set`, `on()`, `tick`, `createSubscriber`, `fork` -> [svelte-api-modules](references/svelte-api-modules.md)
- migration or review of old code -> [anti-patterns](references/anti-patterns.md)
- Tailwind v4 CSS-first config, dark mode, utilities -> [tailwind-v4-patterns](references/tailwind-v4-patterns.md)
- lazy loading, prefetch, images, fonts, bundle analysis, CWV -> [performance-patterns](references/performance-patterns.md)

## Expert vocabulary

- **Rune system**: `$props()`, `$derived`, `$derived.by`, `$state`, `$state.raw`, `$state.snapshot`, `$state.eager`, `$effect`, `$effect.pre`, `$effect.tracking`, `$effect.root`, `$bindable`, `$inspect`, `$props.id`, rune, fine-grained reactivity, function bindings (`bind:value={() => val, setter}`)
- **Component surface**: snippet, `{@render}`, `data-slot`, class prop, `ClassValue` (from `svelte/elements`), `cn()` (clsx + twMerge), `tv()` (tailwind-variants, Joe Bell), bits-ui, Formsnap, `{@attach}`, `fromAction()` (svelte/attachments), `svelte:boundary` (`onerror`, `failed`/`pending` snippets)
- **SvelteKit data flow**: `+page.server.ts`, `+layout.server.ts`, load function, actions, `use:enhance`, `invalidate`, `depends`, `$app/state`, `handleFetch`, `transformPageChunk`, `filterSerializedResponseHeaders`, `preloadData`, `preloadCode`, `data-sveltekit-preload-data`, `getRequestEvent`, `sequence()` hook composition, `transport` hook, remote functions (`.remote.ts`, `query`, `command`, `form`, `prerender`), `refreshAll()`, `pushState`, `replaceState`, `App.PageState`, `onNavigate`, `resolve()` from `$app/paths`, `match()` (v2.52+)
- **Styling / variants**: tailwind-variants, clsx + twMerge, CSS custom properties, Tailwind v4, `@utility`, `@custom-variant`, `@theme` block, `@source` directive, `@plugin` directive, `@import "tailwindcss"`, Lightning CSS (`cssMinify: 'lightningcss'`)
- **Svelte API modules**: `createContext<T>()` (v5.40+, module-scope only), `on()` from `svelte/events`, `Spring`/`Tween` classes (v5.8+), `MediaQuery` from `svelte/reactivity`, `SvelteMap`/`SvelteSet`/`SvelteDate`/`SvelteURL`, `svelte/reactivity/window`, `createSubscriber`, `toStore`/`fromStore`, `fork`/`Fork` (v5.42+), `getAbortSignal()`, `settled()` (v5.36+), `$effect.pending`, `untrack`, `tick`, `flushSync`, `prefersReducedMotion`
- **Migration**: Svelte 4→5, `export let` → `$props()`, stores → runes, `<slot>` → snippet, `$app/stores` → `$app/state`, `spring()`/`tweened()` → `Spring`/`Tween`, `getContext/setContext+Symbol` → `createContext<T>()`, `use:action` → `{@attach}`
- **Debugging & Performance**: `$inspect`, `DEBUG=vite:*`, `DEBUG=kit:*`, `css: { devSourcemap: true }`, `rollup-plugin-visualizer`, `web-vitals`, `requestIdleCallback`, `IntersectionObserver` lazy loading

## Anti-pattern watchlist

1. **Effect-for-derivation** — using `$effect` to assign a `$state` variable when `$derived` would suffice. Detection: `$effect` body contains an assignment whose value depends only on other reactive values. Fix: replace with `$derived` or `$derived.by`.
2. **Premature global state** — reaching for a module-level singleton or global store when page-local Context or component state would suffice. Fix: keep state at the narrowest scope; use Context for compound component subtrees.
3. **God component** — component over ~150 lines mixing layout, logic, and data fetching. Fix: split into page + feature component + `.svelte.ts` handler.
4. **Prop drilling through wrappers** — passing props through intermediate wrapper components instead of using the Context API. Fix: introduce a Context at the compound root.
5. **Store-in-component** — defining shared reactive state inside a `.svelte` file instead of a `.svelte.ts` module. Fix: extract to a colocated `.svelte.ts` file so the state is importable and testable.
6. **Missing type imports** — using `import { X }` for types instead of `import type { X }` with `verbatimModuleSyntax` enabled. Fix: use `import type` for pure types; keep value imports for enums, const maps, and runtime helpers.
7. **Runes in SSR context** — using `$state` or `$effect` in code that runs server-side (e.g., top-level module scope executed during SSR, or inside `+page.server.ts`). Detection: runtime error "$state is not defined" or silent SSR mismatch. Fix: confine `$state` and `$effect` to `.svelte` and `.svelte.ts` files; use load function data for server-derived values.
8. **Dynamic Tailwind class interpolation** — constructing class names with template literals like `bg-${color}-500`. Detection: classes missing in production after CSS purging. Fix: always use complete class names; for truly dynamic values, use CSS custom properties with `style:` directive.
9. **Scoped `<style>` for utility-available concerns** — using `<style>` blocks with `@apply` or data-attribute selectors (`[data-state="active"] { ... }`) when Tailwind utilities or data-variants exist. Fix: use `data-[state=active]:bg-primary` inline, `@custom-variant` in `app.css`, or `@utility` blocks. Reserve `<style>` for CSS with no utility equivalent.
10. **Module-scope remote query** — calling a `.remote.ts` `query()` at module scope (e.g., `const todos = get_todos(...)` at the top of a `.ts` file). Remote queries must be anchored to a reactive context (component script, `$derived`, `$effect`) to be tracked and garbage-collected. Detection: query defined outside any component or reactive scope. Fix: move inside a component script or wrap in `$derived`.

## Core design principles

Three principles guide every implementation decision in this skill.

- **Locality of Behavior** — code should be self-explanatory from local context. Side effects, state mutations, and logic should live near the code that causes them. Avoid spooky action at a distance: a reader at any call site should understand what happens without jumping to distant modules.
- **Composition over Inheritance** — compose behaviours via snippets, stores, context, and flat utilities. Prefer small, focused building blocks over class hierarchies. A component that needs new behaviour gets a new collaborator, not a new base class.
- **Data Immutability** — state lives at the narrowest scope that owns it. Prefer `$state.raw` + wholesale replacement over mutating objects in-place and passing mutable references around. Derive new values; do not mutate and re-share.

## Promise chains over try/catch

Do not wrap `await` in `try { } catch { }`. Use `.then().catch()` promise chains for async error handling.

```ts
// ❌ try/catch wrapping await
async refresh() {
  this.is_loading = true;
  try {
    const response = await client.api.todos.$get();
    this.todo_list = await response.json();
  } catch (error) {
    this.error_message = error instanceof Error ? error.message : 'Failed to load';
  } finally {
    this.is_loading = false;
  }
}
```

```ts
// ✅ promise chain — no try/catch
refresh(): Promise<void> {
  this.is_loading = true;
  return client.api.todos.$get()
    .then((response) => response.json())
    .then((data: Todo[]) => { this.todo_list = data; })
    .catch((error: unknown) => {
      this.error_message = error instanceof Error ? error.message : 'Failed to load';
    })
    .finally(() => { this.is_loading = false; });
}
```

## Switch exhaustiveness

When branching on an enum or closed string domain with three or more branches, use `switch` with a `default` that asserts the remaining value is `never`. TypeScript then catches any missing cases at compile time.

```ts
// ✅ exhaustive switch — compile error if a FilterStatus case is added without updating this
switch (filter_status) {
  case FilterStatus.ALL:    return todos;
  case FilterStatus.ACTIVE: return todos.filter((todo) => !todo.done);
  case FilterStatus.DONE:   return todos.filter((todo) => todo.done);
  default: throw new Error(`Unhandled FilterStatus: ${filter_status satisfies never}`);
}
```

For simple value → value lookups with no branching logic, use an `as const satisfies` lookup object instead of a switch:

```ts
// ✅ lookup object for simple key→value mapping
const STATUS_LABEL = {
  [FilterStatus.ALL]:    'All items',
  [FilterStatus.ACTIVE]: 'Active',
  [FilterStatus.DONE]:   'Completed',
} as const satisfies Record<FilterStatus, string>;
```

## File placement defaults

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
- Use promise chains (`.then().catch()`) instead of `try { await } catch` for async error handling. Never wrap an `await` in a `try/catch` block.
- When branching on an enum or closed-domain variable with three or more cases, use `switch` with `default: throw new Error(\`Unhandled: \${variable satisfies never}\`)` exhaustiveness guard. For simple value-to-value mapping use an `as const satisfies Record<EnumType, ValueType>` lookup object.
- ALL compile-time constant object and array literals must use `as const satisfies SpecificType`. Neither `as const` alone nor `satisfies` alone is sufficient.

## Extended rune API

Beyond the core runes, these variants handle specific scenarios:

| Rune variant | Purpose | When to use |
| --- | --- | --- |
| `$state.raw(value)` | Shallow reactive — no deep proxy | Large arrays or objects replaced wholesale, never mutated in-place |
| `$state.snapshot(state)` | Plain object from reactive proxy | Passing to `structuredClone`, `JSON.stringify`, `console.log`, or external APIs that reject proxies |
| `$state.eager(value)` | Immediate UI update during async | Navigation feedback, optimistic UI that must render before `await` completes |
| `$effect.pre(() => {...})` | Runs before DOM update | Auto-scroll: read scroll position before DOM changes |
| `$effect.tracking()` | Boolean: is code in tracking context? | Conditional behavior in library utilities |
| `$effect.root(() => {...})` | Untracked scope with manual cleanup | Library-level abstractions managing their own lifecycle |
| `$props.id()` | Component-unique, SSR-consistent ID | Accessible form labels: `<label for={id}>` + `<input id={id}>` |
| `$inspect(value)` | Dev-only reactive debugger | Tracking state changes during development — stripped in production |
| `$derived` destructuring | `let { a, b } = $derived(fn())` | All destructured variables stay reactive |
| `$derived` overriding | Temporarily reassign a `$derived` | Optimistic UI: override derived value, revert when server confirms |
| Function bindings | `bind:value={() => val, setter}` | Custom binding logic: transform or validate on write |

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

## Debugging

- Use `$inspect(value)` during development to trace reactive state changes — it logs on every update and is stripped in production builds.
- Enable verbose SvelteKit logging with `DEBUG=kit:* npm run dev` and Vite logging with `DEBUG=vite:*`.
- Enable CSS source maps in development: `css: { devSourcemap: true }` in `vite.config.ts`.
- For hydration mismatches, check for non-deterministic values in templates (`Date.now()`, `Math.random()`). Move these to load functions or `$effect`.

## Output expectations

When implementing, be concrete:

- identify the files that should own the change
- keep ownership boundaries explicit
- avoid widening the abstraction surface unless the task really needs it
- if an architectural gap blocks implementation, name the exact missing decision instead of asking for a broad re-plan

## Examples

### BAD: $effect computing derived state

```ts
// ❌ effect-for-derivation
let full_name = $state('');
$effect(() => {
  full_name = `${first_name} ${last_name}`;
});
```

```ts
// ✅ $derived replaces both the $state and the $effect
const full_name = $derived(`${first_name} ${last_name}`);
```

### BAD: God component with mixed concerns

```svelte
<!-- ❌ 200+ line page mixing server data, client workflows, and layout -->
<script lang="ts">
  let { data }: PageProps = $props();
  let items = $state<Item[]>([]);
  let is_loading = $state(false);
  // ... 40 lines of fetch/optimistic-update logic ...
</script>
<!-- ... 100+ lines of mixed layout and feature markup ... -->
```

```text
✅ Split into three files:
  +page.svelte        — thin orchestrator, renders feature components
  page.svelte.ts      — ItemPageHandler class with client workflow state
  components/item-list.svelte — presentational component for the list
```

### BAD: Global singleton for page-local state

```ts
// ❌ premature-global — module-level singleton used by one page
// stores/dashboard.svelte.ts
class DashboardStore {
  filter = $state('all');
}
export const dashboard_store = new DashboardStore();
```

```ts
// ✅ Page-scoped Context — state lives and dies with the page
// routes/dashboard/dashboard-context.svelte.ts
import { createContext } from 'svelte';

enum FilterStatus {
  ALL = 'all',
  ACTIVE = 'active',
  DONE = 'done',
}

class DashboardState {
  filter = $state<FilterStatus>(FilterStatus.ALL);
  set_filter(new_filter: FilterStatus): void { this.filter = new_filter; }
}

// createContext<T>() — typed [get, set] tuple; get() throws loudly if no parent called set
export const [get_dashboard_context, set_dashboard_context] = createContext<DashboardState>();
```

## Questions this skill answers

- "Create a Svelte 5 component"
- "Implement this page with SvelteKit"
- "Migrate this component from Svelte 4 to Svelte 5"
- "Write a load function for this route"
- "Split this large component into smaller pieces"
- "How do I use runes in a .svelte.ts file?"
- "Add a form action to this page"
- "Extract reusable logic from this component"
- "Set up Context for this compound component"
- "Wire up typed props and callbacks"
- "How do I use $state.raw for performance?"
- "Set up Tailwind v4 CSS-first config"
- "Debug a hydration mismatch"
- "Add prefetching to links"
