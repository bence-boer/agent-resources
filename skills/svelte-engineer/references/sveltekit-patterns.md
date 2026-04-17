# SvelteKit Patterns

Use this reference for route-, load-, action-, and hook-level implementation. It assumes the high-level route structure is already decided.

## 1. Pick the right file first

| File | Default use | Avoid using it for |
| --- | --- | --- |
| `+page.server.ts` | server reads, auth checks, parameter parsing, actions | browser-only behavior |
| `+layout.server.ts` | shared data for a route subtree | page-specific data that does not need to be shared |
| `+page.svelte` | page composition and minimal orchestration | heavy async coordination |
| `page.svelte.ts` | page-scoped client logic, optimistic UI, realtime coordination | app-wide state |
| `+server.ts` | external JSON endpoints, webhooks, non-page APIs | simple page-owned form mutations |
| `.remote.ts` | co-located RPC with automatic serialisation and single-flight mutations (experimental) | page-actions that need progressive enhancement |
| `hooks.server.ts` | auth, request decoration, redirects, logging, rate limits | feature-specific page logic |
| `hooks.client.ts` | client error handling and small global client hooks | general component behavior |

## 2. Load functions

Prefer server load functions for page data.

```ts
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals, depends }) => {
  if (!locals.user) throw redirect(303, '/login');
  depends('app:posts');

  const post = await db.posts.findUnique({ where: { slug: params.slug } });
  if (!post) throw error(404, 'Post not found');

  return {
    post,
    comments: db.comments.findMany({ where: { postId: post.id } }),
  };
};
```

Use promises for independent secondary data so the page can stream or await it separately.

## 3. Page composition

Keep the page thin and typed.

```svelte
<script lang="ts">
  import type { PageProps } from './$types';
  import { CommentsPanel, PostHeader } from '$lib/components/posts';

  let { data, form }: PageProps = $props();
</script>

<PostHeader post={data.post} />
<CommentsPanel comments={data.comments} form={form} />
```

If the page starts accumulating client-only workflows, move them to `page.svelte.ts`.

## 4. Form actions

Use actions for page-owned mutations.

```ts
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions = {
  create: async ({ request, locals }) => {
    const form_data = await request.formData();
    const title = form_data.get('title');

    if (!title || typeof title !== 'string') {
      return fail(400, { title, missing: true });
    }

    await db.posts.create({ data: { title, authorId: locals.user.id } });
    return { success: true };
  },
} as const satisfies Actions;
```

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageProps } from './$types';

  let { form }: PageProps & { form: ActionData } = $props();
</script>

<form method="POST" action="?/create" use:enhance>
  <input name="title" value={form?.title ?? ''} />
  {#if form?.missing}<p>Title required</p>{/if}
  <button type="submit">Create</button>
</form>
```

### Typed `SubmitFunction` for `enhance`

```ts
import { enhance } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';

// Generic params: <SuccessData, FailureData> — narrows result.data
const submit: SubmitFunction = ({ formElement, controller, cancel }) => {
  // Pre-submit: validate, set loading state
  // Return callback for post-submit (optional)
  return async ({ result, update }) => {
    if (result.type === 'success') await update({ reset: true });
    if (result.type === 'failure') show_errors(result.data);
    if (result.type === 'error') show_toast('Unexpected error');
  };
};
```

```svelte
<form method="POST" action="?/create" use:enhance={submit}>
```

Abort in-flight submissions: `controller.abort()` in the pre-submit callback when a new submission starts.

## 5. Page handler pattern

Use a colocated `page.svelte.ts` file when the page needs meaningful client orchestration.

```ts
class TodoPageHandler {
  todo_list = $state<Todo[]>([]);
  is_loading = $state(false);
  error_message = $state<string | null>(null);

  refresh() {
    this.is_loading = true;
    client.api.todos.$get()
      .then((response) => response.json())
      .then((data: Todo[]) => { this.todo_list = data; })
      .catch((error: unknown) => {
        this.error_message = error instanceof Error ? error.message : 'Failed to load';
      })
      .finally(() => { this.is_loading = false; });
  }
}

export const todo_page_handler = new TodoPageHandler();
```

Keep the handler page-scoped. Do not promote it to a global singleton unless the state must survive navigation.

## 6. Hooks

Compose server hooks by concern.

```ts
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handle_auth: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session');
  if (token) event.locals.user = await validate_session(token);
  return resolve(event);
};

const handle_redirects: Handle = async ({ event, resolve }) => {
  const redirect_target = REDIRECTS[event.url.pathname];
  if (redirect_target) {
    return new Response(null, { status: 301, headers: { location: redirect_target } });
  }
  return resolve(event);
};

export const handle = sequence(handle_auth, handle_redirects);

