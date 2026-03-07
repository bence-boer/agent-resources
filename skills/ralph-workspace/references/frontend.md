# Frontend Patterns

## Svelte 5 — Mandatory Patterns

This project uses Svelte 5 exclusively. Legacy patterns are forbidden.

| Use This (Svelte 5) | Never This (Legacy) |
|---------------------|---------------------|
| `let count = $state(0)` | `let count = 0` with `$:` |
| `let doubled = $derived(count * 2)` | `$: doubled = count * 2` |
| `$effect(() => { ... })` | `onMount` for reactive side effects |
| `let { data, onchange } = $props()` | `export let data` |
| `{@render children?.()}` | `<slot>` |
| Callback props: `onclick` | `createEventDispatcher` |

## Component Architecture

**200-line maximum per file.** This is enforced by ESLint. When a component approaches this limit,
extract subcomponents proactively.

Extraction patterns that have been applied in this codebase:
- God pages → feature-specific components (FeatureList, FeatureDetail, TaskList)
- Layout sidebar → SidebarNav component
- Dashboard → PipelineStat, QuickActions components
- Admin → InviteSuccess, UserActions components
- Forms → dedicated form components with callback props

**Extraction trigger:** If a page has more than two distinct "areas" (e.g., a list panel and a
detail panel), each area should be its own component.

## State Management

**No stores. No global state management libraries.** State lives in components via `$state()`.

### Polling Pattern

Data is fetched via polling, not WebSockets or SSE (except chat):

```svelte
<script lang="ts">
    let features = $state<Feature[]>([]);

    $effect(() => {
        const load = async () => {
            const response = await client.api.features.$get();
            const data = await response.json();
            if ('error' in data) return;

            // Reconcile by key — preserve object identity to avoid UI flicker
            for (const item of data) {
                const existing = features.find((f) => f.id === item.id);
                if (existing) Object.assign(existing, item);
                else features.push(item);
            }
            // Remove items no longer in response
            features = features.filter((f) => data.some((d) => d.id === f.id));
        };

        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval); // Cleanup on unmount
    });
</script>
```

**Key rule:** Never replace the entire array (`features = newData`). This destroys object identity,
causing scroll position loss, animation resets, and UI flicker. Reconcile by key using
`Object.assign` for existing items.

## API Client (RPC)

The frontend uses Hono's typed RPC client:

```typescript
import type { AppType } from 'server/src/public';
import { hc } from 'hono/client';

export const client = hc<AppType>(API_URL, {
    init: { credentials: 'include' },
    fetch: custom_fetch
});
```

The `custom_fetch` wrapper handles:
- 401 responses → redirect to login
- 403 responses → redirect to unauthorized page
- Error extraction from response body
- Cookie-based session management

**No manual `fetch()` calls.** Use the typed RPC client for all API calls. Types are inferred
automatically — no generic type parameters needed.

## Derived Types

All frontend types are derived from the server's API contract:

```typescript
import type { InferResponseType } from 'hono/client';
import type { AppType } from 'server/src/public';

type Client = ReturnType<typeof hc<AppType>>;
type ExtractSuccess<T> = Exclude<T, { error: unknown }>;

export type Project = ExtractSuccess<InferResponseType<Client['api']['projects']['$get']>>[number];
export type Feature = ExtractSuccess<InferResponseType<Client['api']['features']['$get']>>[number];
```

Never hand-write interfaces that duplicate API response shapes. If the type doesn't match what the
API returns, the problem is in the API — fix it there.

## CSS

**Dark theme using CSS custom properties.** All colors reference variables defined in `+layout.svelte`:

```css
--bg            /* Page background */
--bg-surface    /* Card/panel background */
--bg-elevated   /* Elevated elements (modals, dropdowns) */
--bg-hover      /* Hover state */
--fg            /* Primary text */
--fg-muted      /* Secondary text */
--fg-faint      /* Tertiary/disabled text */
--accent        /* Primary accent color */
--accent-hover  /* Accent hover state */
--border        /* Border color */
--border-light  /* Subtle borders */
--success       /* Green */
--warning       /* Amber */
--danger        /* Red */
```

**Use exact variable names.** `--text-muted` does not exist — it's `--fg-muted`. A wrong name
silently renders nothing with no error.

### Mobile Responsive

```css
@media (max-width: 768px) { ... }
```

**Mobile overflow prevention:**
- Every flex child: `min-width: 0` (prevents content from forcing parent wider)
- Text containers: `overflow-wrap: break-word`
- Page containers: `overflow-x: hidden` as a safety net
- Never use `flex-shrink: 0` on content elements in horizontal layouts

Overflow must be addressed at EVERY nesting level, not just the outermost container. A single
`flex-shrink: 0` child deep in a nested flex hierarchy will cause horizontal scroll.

### Component Styling

- Use `<style>` blocks in `.svelte` files (scoped by default)
- No CSS-in-JS, no Tailwind
- Error toasts auto-dismiss at 10 seconds (not 5 — users need time to read)
- Confirm dialogs for destructive actions

## SvelteKit Specifics

- SSR is disabled (`export const ssr = false` in `+layout.ts`)
- Auth is checked client-side via `onMount` in the root layout
- Navigation uses SvelteKit's `goto()` and `<a>` elements
- `$env/static/public` values are baked at BUILD time. In CI, set `PUBLIC_API_URL=` (empty) to
  force relative URLs. Do not rely on runtime values from static env.
