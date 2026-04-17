# Attachments & Directives

Use this reference for modern DOM enhancement with `{@attach}`, class composition, and style directives. For error boundaries and the full `<svelte:boundary>` pattern, see [component-patterns.md](component-patterns.md).

---

## `{@attach}` — DOM Attachments (Svelte 5.29+)

Attachments are the composable successor to `use:action`. They run as an effect when an element mounts, receive the DOM element, and return an optional cleanup function. Unlike actions, attachments are Symbol-keyed and pass transparently through `{...props}` spreads.

```ts
import type { Attachment } from 'svelte/attachments';

function tooltip(text: string): Attachment {
  return (element) => {
    const tip = document.createElement('div');
    tip.textContent = text;
    element.append(tip);
    return () => tip.remove();
  };
}
```

```svelte
<button {@attach tooltip('Save changes')}>Save</button>

<!-- Conditional: falsy value = no attachment, no wrapper {#if} needed -->
<div {@attach is_active && tooltip('Active element')}>...</div>

<!-- Multiple attachments compose on one element -->
<div {@attach first_attachment} {@attach second_attachment}>...</div>
```

**Forwarding attachments via props** — because attachments are Symbol-keyed, they also pass through `{...rest_props}` implicitly. For explicit forwarding with a typed prop:

```svelte
<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  let {
    attachments = [],
    children,
    ...rest
  }: HTMLButtonAttributes & { attachments?: Attachment[] } = $props();
</script>

<button {...rest} {attachments}>
  {@render children?.()}
</button>
```

> **Reactivity note:** Any reactive state read inside an attachment factory re-runs the entire attachment (destroy + recreate). Isolate expensive setup by reading reactive values only in a nested `$effect` inside the attachment body.

---

## `fromAction()` — Legacy Action Adapter

Wraps a Svelte 4 `use:action` so it can be used with `{@attach}`. The primary use case is consuming third-party library actions in new component surfaces:

```ts
import { fromAction } from 'svelte/attachments';
import type { Attachment } from 'svelte/attachments';
import { clickOutside } from '$lib/actions'; // legacy use:action

// Wrap once, reuse as an attachment
const close_on_outside: Attachment = fromAction(clickOutside, { on_click: handle_close });
```

```svelte
<div {@attach fromAction(clickOutside, { on_click: close })}>
  <!-- content -->
</div>
```

**Migration note:** `use:action` is **not deprecated** and continues to work on elements. Prefer `{@attach}` when you need to forward behavior through component props or compose multiple enhancements on one element.

---

## Function Bindings (Svelte 5.9+)

`bind:` accepts a `{getter, setter}` pair for transformation and validation at the binding boundary:

```svelte
<script lang="ts">
  let raw_value = $state('');

  function get_trimmed(): string { return raw_value.trim(); }
  function set_trimmed(new_value: string): void { raw_value = new_value.trim(); }
</script>

<input bind:value={get_trimmed, set_trimmed} />
```

Inline form when the logic is simple:

```svelte
<input
  bind:value={
    () => value.trim(),
    (new_value) => { value = new_value.toLowerCase().trim(); }
  }
/>
```

**Readonly bindings** (dimension props like `clientWidth`) pass `null` as the getter — `null`, not `undefined`:

```svelte
<div bind:clientWidth={null, (w) => { width = w; }}>...</div>
```

Use function bindings for: input normalisation (trim, lowercase), validation before accepting a value, binding to a transformed representation of state. For complex state transformations, prefer a class with getter properties instead.

---

## `$bindable()` Fallback Semantics

The default passed to `$bindable()` is **not an initial value** — it is the fallback used only when the parent does not bind the prop:

```svelte
<script lang="ts">
  interface Props { open?: boolean }
  let { open = $bindable(false) }: Props = $props();
</script>
```

- Parent does **not** bind → component controls `open`, starts at `false`
- Parent binds `bind:open={is_open}` → component and parent share the state; the fallback is ignored
- If the parent binds but passes `undefined`, a runtime error is thrown

