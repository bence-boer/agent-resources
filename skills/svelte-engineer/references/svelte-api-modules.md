# Svelte API Modules

Importable Svelte 5 utilities beyond core runes — `svelte`, `svelte/events`, `svelte/motion`, `svelte/reactivity`, `svelte/reactivity/window`, and `svelte/store`. For rune syntax, class-based reactive primitives, and the DIY `use_event_listener` pattern, see [state-reactivity](state-reactivity.md).

---

## Context (`svelte` — v5.40+)

`createContext<T>()` returns a typed `[get, set]` tuple sharing a single, isolated key. **Must be called at module initialisation time** — top-level in a `.svelte.ts` module or `<script module>` block. Never inside a component instance or function body.

**Pattern A — canonical: dedicated context module**

```ts
// dashboard-context.svelte.ts
import { createContext } from 'svelte';

class DashboardState {
  filter = $state('all');
  set_filter(value: string) { this.filter = value; }
}

export const [get_dashboard_context, set_dashboard_context] = createContext<DashboardState>();
```

```svelte
<!-- Dashboard.svelte (root) -->
<script lang="ts">
  import { set_dashboard_context, DashboardState } from './dashboard-context.svelte.js';
  const dashboard_context = set_dashboard_context(new DashboardState());
</script>

<!-- DashboardFilter.svelte (child) -->
<script lang="ts">
  import { get_dashboard_context } from './dashboard-context.svelte.js';
  const dashboard_context = get_dashboard_context(); // typed as DashboardState; throws if no parent set it
</script>
<select onchange={(event) => dashboard_context.set_filter(event.currentTarget.value)}>...</select>
```

**Pattern B — single-file compound component**

```svelte
<script lang="ts" module>
  import { createContext } from 'svelte';

  enum SortDirection {
    ASCENDING = 'asc',
    DESCENDING = 'desc',
  }

  class TableState {
    sort_column = $state('');
    sort_direction = $state<SortDirection>(SortDirection.ASCENDING);
  }

  export const [get_table_context, set_table_context] = createContext<TableState>();
</script>
```

> **Gotcha:** `get` throws if no parent called `set` — loud, fast failure. Unlike `getContext<T>()`, which silently returns `undefined` mistyped as `T`.

---

## Events (`svelte/events`)

`on()` attaches imperative listeners and integrates with Svelte's delegation queue. Raw `addEventListener` fires before delegated `onclick` handlers — `on()` preserves correct ordering. Returns a cleanup `() => void`.

```ts
import { on } from 'svelte/events';

// return value is on()'s cleanup — wires into $effect teardown automatically
$effect(() => on(document, 'keydown', (event) => {
  if (event.key === 'Escape') close_modal();
}));
```

---

## Reactive Scheduling (`svelte`)

| Function | Sync? | Waits for |
|---|---|---|
| `flushSync(fn?)` | ✅ | Pending DOM updates — callback state changes flushed immediately |
| `tick()` | ❌ | Current microtask queue flushed to DOM |
| `settled()` (v5.36+) | ❌ | DOM update + all async `$derived` computations settled |

```ts
import { tick, flushSync, settled } from 'svelte';

// Scroll to bottom after new message appended
async function add_message(message: string) {
  messages.push(message);
  await tick();
  container.scrollTop = container.scrollHeight;
}

// Synchronous DOM assertion in tests
flushSync(() => { count++; });
assert(element.textContent === '1');
```

---

## `untrack` (`svelte`)

Reads reactive state without registering it as a dependency in the current tracking context.

```ts
import { untrack } from 'svelte';

$effect(() => {
  const id = user_id;                           // tracked — re-runs when user_id changes
  const config = untrack(() => global_config);  // sampled — not subscribed
  sync_user(id, config);
});
```

## `getAbortSignal` (`svelte`)

Returns an `AbortSignal` aborted automatically when the current `$derived` or `$effect` re-runs or is destroyed — the canonical way to cancel in-flight fetches in reactive contexts.

```ts
import { getAbortSignal } from 'svelte';

async function fetch_search(query: string, signal: AbortSignal): Promise<SearchResult[]> {
  const response = await fetch(`/api/search?q=${query}`, { signal });
  return response.json();
}

// Each time `query` changes, the previous fetch is automatically aborted
const search_results = $derived.by(() => fetch_search(query, getAbortSignal()));
```

---

## `fork` + `Fork` (`svelte` — v5.42+)

Creates a speculative copy of the reactive tree. State changes inside `fork()` are invisible to the main DOM until `commit()` is called. Call `discard()` to revert without applying. Always call one or the other — orphaned forks leak memory.

```ts
import { fork } from 'svelte';
import type { Fork } from 'svelte';

async function optimistic_delete(id: string) {
  const preview: Fork = fork(() => {
    items = items.filter((item) => item.id !== id);
  });
  if (await confirm_with_user()) {
    await delete_item(id);
    await preview.commit();  // apply to main tree + DOM
  } else {
    preview.discard();       // revert — no DOM change
  }
}
```

---

## Motion (`svelte/motion` — v5.8+)

`Spring` and `Tween` replace the deprecated `spring()` / `tweened()` store functions. Both use a **target/current split**: write `.target`, read animated `.current`. Not stores — no `$` prefix, no `.subscribe()`.

