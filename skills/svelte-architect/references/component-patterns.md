# Component Patterns

## Props

Destructure with `$props()`, `ref` first, rename `class`, collect rest:

```svelte
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  let {
    ref = $bindable(null),
    class: class_name,
    disabled = false,
    children,
    onclick,
    ...rest_props
  }: HTMLButtonAttributes & {
    ref?: HTMLButtonElement | null;
    children?: Snippet;
  } = $props();
</script>

<button
  bind:this={ref}
  class={cn('base-classes', class_name)}
  {disabled}
  {onclick}
  {...rest_props}
>
  {@render children?.()}
</button>
```

## Variant System (tailwind-variants)

Define variants in `<script lang="ts" module>` for tree-shaking:

```svelte
<script lang="ts" module>
  import { tv, type VariantProps } from 'tailwind-variants';

  export const button_variants = tv({
    base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  });

  export type ButtonVariant = VariantProps<typeof button_variants>['variant'];
  export type ButtonSize = VariantProps<typeof button_variants>['size'];
</script>
```

## Wrapping Headless Primitives (bits-ui)

```svelte
<!-- dialog-content.svelte -->
<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import type { ComponentProps } from 'svelte';
  import { cn } from '$lib/utils.js';

  let {
    ref = $bindable(null),
    class: class_name,
    children,
    ...rest_props
  }: ComponentProps<typeof DialogPrimitive.Content> = $props();
</script>

<DialogPrimitive.Overlay class={cn('fixed inset-0 z-50 bg-black/80')} />
<DialogPrimitive.Content
  bind:ref
  data-slot="dialog-content"
  class={cn('fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]', class_name)}
  {...rest_props}
>
  {@render children?.()}
</DialogPrimitive.Content>
```

- Import headless library using namespace: `import { Dialog as DialogPrimitive } from 'bits-ui'`
- Use `ComponentProps<typeof Primitive.X>` for prop typing
- Add `data-slot` attribute for CSS targeting
- `class_name` always goes last in `cn()` for consumer overrides

## data-slot Convention

Every component gets `data-slot` matching its semantic name:

```svelte
<div data-slot="card">
  <div data-slot="card-header">
    <h3 data-slot="card-title">{@render title?.()}</h3>
  </div>
  <div data-slot="card-content">{@render children?.()}</div>
</div>
```

## Snippet Props

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { header, children, footer }: {
    header?: Snippet;
    children?: Snippet;
    footer?: Snippet<[{ count: number }]>;
  } = $props();
</script>

<div>
  {#if header}{@render header()}{/if}
  {@render children?.()}
  {#if footer}{@render footer({ count: item_count })}{/if}
</div>
```

## Render Delegation Types

```ts
type WithChild<Props, Element = HTMLElement> = Props & {
  child?: Snippet<[{ props: Record<string, unknown>; ref: Element }]>;
  children?: Snippet;
};

type WithoutChild<Props> = Props & { children?: Snippet };
```

## WithElementRef Type

```ts
type WithElementRef<
  BaseProps extends HTMLAttributes<HTMLElement>,
  Element extends HTMLElement = HTMLElement,
> = BaseProps & { ref?: Element | null };
```

## CSS Class Merging

Always use `cn()` = `twMerge(clsx(...))`, `class_name` last. **Never** use template string interpolation for classes — always compose with `cn()`:

```svelte
<div class={cn(
  'flex items-center gap-2',
  button_variants({ variant, size }),
  disabled && 'opacity-50 cursor-not-allowed',
  class_name,
)}>
```

## MaybeGetter Pattern

```ts
type Getter<ValueType> = () => ValueType;
type MaybeGetter<ValueType> = ValueType | Getter<ValueType>;

function extract<ValueType>(value: MaybeGetter<ValueType>): ValueType {
  return typeof value === 'function' ? (value as Getter<ValueType>)() : value;
}
```

Usage in a utility:

```ts
// use-debounce.svelte.ts
export class UseDebounce<ValueType> {
  #current_value: ValueType = $state()!;
  #timeout_handle: ReturnType<typeof setTimeout> | undefined;

  constructor(getter: MaybeGetter<ValueType>, delay_ms: MaybeGetter<number> = 250) {
    $effect(() => {
      const new_value = extract(getter);
      const delay = extract(delay_ms);
      clearTimeout(this.#timeout_handle);
      this.#timeout_handle = setTimeout(() => { this.#current_value = new_value; }, delay);
    });
  }

  get current(): ValueType { return this.#current_value; }
}
```
