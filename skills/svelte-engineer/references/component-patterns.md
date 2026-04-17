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

  // class prop is typed ClassValue (from HTMLButtonAttributes) — accepts string | object | array
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

## Compound component barrels

Multi-part components export each subcomponent's default via `export { default as Name }`:

```ts
// ui/page-hero/index.ts
export { default as Root } from './page-hero.svelte';
export { default as Content } from './page-hero-content.svelte';
export { default as Aside } from './page-hero-aside.svelte';
// ⚠️ NEVER: export * as Root — exports the module namespace object,
// not the component. Breaks ConstructorOfATypedSvelteComponent.
```

Consumer uses namespace import: `import * as PageHero from '$lib/components/ui/page-hero'` → `<PageHero.Root>`, `<PageHero.Content>`, `<PageHero.Aside>`.

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

## DOM Attachments (`{@attach}`)

For composable DOM enhancements that must forward through component props, use `{@attach}` instead of `use:action`:

```svelte
<button {@attach tooltip('Save')}>Save</button>
```

`{@attach}` is Symbol-keyed and passes transparently through `{...rest_props}` spreads. See [attachments-and-directives.md](attachments-and-directives.md) for the factory pattern, `fromAction()` migration adapter, and anti-patterns.

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

### Layout adaptation via :has() + data-slot

When a parent's layout depends on which children are rendered, use CSS `:has([data-slot=...])` instead of Context (Context template props evaluate before `{@render children()}` runs — broken on SSR). In Tailwind: `has-[[data-slot=page-hero-aside]]:grid-cols-[1fr_auto]` on the parent. Specificity (0,1,1) beats base utility (0,0,1), so it naturally overrides without `!important`. Fully SSR-safe — no JS, no hydration mismatch.

```svelte
<div class={cn(
  'flex flex-col max-w-4xl mx-auto text-center',
  'has-[[data-slot=aside]]:max-w-none has-[[data-slot=aside]]:lg:grid has-[[data-slot=aside]]:lg:grid-cols-[1fr_auto]',
  class_name
)}>
  {@render children?.()}
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

## Dynamic components from data

Render components stored in data objects via property access — avoids intermediate PascalCase variables that violate snake_case lint rules:

```svelte
{#each steps as step (step.title)}
  <step.icon size={24} class="text-primary" />
{/each}
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

**twMerge group caveat:** `twMerge` only resolves conflicts within the same Tailwind group. `font-bold` (font-weight) and `font-modak` (font-family) are different groups — both apply when composed. Don't lock shared component variants to a font-weight if consumers may need a different font-family that carries its own weight.

Type class props as `ClassValue` (from `svelte/elements`) — accepts `string | Record<string, boolean> | ClassValue[] | null | undefined`. See [attachments-and-directives.md](attachments-and-directives.md) for the full `ClassValue` pattern.

## Long class lists

Keep long Tailwind lists readable:

- Use arrays in `tv()` once base or variant strings start mixing layout, typography, interaction, and accessibility rules.
- Break long template `class=""` values across lines with aligned indentation.
- Keep reusable tokens, `@utility` classes, and shared `@custom-variant` selectors in `app.css`; keep component-specific visual decisions in the component. See [tailwind-v4-patterns.md](tailwind-v4-patterns.md#custom-utilities) for `@utility` and `@custom-variant` syntax.

## Error and Async Boundaries (`<svelte:boundary>` — v5.3+)

`<svelte:boundary>` catches errors and async failures in its child tree. Place boundaries:
- At each async component surface where pending/error states need distinct UI
- Around data-rich subtrees to isolate failures from the rest of the page
- As close to the failure point as practical — one global catch-all is an anti-pattern

```svelte
<script lang="ts">
  let boundary_error = $state<unknown>(null);
  let reset_fn = $state<(() => void) | null>(null);
</script>

<svelte:boundary
  onerror={(err, reset) => {
    boundary_error = err;
    reset_fn = reset;
    // Log to monitoring — err is unknown, not Error, sanitize before logging
  }}
>
  <AsyncUserPanel user_id={user.id} />

  {#snippet failed(error, reset)}
    <div role="alert" class="rounded-lg border border-destructive p-4">
      <p class="text-destructive">
        {error instanceof Error ? error.message : 'Something went wrong'}
      </p>
      <button class="mt-2 text-sm underline" onclick={reset}>Try again</button>
    </div>
  {/snippet}

  {#snippet pending()}
    <div class="animate-pulse rounded-lg bg-muted h-32" aria-busy="true" />
  {/snippet}
</svelte:boundary>
```

Props:
- `onerror={(error: unknown, reset: () => void) => void}` — externalises error for monitoring/logging
- `failed` snippet — `(error: unknown, reset: () => void)` — rendered when the boundary catches
- `pending` snippet — rendered during initial `await` resolution inside the boundary

**SSR note:** The `pending` snippet renders immediately on the server (server always renders synchronously). `failed` is never rendered on the server — errors during SSR propagate normally. Sanitize error objects before rendering in `failed` — never expose internal stack traces.

> Syntax-only quick reference: [attachments-and-directives.md](attachments-and-directives.md).

