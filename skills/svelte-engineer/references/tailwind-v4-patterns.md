# Tailwind v4 Patterns

## CSS-First Configuration

TW v4 replaces `tailwind.config.js` with CSS-native directives in `app.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.7 0.15 250);
  --color-primary-foreground: oklch(0.98 0.01 250);
  --color-secondary: oklch(0.85 0.05 250);
  --color-background: oklch(0.98 0.01 250);
  --color-foreground: oklch(0.15 0.02 250);
  --color-card: oklch(1 0 0);
  --color-accent: oklch(0.65 0.2 330);

  --font-sans: 'Inter Variable', sans-serif;
  --font-mono: 'JetBrains Mono Variable', monospace;

  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;
  --radius-xl: 2rem;

  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px oklch(0 0 0 / 0.1);
}
```

## Vite Plugin Order

Critical: `tailwindcss()` MUST come BEFORE `sveltekit()`:

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

Wrong order causes CSS processing failures.

## Custom Utilities

Define reusable utilities in `app.css`:

```css
@utility pop-card {
  @apply rounded-[2rem] border-2 border-primary bg-card shadow-[4px_4px_0px_var(--color-accent)];
}

@utility glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
}

@utility animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Then use in templates: `<div class="pop-card">` or `<div class="glass animate-fade-in">`.

## Custom Variants

```css
@custom-variant data-open (&[data-state=open]);
@custom-variant data-closed (&[data-state=closed]);
@custom-variant motion-safe (@media (prefers-reduced-motion: no-preference));
```

Usage: `<div class="data-open:opacity-100 data-closed:opacity-0">`.

## Content Source Paths

Configure where TW scans for classes:

```css
@source "../node_modules/@my-ui/components/src/**/*.svelte";
@source "./src/**/*.{svelte,ts,js}";
```

## Dark Mode

### CSS Variables Approach

```css
@theme {
  --color-background: oklch(0.98 0.01 250);
  --color-foreground: oklch(0.15 0.02 250);
}

.dark {
  --color-background: oklch(0.12 0.02 250);
  --color-foreground: oklch(0.95 0.01 250);
}
```

### Toggle Implementation

```ts
// theme-toggle.svelte.ts
function get_preferred_theme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

class ThemeManager {
  mode: 'light' | 'dark' = $state(get_preferred_theme());
  is_dark = $derived(this.mode === 'dark');

  toggle() {
    this.mode = this.mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.mode);
    document.documentElement.classList.toggle('dark', this.is_dark);
  }
}

export const theme = new ThemeManager();
```

Apply on load to prevent flash: add `<script>` in `app.html` `<head>`:

```html
<script>
  (function() {
    const t = localStorage.getItem('theme');
    const d = t === 'dark' || (!t && matchMedia('(prefers-color-scheme:dark)').matches);
    if (d) document.documentElement.classList.add('dark');
  })();
</script>
```

## Dynamic Classes

### Complete Names Only

```svelte
<!-- ❌ Template interpolation — purged in production -->
<div class={`bg-${color}-500`}>

<!-- ✅ Complete class names -->
<div class={color === 'blue' ? 'bg-blue-500' : 'bg-red-500'}>

<!-- ✅ Object mapping for multiple options -->
<script lang="ts">
  const color_classes: Record<string, string> = {
    blue: 'bg-blue-500 text-blue-50',
    red: 'bg-red-500 text-red-50',
    green: 'bg-green-500 text-green-50',
  };
</script>
<div class={cn(color_classes[color], class_name)}>
```

### Truly Dynamic Values

For values that cannot be enumerated, use CSS custom properties:

```svelte
<div
  class="rounded-lg border p-4"
  style:background-color="var(--dynamic-bg, transparent)"
  style:--dynamic-bg={user_color}
>
```

## @apply Limitation

`@apply` does NOT work inside component scoped `<style>` tags in TW v4. Workarounds:

1. Define `@utility` classes in `app.css` and use them in templates
2. Use `@layer components { }` in `app.css` for grouped styles
3. Use `cn()` composition in templates instead of `@apply`

## Lightning CSS Optimization

```ts
// vite.config.ts
export default defineConfig({
  css: {
    devSourcemap: true,
  },
  build: {
    cssMinify: 'lightningcss',
    cssCodeSplit: true,
    sourcemap: true,
  },
});
```