```ts
import { Spring, Tween } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

// Spring — physics-based. Write .target; read .current for rendering.
const cursor = new Spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.7 });
cursor.target = { x: event.clientX, y: event.clientY };

// Spring.of — declaratively tracks a reactive source (call at component init)
const smooth_pos = Spring.of(() => position, { stiffness: 0.15 });
```

```svelte
<div style:translate="{cursor.current.x}px {cursor.current.y}px" />
```

```ts
// Tween — time-based. duration can be a function for proportional timing.
const progress = new Tween(0, {
  duration: (from: number, to: number) => Math.abs(to - from) * 8,
  easing: cubicOut,
});
progress.target = 75; // animates to 75
```

> **Gotcha:** `hard`/`soft` options are legacy `spring()` store API and silently ignored on the class. Use `instant: true` in `.set()` to snap without animation.

### `prefersReducedMotion`

Pre-built `MediaQuery` instance — import directly; do not construct your own.

```ts
import { prefersReducedMotion } from 'svelte/motion';

const duration = $derived(prefersReducedMotion.current ? 0 : 300);
```

---

## Reactive Primitives (`svelte/reactivity`)

### `MediaQuery`

SSR-safe reactive wrapper for `window.matchMedia`. The `fallback` argument controls the server-side value (defaults to `false`).

```ts
import { MediaQuery } from 'svelte/reactivity';

const is_large = new MediaQuery('min-width: 1024px', false); // fallback: false = mobile-first safe
const prefers_dark = new MediaQuery('prefers-color-scheme: dark');

const layout = $derived(is_large.current ? 'desktop' : 'mobile');
```

> **Note:** `query` is the inner string without `()` — the constructor adds them.

### `SvelteMap` / `SvelteSet` / `SvelteDate` / `SvelteURL`

Drop-in reactive replacements for native types. Mutations trigger fine-grained reactivity; reads (`.get()`, `.has()`, iteration) register as dependencies.

```ts
import { SvelteMap, SvelteSet, SvelteDate, SvelteURL } from 'svelte/reactivity';

const cart = new SvelteMap<string, number>();
cart.set('apple', 3);   // triggers reactivity
cart.delete('apple');   // triggers reactivity

const tags = new SvelteSet(['typescript', 'svelte']);
tags.add('vite');       // reactive

const last_updated = new SvelteDate();
last_updated.setTime(Date.now()); // Intl.DateTimeFormat.format(last_updated) is also reactive

const url = new SvelteURL('https://example.com/search');
url.searchParams.set('q', 'runes'); // triggers reactivity
```

> **Gotcha:** values stored in `SvelteMap`/`SvelteSet` are NOT deeply reactive — mutations to a nested plain object inside a value are not tracked.

---

## Window Reactivity (`svelte/reactivity/window` — v5.11+)

Pre-built reactive bindings to `window` properties. All return `undefined` during SSR — null-guard in derived values.

```ts
import { innerWidth, innerHeight, scrollY, online, devicePixelRatio } from 'svelte/reactivity/window';

const is_mobile = $derived((innerWidth.current ?? 0) < 768);
const is_scrolled = $derived((scrollY.current ?? 0) > 100);
const is_offline = $derived(online.current === false);
```

Available: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `online`, `devicePixelRatio`, `screenWidth`, `screenHeight`.

---

## External System Bridge (`svelte/reactivity` — v5.7+)

`createSubscriber` bridges any external event API (WebSocket, `ResizeObserver`, geolocation) to Svelte's reactive graph. The `start` callback is called once when the first effect subscribes; teardown runs only when the last effect is destroyed.

```ts
import { createSubscriber } from 'svelte/reactivity';
import { on } from 'svelte/events';

class NetworkStatus {
  readonly #subscribe = createSubscriber((update: () => void): (() => void) => {
    const off_online = on(window, 'online', update);
    const off_offline = on(window, 'offline', update);
    return () => { off_online(); off_offline(); };
  });

  get is_online(): boolean {
    this.#subscribe(); // registers as dependency when called inside an effect/derived
    return navigator.onLine;
  }
}

export const network = new NetworkStatus();
```

---

## Store Interop (`svelte/store`)

`toStore` / `fromStore` bridge rune-based state with Svelte 4 stores. Use only for legacy library interop.

```ts
import { toStore, fromStore } from 'svelte/store';
import type { Writable } from 'svelte/store';

const legacy_theme = fromStore(theme_store); // .current: string — reactive accessor

let count = $state(0);
const count_store: Writable<number> = toStore(() => count, (value) => { count = value; });
```

---

## Anti-patterns

| ❌ Avoid | ✅ Use instead |
|---|---|
| `Symbol()` + `setContext` / `getContext` for typed context | `createContext<T>()` from `svelte` — paired, typed, no Symbol boilerplate |
| DIY `MediaQuery` class with `$effect` + `addEventListener` | `MediaQuery` from `svelte/reactivity` — SSR-safe, already reactive |
| Raw `addEventListener` in `$effect` | `on()` from `svelte/events` — integrates with delegation ordering, returns cleanup |
| `spring()` / `tweened()` store functions (Svelte 4) | `Spring` / `Tween` classes from `svelte/motion` — no `$` prefix, `.current` / `.target` API |
| Polling `tick()` until async derived work settles | `settled()` from `svelte` — waits for all `$derived` async computations |
| Manual `AbortController` cleanup in `$effect` return | `getAbortSignal()` — signal auto-aborts on re-run or destroy |