---

## Class Attribute — Object / Array / `ClassValue`

Three valid forms; prefer array or object forms when composing with external class props:

```svelte
<!-- Object: multiple conditional classes from one expression -->
<div class={{ active: is_active, disabled: is_disabled, 'text-red-500': has_error }}>

<!-- Array: mix static strings, conditions, and forwarded props -->
<div class={['flex items-center', is_active && 'bg-primary', class_name]}>
```

**`ClassValue` type** (Svelte 5.19+) — always type class props as `ClassValue`, never `string`:

```svelte
<script lang="ts">
  import type { ClassValue } from 'svelte/elements';
  import { cn } from '$lib/utils.js';

  interface Props { class?: ClassValue; variant: string }
  let { class: class_name, variant }: Props = $props();
</script>

<!-- cn() = twMerge(clsx(...)) — class_name always last for consumer override -->
<div class={cn('base-classes', variant === 'primary' && 'bg-primary', class_name)}>
```

`ClassValue` accepts `string | Record<string, boolean> | ClassValue[] | null | undefined`, so callers can pass any form and it composes correctly. The `class:name` directive still works but is superseded for composition scenarios.

---

## `style:` Directive

Apply individual CSS properties reactively without inline style strings:

```svelte
<div
  style:color={text_color}
  style:font-size="{font_size}px"
  style:opacity={is_visible ? 1 : 0}
  style:--brand-hue={hue_value}
>
```

- Preferred over `style="color: {color}"` — avoids CSP issues
- Works with CSS custom properties: `style:--token={value}`
- `style:` directives always win over a `style` attribute on the same element — even `!important` in the attribute loses
- Use only for **dynamic** values; static visual decisions belong in `<style>` blocks or Tailwind utilities

---

## CSS Scoping: `:global` Patterns

```svelte
<style>
  /* Anchored: targets h1 anywhere inside a scoped .wrapper */
  .wrapper :global(h1) { font-weight: 700; }

  /* Anchored: style third-party widget inside this component's container */
  .container :global(.external-widget) { padding: 1rem; }

  /* Top-level: applies everywhere — use sparingly */
  :global(.prose) { line-height: 1.75; }
</style>
```

Rules:
- **Prefer anchored** `:global()` (`.parent :global(selector)`) over top-level `:global` to limit blast radius
- Use `:global` for: styling slotted/rendered children, third-party library elements, dynamically injected DOM nodes
- **Never** use `:global` for elements the component owns — plain scoped selectors are correct there

---

## `<svelte:boundary>` — Syntax Reference

> Full pattern (pending UI, `onerror`, SSR sanitisation) is documented in [component-patterns.md](component-patterns.md).

```svelte
<svelte:boundary onerror={(error, reset) => { error_state = error; reset_fn = reset; }}>
  <AsyncComponent />

  {#snippet failed(error, reset)}
    <ErrorDisplay {error} on_retry={reset} />
  {/snippet}
</svelte:boundary>
```

- `onerror` — `(error: unknown, reset: () => void) => void` — externalises error state
- `failed` snippet — receives `(error: unknown, reset: () => void)` — rendered in place when the boundary catches an error
- `pending` snippet — shown during initial `await` resolution inside the boundary

---

## Anti-patterns

| Avoid | Use instead | Reason |
|-------|-------------|--------|
| `use:action` for composable DOM enhancements | `{@attach}` | attachments spread/forward; actions don't |
| `class="flex {dynamic_class}"` string interpolation | `class={['flex', dynamic_class]}` or `cn()` | type-safe, merge-safe |
| `style="color: {color}"` inline | `style:color={color}` | CSP-safe, reactive-safe |
| `class` prop typed as `string` | typed as `ClassValue` | accepts array/object compositions from callers |
| Top-level `:global(...)` for component-scoped concerns | `.wrapper :global(...)` | prevents global style leaks |
