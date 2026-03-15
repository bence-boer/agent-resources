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

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const form_data = await request.formData();
    const title = form_data.get('title');

    if (!title || typeof title !== 'string') {
      return fail(400, { title, missing: true });
    }

    await db.posts.create({ data: { title, authorId: locals.user.id } });
    return { success: true };
  },
};
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

## 5. Page handler pattern

Use a colocated `page.svelte.ts` file when the page needs meaningful client orchestration.

```ts
class TodoPageHandler {
  todo_list = $state<Todo[]>([]);
  is_loading = $state(false);
  error_message = $state<string | null>(null);

  async refresh() {
    this.is_loading = true;
    try {
      const response = await client.api.todos.$get();
      this.todo_list = await response.json();
    } catch (caught_error) {
      this.error_message = caught_error instanceof Error ? caught_error.message : 'Failed to load';
    } finally {
      this.is_loading = false;
    }
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

## 8. Navigation and invalidation

```ts
import { goto, invalidate } from '$app/navigation';

async function handle_save() {
  await save_post();
  await invalidate('app:posts');
  await goto('/posts');
}
```

Invalidate the narrowest dependency key or URL you can.

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
