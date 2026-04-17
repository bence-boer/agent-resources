# State & Reactivity

## Rune Reference

| Rune | Purpose | When |
|------|---------|------|
| `$state(value)` | Mutable reactive state | Component-local or class fields |
| `$state.raw(value)` | Shallow reactive state | Large objects replaced wholesale |
| `$derived(expr)` | Computed (single expression) | `$derived(count * 2)` |
| `$derived.by(() => {...})` | Computed (block) | Multi-line with intermediates |
| `$effect(() => {...})` | Side effects | DOM manipulation, subscriptions — never for deriving state |
| `$effect.root(() => {...})` | Untracked effect scope | Manual lifecycle control |
| `$bindable(default)` | Two-way bindable prop | `ref`, `value`, `open` |
| `$props()` | Component props | Every component |
| `$state.snapshot(value)` | Plain object from proxy | `structuredClone`, `JSON.stringify`, logging, external API calls |
| `$state.eager(value)` | Immediate UI update | Navigation feedback, optimistic UI before `await` |
| `$effect.pre(() => {...})` | Runs before DOM update | Auto-scroll: read scroll position before DOM changes |
| `$effect.tracking()` | Boolean: in tracking context? | Conditional behavior in library utilities |
| `$props.id()` | Component-unique SSR-safe ID | `<label for={id}>` + `<input id={id}>` accessible forms |
| `$inspect(value)` | Dev-only reactive logger | Trace state changes — stripped in production |

## $state Proxy Semantics

`$state({})` and `$state([])` create a deep reactive Proxy for **plain objects and arrays only**.

### Only plain objects and arrays are deep-proxied

Class instances inside `$state` are NOT proxied recursively — they must use `$state` fields internally:

```ts
// ❌ silent non-reactivity — Position.x mutations won't be tracked
class Position { x = 0; y = 0; }
let pos = $state({ position: new Position() });

// ✅ use $state fields inside the class
class Position {
  x = $state(0);
  y = $state(0);
}
let pos = $state({ position: new Position() });
```

### Destructuring a proxy breaks reactivity

```ts
let todos = $state<Todo[]>([{ id: '1', done: false, text: 'learn' }]);

// ❌ captures a snapshot — done and text are NOT reactive
const { done, text } = todos[0];

// ✅ access through the proxy — reactive
let first_done = $derived(todos[0].done);
```

### Original object is not mutated by proxy writes

```ts
const original = { theme: 'light' } as const satisfies Config;
let config = $state(original);
config.theme = 'dark';
// original.theme is still 'light'
// Use $state.snapshot(config) to export a plain copy
```

## Class-Based Reactive Primitives

Encapsulate cohesive state + behaviour in `.svelte.ts` classes. Export the class, not an instance, unless the state is a true global singleton.

