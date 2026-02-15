# SvelteKit Patterns

## Route Groups

```
routes/
├── (authed)/              # Shared auth layout
│   ├── +layout.server.ts  # Auth guard
│   ├── dashboard/
│   └── settings/
├── (marketing)/           # Public layout
│   ├── pricing/
│   └── about/
└── api/v1/                # API routes
```

## Dynamic Routes

```
routes/
├── blog/[slug]/+page.svelte           # /blog/hello-world
├── docs/[...path]/+page.svelte        # /docs/getting-started/install
└── [org]/[repo]/+page.svelte          # /github/svelte
```

### Prerendering

```ts
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = async () => {
  const all_posts = await get_posts();
  return all_posts.map((post) => ({ slug: post.slug }));
};

export const prerender = true;
```

## Load Functions

### Server Load

```ts
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals, url, depends }) => {
  if (!locals.user) throw redirect(303, '/login');
  depends('app:posts');

  const page_number = Number(url.searchParams.get('page')) || 1;
  const post = await db.posts.findUnique({ where: { slug: params.slug } });
  if (!post) throw error(404, 'Post not found');

  return {
    post,
    page_number,
    comments: db.comments.findMany({ where: { postId: post.id } }),
  };
};
```

### Universal Load

```ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch }) => {
  const enrichment_response = await fetch('/api/enrichment');
  return { ...data, extra: await enrichment_response.json() };
};
```

## Page Data Consumption

```svelte
<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<h1>{data.post.title}</h1>

{#await data.comments}
  <p>Loading comments...</p>
{:then comment_list}
  {#each comment_list as comment}
    <div>{comment.body}</div>
  {/each}
{/await}
```

## Form Actions

```ts
// +page.server.ts
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
  let { data, form }: PageProps & { form: ActionData } = $props();
</script>

<form method="POST" action="?/create" use:enhance>
  <input name="title" value={form?.title ?? ''} />
  {#if form?.missing}<p class="error">Title required</p>{/if}
  <button type="submit">Create</button>
</form>
```

## Hooks

### hooks.server.ts

```ts
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handle_auth: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session');
  if (token) {
    event.locals.user = await validate_session(token);
  }
  return resolve(event);
};

const handle_redirects: Handle = async ({ event, resolve }) => {
  const redirect_map: Record<string, string> = { '/old-path': '/new-path' };
  const redirect_target = redirect_map[event.url.pathname];
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

### hooks.client.ts

```ts
import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = async ({ error }) => {
  console.error('Client error:', error);
  return { message: 'Something went wrong' };
};
```

## API Routes

```ts
// routes/api/posts/+server.ts
import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
  const limit = Number(url.searchParams.get('limit')) || 20;
  return json(await db.posts.findMany({ take: limit }));
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');
  const body = await request.json();
  return json(await db.posts.create({ data: body }), { status: 201 });
};
```

## $app Modules

### $app/state (replaces $app/stores)

```svelte
<script lang="ts">
  import { page, navigating, updated } from '$app/state';

  const is_home = $derived(page.url.pathname === '/');
  const is_loading = $derived(navigating.to !== null);
</script>
```

### $app/navigation

```ts
import { goto, invalidate, invalidateAll } from '$app/navigation';

async function handle_save() {
  await save_data();
  await invalidate('app:posts');
  await goto('/dashboard');
}
```

## Environment Variables

```ts
import { DATABASE_URL, API_SECRET } from '$env/static/private';   // server-only
import { PUBLIC_API_URL } from '$env/static/public';               // client-safe
import { env } from '$env/dynamic/private';                        // runtime
```

## Error Pages

```svelte
<!-- routes/+error.svelte -->
<script lang="ts">
  import { page } from '$app/state';
</script>
<h1>{page.status}</h1>
<p>{page.error?.message ?? 'Something went wrong'}</p>
```

## App Declarations

```ts
// src/app.d.ts
declare global {
  namespace App {
    interface Locals { user: { id: string; email: string } | null }
    interface Error { message: string; code?: string }
    interface PageData { user: App.Locals['user'] }
  }
}
export {};
```
