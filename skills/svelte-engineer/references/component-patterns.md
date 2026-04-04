# Component Patterns

## Reusable component baseline

Keep the component, its local variants, its local barrel, and the package barrel aligned:

```text
ui/
├── index.ts
└── button/
    ├── button.svelte
    └── index.ts
```

```svelte
<script lang="ts" module>
  import { cn, type WithElementRef } from '$lib/utils.js';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { tv } from 'tailwind-variants';

  export enum ButtonVariant {
    DEFAULT = 'default',
    SECONDARY = 'secondary',
    OUTLINE = 'outline',
    GHOST = 'ghost',
    LINK = 'link',
  }

  export enum ButtonSize {
    DEFAULT = 'default',
    SM = 'sm',
    LG = 'lg',
    ICON = 'icon',
  }

  export const button_variants = tv({
    base: [
      'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap',
      'font-medium transition-colors outline-none select-none',
      'disabled:pointer-events-none disabled:opacity-50',
      'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    ],
    variants: {
      variant: {
        [ButtonVariant.DEFAULT]: [
          'rounded-xl border-2 border-primary bg-primary text-primary-foreground',
          'hover:-translate-y-1 active:translate-y-0',
        ],
        [ButtonVariant.SECONDARY]: [
          'rounded-xl border-2 border-primary bg-secondary text-secondary-foreground',
          'hover:-translate-y-1 active:translate-y-0',
        ],
        [ButtonVariant.OUTLINE]: 'rounded-xl border-2 border-primary bg-background text-foreground',
        [ButtonVariant.GHOST]: 'rounded-full border-0 bg-white/10 font-semibold text-white/80 hover:text-white',
        [ButtonVariant.LINK]: 'font-semibold text-primary underline-offset-4 hover:underline',
      },
      size: {
        [ButtonSize.DEFAULT]: 'h-12 px-6 text-base',
        [ButtonSize.SM]: 'h-9 px-4 text-sm',
        [ButtonSize.LG]: 'h-14 px-8 text-lg',
        [ButtonSize.ICON]: 'size-10 p-0',
      },
    },
    defaultVariants: {
      variant: ButtonVariant.DEFAULT,
      size: ButtonSize.DEFAULT,
    },
  });

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant;
      size?: ButtonSize;
    };
</script>

<script lang="ts">
  let {
    ref = $bindable(null),
    class: class_name,
    variant = ButtonVariant.DEFAULT,
    size = ButtonSize.DEFAULT,
    href = undefined,
    type = 'button',
    disabled = false,
    children,
    ...rest_props
  }: ButtonProps = $props();
</script>

{#if href}
  <a
    bind:this={ref}
    data-slot="button"
    class={cn(button_variants({ variant, size }), class_name)}
    href={disabled ? undefined : href}
    aria-disabled={disabled}
    {...rest_props}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    bind:this={ref}
    data-slot="button"
    class={cn(button_variants({ variant, size }), class_name)}
    {type}
    {disabled}
    {...rest_props}
  >
    {@render children?.()}
  </button>
{/if}
```

This keeps styling local, exposes runtime enums and helpers from module scope, and merges consumer classes safely with `cn()`.

## Barrel files

Export shared components through the local barrel, then re-export from `ui/index.ts`:

```ts
// ui/button/index.ts
import Root, {
  ButtonSize,
  ButtonVariant,
  button_variants,
  type ButtonProps,
} from './button.svelte';

export {
  Root,
  Root as Button,
  ButtonSize,
  ButtonVariant,
  button_variants,
  type ButtonProps,
};
```

```ts
// ui/index.ts
export {
  Button,
  ButtonSize,
  ButtonVariant,
  button_variants,
  type ButtonProps,
} from './button';
```

```ts
import { Button, ButtonVariant } from '$lib/components/ui';
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

## Long class lists

Keep long Tailwind lists readable:

- Use arrays in `tv()` once base or variant strings start mixing layout, typography, interaction, and accessibility rules.
- Break long template `class=""` values across lines with aligned indentation.
- Keep reusable tokens, `@utility` classes, and shared `@custom-variant` selectors in `app.css`; keep component-specific visual decisions in the component.

```css
@utility pop-card {
  @apply rounded-[2rem] border-2 border-primary bg-card shadow-[4px_4px_0px_var(--color-accent)];
}

@custom-variant data-open (&[data-state=open]);
```