```ts
// search-state.svelte.ts
enum SortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export class SearchState {
  #query = $state('');
  #page = $state(1);
  #sort_direction = $state<SortDirection>(SortDirection.ASCENDING);

  get query(): string { return this.#query; }
  get page(): number { return this.#page; }
  get sort_direction(): SortDirection { return this.#sort_direction; }

  // $derived at class field scope — recomputes when deps change
  readonly results_key = $derived(`${this.#query}:${this.#page}`);

  set_query(query: string): void {
    this.#query = query;
    this.#page = 1; // reset pagination on new search
  }

  set_sort_direction(direction: SortDirection): void { this.#sort_direction = direction; }

  next_page(): void { this.#page++; }
  prev_page(): void { if (this.#page > 1) this.#page--; }
}
```

Key conventions:
- Private `$state` with `#` prefix — never the `private` keyword
- Public reads via `get` properties — never expose writable state directly
- State transitions through explicit methods — no public setters that bypass invariants
- `$derived` at class field scope for computed values
- Export `class`, not `export const instance = new ...` (unless intentionally a singleton)

> For browser APIs with official Svelte equivalents, use those instead of DIY wrappers:
> `MediaQuery` from `svelte/reactivity`, `on()` from `svelte/events` — see [svelte-api-modules.md](svelte-api-modules.md).

For imperative event attachment, use `on()` from `svelte/events` — see [svelte-api-modules.md](svelte-api-modules.md). It integrates with Svelte's delegation system, returns a cleanup function, and does not require `$effect` wrapping.

## createContext<T>() — Type-Safe Context

`createContext<T>()` (v5.40+) returns a typed `[get, set]` tuple sharing an isolated key. **Must be called at module scope** — top-level in a `.svelte.ts` file or `<script module>` block. Never inside functions or component instances. See [svelte-api-modules.md](svelte-api-modules.md) for both patterns and the gotcha about `get` throwing when no parent set the context.

```ts
// widget-context.svelte.ts (canonical form)
import { createContext } from 'svelte';

class WidgetState {
  expanded = $state(false);
  toggle(): void { this.expanded = !this.expanded; }
}

export const [get_widget_context, set_widget_context] = createContext<WidgetState>();
```

### Context with reactive getter props

Direct `$state` values passed to class constructors are captured as snapshots — NOT reactive. Wrap in getter functions to preserve the reactive chain:

```ts
class DialogState {
  readonly #get_open: () => boolean;
  readonly #set_open: (value: boolean) => void;

  readonly is_open = $derived.by(() => this.#get_open());

  constructor(get_open: () => boolean, set_open: (value: boolean) => void) {
    this.#get_open = get_open;
    this.#set_open = set_open;
  }

  toggle(): void { this.#set_open(!this.is_open); }
  close(): void { this.#set_open(false); }
}

const [get_dialog_context, set_dialog_context] = createContext<DialogState>();
export { get_dialog_context, set_dialog_context };
```

```svelte
<!-- Parent — passes getters not values -->
<script lang="ts">
  import { set_dialog_context, DialogState } from './dialog-context.svelte.js';
  let is_open = $state(false);
  set_dialog_context(new DialogState(() => is_open, (value) => { is_open = value; }));
</script>
```

## Global Stores

```ts
// stores/theme.svelte.ts
enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

class ThemeStore {
  mode: ThemeMode = $state(ThemeMode.LIGHT);
  is_dark = $derived(this.mode === ThemeMode.DARK);

  toggle() {
    this.mode = this.mode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      $effect.root(() => {
        $effect(() => { document.documentElement.dataset.theme = this.mode; }); // Valid: document metadata sync — one of 5 academic $effect exceptions
      });
    }
  }
}

export const theme_store = new ThemeStore();
```

## $state.raw for Performance

Use for data replaced wholesale, never mutated in-place:

```ts
class DataTable {
  rows = $state.raw<Row[]>([]);              // replaced on fetch
  config = $state.raw<TableConfig>({});       // large immutable objects
  selected_id = $state<string | null>(null);  // mutated — use regular $state
}
```

## $state.snapshot

Extract a plain object from a reactive proxy. Required when passing reactive state to APIs that reject proxies:

```ts
let items = $state<Item[]>([{ name: 'test' }]);
// ❌ structuredClone fails on proxy
const clone = structuredClone(items);
// ✅ snapshot first
const clone = structuredClone($state.snapshot(items));

// ✅ logging without proxy wrapper
console.log($state.snapshot(items));
```

## $effect.pre

Runs before the DOM updates. Use for reading layout measurements that would change after render:

```ts
let messages = $state<string[]>([]);
let container: HTMLElement;
$effect.pre(() => {
  // read scroll position before new messages shift the layout
  messages; // track dependency
  const should_auto_scroll =
    container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
  if (should_auto_scroll) {
    // schedule scroll after DOM update
    tick().then(() => { container.scrollTop = container.scrollHeight; });
  }
});
```

## $derived Advanced Patterns

### Destructuring

All destructured variables from `$derived` stay reactive:

```ts
let { width, height } = $derived(get_dimensions(element));
// both width and height update reactively
```

### Temporary Override (Optimistic UI)

A `$derived` value can be temporarily overridden and will revert when its dependencies change:

```ts
let server_count = $state(0);
let count = $derived(server_count);
function optimistic_increment() {
  count = server_count + 1; // override derived temporarily
  save_to_server().then(({ new_count }) => {
    server_count = new_count; // derived recomputes, override cleared
  });
}
```

## Function Bindings

Custom binding logic using getter/setter pairs:

```svelte
<script lang="ts">
  let value = $state('hello');
</script>

<input bind:value={() => value, (new_value) => { value = new_value.toLowerCase(); }} />
```

Use for: transforming input on write (trim, lowercase, format), validating before accepting, or binding to non-trivial state shapes.

## $props.id

Generate unique, SSR-hydration-consistent IDs for accessible form patterns:

```svelte
<script lang="ts">
  interface Props { label: string; value?: string }
  const id = $props.id();
  let { label, value = $bindable('') }: Props = $props();
</script>

<label for="{id}-input">{label}</label>
<input id="{id}-input" bind:value />
```

## Effect Rules

### Valid Uses

```ts
// DOM manipulation
$effect(() => { canvas_context.drawImage(video_element, 0, 0); });
// Subscriptions with cleanup
$effect(() => {
  const socket = new WebSocket(url);
  socket.onmessage = (event) => { messages.push(JSON.parse(event.data)); };
  return () => socket.close();
});
// External system sync
$effect(() => { document.title = `${item_count} items`; });
```

### Invalid: Deriving State

```ts
// ❌
let doubled = $state(0);
$effect(() => { doubled = count * 2; });

// ✅
const doubled = $derived(count * 2);
```

### Invalid: Data Fetching in SvelteKit

```ts
// ❌ $effect for fetching
// ✅ Use SvelteKit load functions in +page.server.ts
```

