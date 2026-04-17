# Performance Patterns

## Lazy Component Loading

Load heavy components on demand:

```svelte
<script lang="ts">
  import type { Component } from 'svelte';

  let HeavyChart: Component | undefined = $state();

  $effect(() => {
    import('./heavy-chart.svelte').then((m) => { HeavyChart = m.default; });
  });
</script>

{#if HeavyChart}
  <HeavyChart {data} />
{:else}
  <div class="animate-pulse h-64 rounded-lg bg-muted" />
{/if}
```

## Intersection Observer Lazy Sections

Defer rendering until visible:

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children, class: class_name, threshold = 0.1 }: {
    children: Snippet;
    class?: string;
    threshold?: number;
  } = $props();

  let container: HTMLElement | undefined = $state();
  let is_visible = $state(false);

  $effect(() => {
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { is_visible = true; observer.disconnect(); } },
      { threshold },
    );
    observer.observe(container);
    return () => observer.disconnect();
  });
</script>

<div bind:this={container} class={class_name}>
  {#if is_visible}
    {@render children()}
  {:else}
    <div class="animate-pulse h-48 rounded-lg bg-muted" />
  {/if}
</div>
```

## Prefetch Patterns

### Link-Level

```svelte
<!-- Prefetch data on hover (default for SvelteKit <a>) -->
<a href="/dashboard" data-sveltekit-preload-data="hover">Dashboard</a>

<!-- Prefetch on viewport entry (good for visible nav lists) -->
<a href="/item/{id}" data-sveltekit-preload-data="viewport">Item</a>

<!-- Code only (no data) for less-critical links -->
<a href="/settings" data-sveltekit-preload-code="hover">Settings</a>
```

### Programmatic

```ts
import { preloadData, preloadCode } from '$app/navigation';

// Prefetch likely next routes during idle time
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    preloadData('/dashboard');
    preloadCode('/settings');
  });
}
```

## Streaming Secondary Data

Return promises for non-critical data so the page renders without waiting:

```ts
// +page.server.ts
export const load = async ({ params }) => {
  const post = await db.posts.find(params.id); // critical — await
  return {
    post,
    comments: db.comments.findMany({ postId: params.id }), // streamed — no await
    related: db.posts.findRelated(params.id), // streamed — no await
  };
};
```

```svelte
<!-- +page.svelte -->
<PostHeader post={data.post} />

{#await data.comments}
  <CommentsSkeleton />
{:then comments}
  <CommentsPanel {comments} />
{/await}
```

## Image Optimization

```svelte
<picture>
  <source srcset="/images/hero.avif" type="image/avif" />
  <source srcset="/images/hero.webp" type="image/webp" />
  <img
    src="/images/hero.jpg"
    alt="Hero"
    width="1200"
    height="630"
    loading="lazy"
    decoding="async"
    srcset="/images/hero-400.jpg 400w, /images/hero-800.jpg 800w, /images/hero-1200.jpg 1200w"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1200px"
  />
</picture>
```

Above-the-fold images: remove `loading="lazy"`, add `fetchpriority="high"`.

## Font Optimization

```css
/* app.css — variable font with swap for body text */
@font-face {
  font-family: 'Inter Variable';
  src: url('/fonts/inter-variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

/* optional for display/decorative fonts — prevents layout shift */
@font-face {
  font-family: 'Display Font';
  src: url('/fonts/display.woff2') format('woff2');
  font-display: optional;
}
```

Rules:

- `font-display: swap` for body text (content visible immediately)
- `font-display: optional` for decorative/display fonts (prevents layout shift)
- Use variable fonts to serve one file covering all weights

## Bundle Analysis

```ts
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    visualizer({ open: true, gzipSize: true }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['some-large-lib'],
        },
      },
    },
  },
});
```

Run `npm run build` and inspect the generated `stats.html`.

## Core Web Vitals Monitoring

```ts
// hooks.client.ts or a component loaded on every page
import { onCLS, onFID, onLCP, onTTFB, onINP } from 'web-vitals';
import type { Metric } from 'web-vitals';

function report_metric(metric: Metric) {
  // Send to analytics endpoint
  navigator.sendBeacon('/api/vitals', JSON.stringify(metric));
}

onCLS(report_metric);
onFID(report_metric);
onLCP(report_metric);
onTTFB(report_metric);
onINP(report_metric);
```

Targets: LCP < 2.5s, FID < 100ms, CLS < 0.1, INP < 200ms.

## CSS Optimization

See [tailwind-v4-patterns.md](tailwind-v4-patterns.md#lightning-css-optimization) for the Lightning CSS Vite config (`cssMinify: 'lightningcss'`, `cssCodeSplit: true`). Use `cssCodeSplit: true` to generate per-route CSS bundles.
