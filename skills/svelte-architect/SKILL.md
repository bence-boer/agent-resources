---
name: svelte-architect
description: Svelte 5 production architecture guide covering runes-based reactivity, component API design, SvelteKit integration, TypeScript patterns, and design systems. Use when building Svelte 5 apps or component libraries, creating components, setting up project architecture, implementing state management, designing component APIs, working with SvelteKit routing and data fetching, integrating backend APIs with type safety, or reviewing Svelte code. Triggers on any Svelte 5 (.svelte, .svelte.ts), SvelteKit, or Tailwind + Svelte task.
---

# Svelte 5 Master Architect

## Motivation

These patterns are distilled from runed, shadcn-svelte, svelte.dev, hono-svelte-5, and skeleton v3. Svelte 5 replaces stores, event dispatchers, slots, and `$:` with runes and snippets — a unified reactivity model that works identically inside and outside components. Class-based `.svelte.ts` modules replace writable/derived stores with direct property access. Components expose barrel files with named exports for clean, tree-shakeable imports. Callback props replace event dispatchers for type-safe parent-child communication. The `data-slot` convention and `tailwind-variants` provide a scalable design system layer. All code follows snake_case naming for variables/functions, descriptive names (no single-letter abbreviations), and named imports exclusively.

## Absolute Rules

1. **NEVER** use `export let` — use `$props()` exclusively
2. **NEVER** use `createEventDispatcher` — use callback props (`on_action`)
3. **NEVER** use `svelte/store` (`writable`, `readable`, `derived`) — use runes or class-based stores in `.svelte.ts`
4. **NEVER** use `<slot>` — use `{@render children?.()}` with Snippet types
5. **NEVER** use `$:` reactive declarations — use `$derived` or `$derived.by()`
6. **NEVER** use default exports/imports for components — use named exports via barrel files
7. **ALWAYS** use `.svelte.ts` extension (not `.ts`) for files containing runes
8. **ALWAYS** prefer `$derived` over `$effect` — `$effect` is for side effects only
9. **ALWAYS** spread `...rest_props` on the root element for prop delegation
10. **ALWAYS** use `ref = $bindable(null)` as the first destructured prop
11. **ALWAYS** rename `class` to `class_name`: `class: class_name`
12. **ALWAYS** expose components from their directory via barrel `index.ts` with named exports
13. **ALWAYS** use snake_case for variables, functions, and method names
14. **ALWAYS** use descriptive names — no single-letter loop/lambda variables (`index` not `i`), no single-letter generics (`DataType` not `T`)
15. **ALWAYS** sort imports alphabetically by module path
16. **ALWAYS** use early-return guard clauses (`if (!x) return`) over wrapping function bodies in conditional blocks
17. **ALWAYS** use concise expressions — arrow syntax without braces for single-expression functions, inline trivial intermediate variables
18. **ALWAYS** use `cn()` for all class composition — never interpolate classes via template strings
19. **ALWAYS** prefer data-driven rendering (typed config + iteration) over repeated markup with per-item conditionals
20. **NEVER** use inline type assertions (`as const`, `as Type`) when proper types can be extracted from library signatures

## Decision Trees

### Where to Put Logic

```
Uses $state, $derived, or $effect?
├── YES → .svelte.ts file
│   ├── Utility/primitive → Class with #private $state + public getters
│   ├── Page-specific logic → Colocated page.svelte.ts handler class
│   └── Global state → Module-level singleton class export
└── NO → Plain .ts file
```

### State Management

```
What kind of state?
├── Component-local → $state inside <script>
├── Derived/computed → $derived or $derived.by()
├── Parent-child shared → $bindable() props + bind:value
├── Component tree shared → Context API (setContext/getContext)
├── Global app state → Class with $state in .svelte.ts singleton
└── URL state → SvelteKit load functions
```

### Component vs Utility

```
Renders DOM?
├── YES → .svelte component
│   ├── Wrapping primitive → Extend primitive props + styling
│   ├── Compound → Barrel file with named Root + Parts exports
│   └── Simple element → Extend HTMLAttributes
└── NO → .svelte.ts reactive utility
    ├── Stateful object → Class with $state + get accessors
    └── Imperative setup → Function with use_* or on_* prefix
```

## Core Patterns

### Component Blueprint

```svelte
<script lang="ts" module>
  import { tv, type VariantProps } from 'tailwind-variants';

  export const card_variants = tv({
    base: 'inline-flex items-center',
    variants: {
      variant: { default: 'bg-primary', destructive: 'bg-destructive' },
      size: { sm: 'h-8 px-3', md: 'h-9 px-4', lg: 'h-10 px-6' },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  });

  export type CardVariant = VariantProps<typeof card_variants>['variant'];
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils.js';

  let {
    ref = $bindable(null),
    class: class_name,
    variant = 'default',
    size = 'md',
    children,
    ...rest_props
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: CardVariant;
    size?: 'sm' | 'md' | 'lg';
    children?: Snippet;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="card"
  class={cn(card_variants({ variant, size }), class_name)}
  {...rest_props}
>
  {@render children?.()}
</div>
```

### Barrel File (Named Exports)

```ts
// components/ui/card/index.ts
export { Card } from './card.svelte';
export { card_variants, type CardVariant } from './card.svelte';
```

### Compound Component Barrel

```ts
// components/ui/dialog/index.ts
export { DialogRoot as Dialog } from './dialog-root.svelte';
export { DialogContent } from './dialog-content.svelte';
export { DialogTrigger } from './dialog-trigger.svelte';
export { DialogOverlay } from './dialog-overlay.svelte';
```

### Reactive Utility (Class-Based)

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

### Context Pattern

```ts
// context.svelte.ts
import { getContext, setContext } from 'svelte';

const CONTEXT_KEY = Symbol('dialog-context');

class DialogState {
  readonly props: { get_open: () => boolean; set_open: (value: boolean) => void };
  is_open = $derived.by(() => this.props.get_open());

  constructor(props: typeof DialogState.prototype.props) {
    this.props = props;
  }
}

export function set_dialog_context(props: ConstructorParameters<typeof DialogState>[0]) {
  return setContext(CONTEXT_KEY, new DialogState(props));
}

export function use_dialog_context(): DialogState {
  return getContext<DialogState>(CONTEXT_KEY);
}
```

### Global Store

```ts
// stores/user.svelte.ts
class UserStore {
  current_user = $state<User | null>(null);
  is_logged_in = $derived(this.current_user !== null);
  set_user(user: User | null) { this.current_user = user; }
}

export const user_store = new UserStore();
```

## References

- [Project structure](references/project-structure.md)
- [Component patterns](references/component-patterns.md)
- [State & reactivity](references/state-reactivity.md)
- [SvelteKit patterns](references/sveltekit-patterns.md)
- [TypeScript patterns](references/typescript-patterns.md)
- [Anti-patterns](references/anti-patterns.md)