export const handleError: HandleServerError = async ({ error }) => {
  console.error(error);
  return { message: 'An unexpected error occurred', code: 'UNEXPECTED' };
};
```

Use `getRequestEvent()` from `$app/server` to access request context in reusable server utilities — avoids threading `event` through every function signature:

```ts
// src/lib/server/auth.ts
import { getRequestEvent } from '$app/server';

export function get_current_user() {
  return getRequestEvent().locals.user; // works in hooks, load fns, remote fns
}
```

## 7. API routes

Use `+server.ts` only when the endpoint is not naturally a page action.

```ts
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');
  const body = await request.json();
  return json(await db.posts.create({ data: body }), { status: 201 });
};
```

## 8. Navigation, paths, and invalidation

```ts
import { goto, invalidate } from '$app/navigation';

async function handle_save() {
  await save_post();
  await invalidate('app:posts'); // narrow — only re-runs loads that depend on 'app:posts'
  await goto('/posts');
}
```

### `resolve()` + `asset()` from `$app/paths`

```ts
import { resolve, asset } from '$app/paths';

// ✅ base is prepended automatically; typed route ID + params
const post_href = resolve('/blog/[slug]', { slug: 'hello-world' });
const logo_src = asset('/images/logo.png');

// ❌ deprecated manual concatenation
// import { base } from '$app/paths';
// const href = `${base}/blog/hello-world`;
```

**`match()`** (v2.52+) — resolve a URL path to a typed route ID + params:

```ts
import { match } from '$app/paths';

const route = await match('/blog/hello-world');
if (route?.id === '/blog/[slug]') {
  const { slug } = route.params; // TS narrows params to { slug: string }
}
```

### Shallow routing — `pushState` / `replaceState`

Updates `page.state` without triggering load functions. Requires `App.PageState` declaration:

```ts
// app.d.ts
declare namespace App {
  interface PageState {
    photo_id?: string;
  }
}
```

```ts
import { pushState } from '$app/navigation';
import { page } from '$app/state';

function open_photo(id: string) {
  pushState('', { photo_id: id }); // no URL change, no load fn re-run
}
```

```svelte
{#if page.state.photo_id}
  <PhotoModal id={page.state.photo_id} on_close={() => history.back()} />
{/if}
```

### `onNavigate` + View Transitions API

```ts
import { onNavigate } from '$app/navigation';

onNavigate((navigation) => {
  if (!document.startViewTransition) return;
  return new Promise<void>((resolve) => {
    document.startViewTransition(async () => {
      resolve();
      await navigation.complete;
    });
  });
});
```

`onNavigate` may return a `Promise` — the navigation waits for it to settle. Also use for save-before-leaving dialogs or analytics flushing.

## 9. Error pages and app state

```svelte
<script lang="ts">
  import { page } from '$app/state';
</script>

<h1>{page.status}</h1>
<p>{page.error?.message ?? 'Something went wrong'}</p>
```

Use `$app/state`, not `$app/stores`.

## 10. Environment boundaries

- `$env/static/private` for server-only secrets
- `$env/static/public` for client-safe public vars
- `$env/dynamic/*` only when runtime resolution is required

Keep secret access out of components and browser code.

## 11. Advanced hooks

### handleFetch
Rewrite internal fetch URLs or forward cookies to subdomains:

```ts
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  if (request.url.startsWith('https://api.example.com/')) {
    request = new Request(request.url.replace('https://api.example.com/', 'http://internal-api:3000/'), request);
    request.headers.set('cookie', event.request.headers.get('cookie') ?? '');
  }
  return fetch(request);
};
```

### transformPageChunk
Inject analytics or scripts into the HTML response:

```ts
const handle_transform: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace('</head>', '<script>/* analytics */</script></head>'),
  });
};
```

### filterSerializedResponseHeaders
Control which headers are visible to client-side universal load `fetch` calls:

```ts
const handle_headers: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    filterSerializedResponseHeaders: (name) =>
      ['content-type', 'cache-control', 'x-request-id'].includes(name),
  });
};
```

## 12. SSR safety

### Hydration mismatch prevention
Never use non-deterministic values directly in templates:

```ts
// ❌ different on server vs client
<p>Rendered at {Date.now()}</p>

// ✅ use load function data
export const load = async () => ({ timestamp: Date.now() });
```

### FOUC prevention
Import CSS only in the root `+layout.svelte`, never in individual page components. For critical above-the-fold styles, inline a minimal `<style>` block in `app.html`.

## 13. Prefetch patterns

Prefetch implementation recipes are in [performance-patterns.md](performance-patterns.md#prefetch-patterns) — link-level (`data-sveltekit-preload-data`, `data-sveltekit-preload-code`) and programmatic (`preloadData`, `preloadCode`, `requestIdleCallback`).

### Explicit dependency tracking
```ts
// In load function
export const load = async ({ depends, fetch }) => {
  depends('app:posts');
  const posts = await fetch('/api/posts').then(response => response.json());
  return { posts };
};

