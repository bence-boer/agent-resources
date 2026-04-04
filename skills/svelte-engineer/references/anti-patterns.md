# Anti-Patterns: Svelte 4 → Svelte 5

## Banned Patterns

### `export let` → `$props()`

```svelte
<!-- ❌ -->
<script lang="ts">
  export let title: string;
</script>

<!-- ✅ -->
<script lang="ts">
  let { title }: { title: string } = $props();
</script>
```

### `createEventDispatcher` → Callback Props

```svelte
<!-- ❌ -->
<script lang="ts">
  const dispatch = createEventDispatcher<{ change: string }>();
</script>
<button on:click={() => dispatch('change', 'new-value')}>

<!-- ✅ -->
<script lang="ts">
  let { on_change }: { on_change?: (value: string) => void } = $props();
</script>
<button onclick={() => on_change?.('new-value')}>
```

### `<slot>` → `{@render children?.()}`

```svelte
<!-- ❌ -->
<slot name="header" />
<slot />

<!-- ✅ -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let { header, children }: { header?: Snippet; children?: Snippet } = $props();
</script>
{@render header?.()}
{@render children?.()}
```

### `$:` → `$derived` / `$effect`

```svelte
<!-- ❌ -->
<script>
  $: doubled = count * 2;
  $: { console.log(count); }
</script>

<!-- ✅ -->
<script>
  const doubled = $derived(count * 2);
  $effect(() => { console.log(count); });
</script>
```

### Stores → Runes

```ts
// ❌
import { writable, derived } from 'svelte/store';
const count = writable(0);
const doubled = derived(count, $count => $count * 2);

// ✅ — class in .svelte.ts
class CountStore {
  value = $state(0);
  doubled = $derived(this.value * 2);
  increment() { this.value++; }
}
export const count_store = new CountStore();
```

### `$app/stores` → `$app/state`

```svelte
<!-- ❌ -->
<script>
  import { page } from '$app/stores';
  $: current_path = $page.url.pathname;
</script>

<!-- ✅ -->
<script>
  import { page } from '$app/state';
  const current_path = $derived(page.url.pathname);
</script>
```

### `on:event` → Native Event Attributes

```svelte
<!-- ❌ -->
<button on:click={handle_click}>
<button on:click|preventDefault={handle_submit}>

<!-- ✅ -->
<button onclick={handle_click}>
<button onclick={(event) => { event.preventDefault(); handle_submit(event); }}>
```

### `let:variable` → Snippet Parameters

```svelte
<!-- ❌ -->
<List {items} let:item let:index>
  <p>{index}: {item.name}</p>
</List>

<!-- ✅ -->
<List {items}>
  {#snippet row(item, index)}
    <p>{index}: {item.name}</p>
  {/snippet}
</List>
```

### `bind:this` → `ref` as `$bindable`

```svelte
<!-- ❌ -->
<script>
  export let element: HTMLElement | undefined = undefined;
</script>
<div bind:this={element}>

<!-- ✅ -->
<script lang="ts">
  let { ref = $bindable(null) }: { ref?: HTMLDivElement | null } = $props();
</script>
<div bind:this={ref}>
```

## Deprecated Imports

| Remove | Replace With |
|--------|-------------|
| `writable` from `svelte/store` | Class with `$state` in `.svelte.ts` |
| `derived` from `svelte/store` | `$derived` / `$derived.by()` |
| `readable` from `svelte/store` | Class with `$state` + `$effect` |
| `get` from `svelte/store` | Direct property access |
| `createEventDispatcher` from `svelte` | Callback props |
| `page` from `$app/stores` | `page` from `$app/state` |

### Template String Classes → `cn()`

```svelte
<!-- ❌ -->
<a class="group {classes} floating-border overflow-hidden">

<!-- ✅ -->
<a class={cn('group floating-border overflow-hidden', classes)}>
```

### Direct File or Sub-Barrel Imports → Package Barrel

```ts
// ❌
import Button from '$lib/components/ui/button/button.svelte';
import { Button } from '$lib/components/ui/button';

// ✅
import { Button } from '$lib/components/ui';
```

### Page-Only Components in `$lib/components` → Route-Local Placement

```text
❌ src/lib/components/dashboard-metrics.svelte
✅ src/routes/(app)/dashboard/components/dashboard-metrics.svelte
```

Promote into `$lib/components` only after a second real consumer appears.

### Runtime Values Marked as `type` → Value Imports and Exports

```ts
// ❌
import { type ButtonVariant } from './button-variant.ts';
export { type ButtonVariant };

// ✅
import { ButtonVariant } from './button-variant.ts';
export { ButtonVariant };
```

### Closed String Domains → Enums

```ts
// ❌
type ThemeMode = 'light' | 'dark';
type ButtonSize = 'sm' | 'md' | 'lg';

// ✅
enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

enum ButtonSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}
```

### Instance-Script Variant Helpers → Module-Script Exports

```svelte
<!-- ❌ -->
<script lang="ts">
  const button_variants = tv({ ... });
</script>

<!-- ✅ -->
<script lang="ts" module>
  export const button_variants = tv({ ... });
</script>
```

### Inline `as const` → Derived Types

```ts
// ❌
const options = {
  image: { type: 'jpeg' as const, quality: 0.98 },
  jsPDF: { unit: 'mm' as const, format: 'a4' as const },
};

// ✅
type PdfOptions = NonNullable<Parameters<typeof Html2Pdf>[1]>;
const options: PdfOptions = {
  image: { type: 'jpeg', quality: 0.98 },
  jsPDF: { unit: 'mm', format: 'a4' },
};
```

## Common Mistakes

### Losing Reactivity in Class Constructors

```ts
// ❌ — value captured at construction, not reactive
class MyClass {
  value: number;
  constructor(initial_value: number) { this.value = initial_value; }
}

// ✅ — getter preserves reactive chain
class MyClass {
  readonly get_value: () => number;
  doubled = $derived.by(() => this.get_value() * 2);
  constructor(get_value: () => number) { this.get_value = get_value; }
}
```

### Using $effect Where $derived Suffices

```ts
// ❌
let label = $state('');
$effect(() => { label = `Count: ${count}`; });

// ✅
const label = $derived(`Count: ${count}`);
```

### Forgetting .svelte.ts Extension

```ts
// ❌ store.ts — runes won't compile
// ✅ store.svelte.ts — correct
```
