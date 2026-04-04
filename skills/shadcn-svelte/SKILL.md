---
name: shadcn-svelte
description: >
  Component library reference for shadcn-svelte (Svelte 5 + Tailwind CSS v4) covering bits-ui
  primitives, Formsnap/Superforms integration, CSS variable theming, component variants with
  tailwind-variants, and data-slot architecture. Use when adding, configuring, customizing, or
  composing shadcn-svelte UI components in a Svelte or SvelteKit project. Triggers on any mention
  of shadcn, shadcn-svelte, or when working with components from this library (Button, Dialog,
  Sidebar, Form, Card, Table, etc.), theming with CSS variables or OKLCH tokens, the shadcn-svelte
  CLI, components.json configuration, or cn() class merging. Also use when building forms with
  Formsnap/Superforms, setting up dark mode, or customizing design system tokens.
  Do NOT use for general Svelte/SvelteKit application architecture (use the architecture skill),
  non-shadcn component libraries, or vanilla Tailwind without shadcn components.
---

# shadcn-svelte

Composable, themeable UI components for Svelte 5 built on Bits UI and Tailwind CSS v4. Not a traditional component library — components are copied into your project as open, editable source code.

## Expert vocabulary

**Component system:** data-slot attributes, class prop merging, `cn()` utility (clsx + tailwind-merge), `tv()` component variants (tailwind-variants), `VariantProps`, compound component barrel exports, namespace imports

**Styling:** CSS custom properties, HSL/OKLCH design tokens, Tailwind CSS v4, `@theme` directive, `--color-*` variables, `.dark` class strategy, `color-scheme`, base colors (zinc, slate, stone, neutral, gray)

**Foundation:** bits-ui headless primitives, Formsnap form bindings, Superforms (SvelteKit form library), Zod schema validation, Melt UI (predecessor library), `@lucide/svelte` icons

**Configuration:** `components.json`, `shadcn-svelte` CLI (`add`, `init`, `diff`), `$lib/components/ui/` component paths, `$lib/utils.js` utility module, alias resolution

## Key facts

- Components live in `$lib/components/ui/<component>/` as editable `.svelte` files
- All components use Svelte 5 patterns: `$props()`, snippets (not slots), callback props (not events)
- Styling uses Tailwind CSS v4 with CSS variable design tokens and `tailwind-variants` (`tv()`)
- Headless behavior comes from `bits-ui`; components are styled wrappers
- Icons come from `@lucide/svelte`
- The `cn()` utility (clsx + tailwind-merge) handles class composition
- CLI: `npx shadcn-svelte@latest add <component>` to scaffold components
- Config: `components.json` at project root controls paths, aliases, and base color

## Reference routing

Read only the reference that matches the task.

| Task | Read |
| --- | --- |
| Adding a component, looking up usage/API/examples | [component-index](references/component-index.md) then the specific component file it routes to |
| Project setup, CLI commands, components.json, dark mode | [setup](references/setup.md) |
| CSS variables, design tokens, custom colors, base colors | [theming](references/theming.md) |
| Building forms with Formsnap/Superforms/Zod, or using Field | [forms](references/forms.md) |

## Common mistakes

### 1. Using Svelte 4 component patterns
**Detection:** Props declared with `export let` instead of `$props()`. Slots used instead of snippets. Event dispatching instead of callback props.
**Resolution:** shadcn-svelte v5 requires Svelte 5 runes. Destructure props with `let { prop, ...rest } = $props()`, replace `<slot />` with `{@render children?.()}`, and pass callbacks like `onclick` as props.

### 2. Importing directly from bits-ui
**Detection:** Import paths like `import { Dialog } from "bits-ui"` in application code instead of the local shadcn-svelte wrappers.
**Resolution:** Always import from `$lib/components/ui/<component>/index.js`. The shadcn-svelte wrappers apply the project's design tokens, variants, and class composition. Use bits-ui directly only when building a new primitive that shadcn-svelte does not provide.

### 3. Using @apply in Tailwind v4
**Detection:** `@apply` directives in component styles or global CSS when Tailwind v4 is in use.
**Resolution:** Prefer inline utility classes or CSS custom properties from the design system. In Tailwind v4, `@apply` is discouraged — use `@theme` for token definitions and utility classes for component styling.

### 4. Hardcoding color values
**Detection:** Literal hex/RGB/HSL values like `bg-[#1a1a2e]` or `color: hsl(220, 50%, 20%)` instead of design system tokens.
**Resolution:** Use the CSS variable tokens: `bg-primary`, `text-muted-foreground`, `border-input`, etc. These resolve to the active theme and respect dark mode. Define new tokens in the `@theme` block if the palette needs extending.

### 5. Overriding component internals
**Detection:** Directly editing scaffolded component source files to change behavior, or reaching into internal DOM structure.
**Resolution:** Extend through composition and the `class` prop. Wrap components, pass `class={cn(baseStyles, className)}`, or create new variants in `tv()`. Edit source only when the component genuinely needs a structural change, not for one-off styling.

## Component conventions

### Import pattern

All components use namespace imports from their `index.js` barrel:

```svelte
<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
</script>

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
```

For leaf components without sub-parts, use named imports:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
</script>
```

### Variant pattern

Components use `tailwind-variants` (`tv()`) for variant definitions:

```svelte
<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants";

  export const buttonVariants = tv({
    base: "inline-flex items-center justify-center ...",
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground ...",
        destructive: "bg-destructive text-destructive-foreground ...",
        outline: "border border-input bg-background ...",
        secondary: "bg-secondary text-secondary-foreground ...",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>;
</script>
```

### Class composition

Always merge user classes with `cn()`:

```svelte
<script lang="ts">
  import { cn } from "$lib/utils.js";
  let { class: className, variant, size, ...restProps } = $props();
</script>

<button class={cn(buttonVariants({ variant, size }), className)} {...restProps}>
  {@render children?.()}
</button>
```

### Component anatomy pattern

Compound components export sub-parts from a barrel file:

```ts
// $lib/components/ui/dialog/index.ts
export { default as Root } from "./dialog.svelte";
export { default as Trigger } from "./dialog-trigger.svelte";
export { default as Content } from "./dialog-content.svelte";
export { default as Header } from "./dialog-header.svelte";
export { default as Footer } from "./dialog-footer.svelte";
export { default as Title } from "./dialog-title.svelte";
export { default as Description } from "./dialog-description.svelte";
```

## Notes on component docs

The component reference files in `references/components/` were sourced from the shadcn-svelte documentation site. They may contain residual doc-site formatting artifacts (empty `## Installation` sections, `showLineNumbers` in code fences). Focus on the **Usage** and **Examples** sections for the actual component API and patterns.

## Questions this skill answers

- "Add a Dialog component"
- "How do I use shadcn-svelte?"
- "Set up the design system tokens"
- "Build a form with Superforms"
- "What components are available in shadcn-svelte?"
- "Customize the theme colors"
- "How do variants work?"
- "Set up dark mode"
- "Add a new shadcn component"
- "How do I configure components.json?"