// In component — invalidate narrowly
import { invalidate } from '$app/navigation';
await invalidate('app:posts');

// Conditional invalidation
await invalidate((url) => url.pathname.startsWith('/api/posts'));
```

## 14. Remote Functions (SvelteKit 2.27+, experimental)

> **Requires `kit.experimental.remoteFunctions: true` in `svelte.config.ts`**

Remote functions replace `+server.ts` + manual `fetch` for component-colocated RPC. Define in `.remote.ts` files anywhere under `src/` (except `src/lib/server/`). Import directly in `.svelte` files.

### `query` — Server reads for components

```ts
// src/lib/todos.remote.ts
import { query } from '$app/server';
import * as valibot from 'valibot';
import type { Todo } from '$lib/types';

export const get_todos = query(
  valibot.object({ user_id: valibot.string() }),
  async ({ user_id }): Promise<Todo[]> => db.todos.findMany({ where: { user_id } })
);
```

```svelte
<script lang="ts">
  import { get_todos } from '$lib/todos.remote';
  // RemoteQuery<Todo[]> — awaitable + .current / .loading / .error
  const todos = get_todos({ user_id: current_user_id });
  // Must be anchored to reactive context — never at module scope (memory leak)
</script>

{#await todos}
  <Spinner />
{:then items}
  {#each items as todo}<li>{todo.text}</li>{/each}
{/await}
```

### `command` — Mutations with single-flight updates

```ts
// src/lib/todos.remote.ts
import { command } from '$app/server';
import * as valibot from 'valibot';

export const add_todo = command(
  valibot.object({ text: valibot.string() }),
  async ({ text }) => db.todos.create({ data: { text } })
);
```

```svelte
<button onclick={async () => {
  await add_todo({ text: 'new item' })
    .updates(todos); // piggybacks fresh todos on the response — one round-trip
}}>Add</button>
```

### `form` — Type-safe remote forms with progressive enhancement

```ts
// src/lib/todos.remote.ts
import { form, invalid } from '$app/server';
import * as valibot from 'valibot';

export const create_todo = form(
  valibot.object({
    text: valibot.string(),
    priority: valibot.pipe(valibot.number(), valibot.minValue(1), valibot.maxValue(5)),
  }),
  async ({ text, priority }, issue) => {
    if (priority > 5) invalid(issue.priority('Must be 5 or less'));
    return db.todos.create({ data: { text, priority } });
  }
);
```

```svelte
<!-- Spread pattern — provides method, action URL, and enhancement automatically -->
<form {...create_todo}>
  <input {...create_todo.fields.text.as('text')} />
  {#if create_todo.fields.text.issues().length}
    <p class="text-destructive">{create_todo.fields.text.issues()[0].message}</p>
  {/if}
  <button>Create</button>
</form>
```

**`form.for(id)`** — deduplicate form instances in lists:

```svelte
{#each todos as todo (todo.id)}
  {@const todo_form = update_todo.for(todo.id)}
  <form {...todo_form}>
    <input name="text" value={todo.text} />
    <button>Save</button>
  </form>
{/each}
```

### Single-flight refresh via `refreshAll()` vs `invalidateAll()`

`refreshAll()` re-runs remote query functions only. `invalidateAll()` re-runs `load` functions. They are separate and not interchangeable:

```ts
import { requested } from '$app/server';
import * as valibot from 'valibot';

export const update_post = command(
  valibot.object({ id: valibot.string(), content: valibot.string() }),
  async ({ id, content }) => {
    await db.posts.update({ where: { id }, data: { content } });
    // Refresh only the getPost queries the client asked to refresh
    await requested(get_post, 5).refreshAll(); // NOT invalidateAll()
  }
);
```

### `prerender` — Build-time static data

```ts
// src/routes/blog/data.remote.ts
import { prerender } from '$app/server';
import * as valibot from 'valibot';

export const get_posts = prerender(async () =>
  db.sql`SELECT title, slug FROM post ORDER BY published_at DESC`
);

// With args — each unique arg combo is prerendered once at build time
export const get_post = prerender(valibot.string(), async (slug) =>
  db.posts.findUnique({ where: { slug } })
);
```

**`invalid` vs `fail`:** `invalid` (from `$app/server`) is for remote form validation errors surfaced via `RemoteForm`. `fail` (from `@sveltejs/kit`) is for classic `+page.server.ts` actions. They are not interchangeable.
