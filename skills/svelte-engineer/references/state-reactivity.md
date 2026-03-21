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

## Class-Based Reactive Primitives

```ts
// media-query.svelte.ts
export class MediaQuery {
  #is_matching: boolean = $state(false);

  constructor(query_string: MaybeGetter<string>) {
    $effect(() => {
      const media_query_list = window.matchMedia(extract(query_string));
      this.#is_matching = media_query_list.matches;
      const handle_change = (event: MediaQueryListEvent) => {
        this.#is_matching = event.matches;
      };
      media_query_list.addEventListener('change', handle_change);
      return () => media_query_list.removeEventListener('change', handle_change);
    });
  }

  get current(): boolean { return this.#is_matching; }
}
```

- Private `$state` with `#` prefix (never `private` keyword)
- Public read via `get current()` (`.current` convention)
- Constructor takes `MaybeGetter<ValueType>` for flexible reactivity
- `$effect` with cleanup for subscriptions
- Export class, not instance (unless global singleton)

## Function-Based Reactive Utilities

```ts
// use-event-listener.svelte.ts
export function use_event_listener<EventName extends keyof WindowEventMap>(
  target: MaybeGetter<EventTarget | null>,
  event_name: EventName,
  handler: (event: WindowEventMap[EventName]) => void,
  options?: AddEventListenerOptions,
) {
  $effect(() => {
    const element = extract(target);
    if (!element) return;
    element.addEventListener(event_name, handler as EventListener, options);
    return () => element.removeEventListener(event_name, handler as EventListener, options);
  });
}
```

Naming: `use_*` for imperative setup, `on_*` for event-like patterns.

## Context API

### Simple Context

```ts
// table-context.svelte.ts
import { setContext, getContext } from 'svelte';

const TABLE_CONTEXT_KEY = Symbol('table');

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

class TableContext {
  #sort_column = $state('');
  #sort_direction: SortDirection = $state(SortDirection.ASC);

  get sort_column() { return this.#sort_column; }
  get sort_direction() { return this.#sort_direction; }

  sort(column: string) {
    if (this.#sort_column === column) {
      this.#sort_direction = this.#sort_direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;
    } else {
      this.#sort_column = column;
      this.#sort_direction = SortDirection.ASC;
    }
  }
}

export function set_table_context() {
  return setContext(TABLE_CONTEXT_KEY, new TableContext());
}

export function use_table_context() {
  return getContext<TableContext>(TABLE_CONTEXT_KEY);
}
```

### Context with Getter Props

Direct `$state` values lose reactivity in class constructors — wrap in getters:

```ts
class DialogState {
  readonly props: { get_open: () => boolean; set_open: (value: boolean) => void };
  is_open = $derived.by(() => this.props.get_open());

  constructor(props: typeof DialogState.prototype.props) {
    this.props = props;
  }

  toggle() { this.props.set_open(!this.is_open); }
}

export function set_dialog_context(get_open: () => boolean, set_open: (value: boolean) => void) {
  return setContext(DIALOG_CONTEXT_KEY, new DialogState({ get_open, set_open }));
}
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
        $effect(() => { document.documentElement.dataset.theme = this.mode; });
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

## Page Handler Pattern

```ts
// routes/todos/page.svelte.ts
class TodoPageHandler {
  todo_list = $state<Todo[]>([]);
  new_title = $state('');
  is_loading = $state(false);
  error_message = $state<string | null>(null);

  async load_todos() {
    this.is_loading = true;
    try {
      const response = await client.api.todos.$get();
      this.todo_list = await response.json();
    } catch (caught_error) {
      this.error_message = caught_error instanceof Error ? caught_error.message : 'Failed to load';
    } finally {
      this.is_loading = false;
    }
  }

  async add_todo() {
    if (!this.new_title.trim()) return;
    await client.api.todos.$post({ json: { title: this.new_title } });
    this.new_title = '';
    await this.load_todos();
  }
}

export const todo_handler = new TodoPageHandler();
```
