# Project Structure

## SvelteKit Layout

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/                    # Design-system primitives
│   │   │   ├── button/
│   │   │   │   ├── index.ts       # Barrel: named exports only
│   │   │   │   └── button.svelte
│   │   │   └── dialog/
│   │   │       ├── index.ts
│   │   │       ├── dialog-root.svelte
│   │   │       ├── dialog-content.svelte
│   │   │       ├── dialog-trigger.svelte
│   │   │       └── dialog-overlay.svelte
│   │   └── [feature]/             # Feature-specific compounds
│   ├── stores/                    # Global reactive state (.svelte.ts)
│   ├── utils/                     # Pure utilities (.ts)
│   ├── hooks/                     # Reusable reactive primitives (.svelte.ts)
│   └── server/                    # Server-only utilities
├── routes/
│   ├── +layout.svelte
│   ├── +layout.server.ts
│   ├── (app)/                     # Authenticated route group
│   ├── (marketing)/               # Public route group
│   ├── api/[resource]/+server.ts
│   └── _shared/                   # Non-route shared components (underscore prefix)
├── hooks.server.ts
├── hooks.client.ts
├── app.d.ts
├── app.css
└── app.html
```

## File Extensions

| Extension | Use When |
|-----------|----------|
| `.svelte` | Renders DOM |
| `.svelte.ts` | Contains runes outside components |
| `.ts` | Pure logic, types, utilities without runes |
| `.server.ts` | Server-only code |

Using `.ts` with runes causes compiler errors — `.svelte.ts` is required.

## Barrel Exports

### Single Component

```ts
// components/ui/button/index.ts
export { Button } from './button.svelte';
export { button_variants, type ButtonVariant } from './button.svelte';
```

### Compound Component

```ts
// components/ui/dialog/index.ts
export { DialogRoot as Dialog } from './dialog-root.svelte';
export { DialogContent } from './dialog-content.svelte';
export { DialogTrigger } from './dialog-trigger.svelte';
export { DialogOverlay } from './dialog-overlay.svelte';
```

### Three-Level Barrels (Library Pattern)

```
packages/runed/src/
├── lib/
│   ├── utilities/
│   │   ├── use-debounce/
│   │   │   ├── index.ts              # Level 1: re-exports implementation
│   │   │   └── use_debounce.svelte.ts
│   │   └── index.ts                  # Level 2: re-exports all utilities
│   └── index.ts                      # Level 3: re-exports everything
└── index.ts                          # Package entry
```

## Naming Conventions

| Convention | Example | Used For |
|-----------|---------|----------|
| kebab-case dirs | `use-debounce/` | Directories |
| snake_case files | `use_debounce.svelte.ts` | Utility implementations |
| kebab-case files | `dialog-content.svelte` | Components |
| PascalCase exports | `DialogContent` | Component exports |
| snake_case exports | `use_debounce` | Utility/hook exports |

## Configuration

### svelte.config.js

```js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      '$components': 'src/lib/components',
      '$stores': 'src/lib/stores',
    },
  },
};

export default config;
```

### Tailwind v4 (app.css)

```css
@import 'tailwindcss';
@import 'tailwindcss/theme' layer(theme);

@theme {
  --color-primary: oklch(0.637 0.237 25.331);
  --color-secondary: oklch(0.776 0.086 230.2);
  --radius-default: 0.5rem;
}
```

### cn() Utility

```ts
// src/lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
```
