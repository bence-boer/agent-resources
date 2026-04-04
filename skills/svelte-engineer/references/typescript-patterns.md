# TypeScript Patterns

## End-to-End Type Safety (Hono)

### Backend

```ts
// backend/src/index.ts
const app = new Hono()
  .get('/api/todos', async (context) => {
    return context.json(await db.select().from(todos_table));
  })
  .post('/api/todos', zValidator('json', create_todo_schema), async (context) => {
    const data = context.req.valid('json');
    const [todo] = await db.insert(todos_table).values(data).returning();
    return context.json(todo, 201);
  });

export type AppType = typeof app;
```

Routes MUST be chained (`.get().post()`) for type inference. Separate calls lose type info.

### Frontend

```ts
// lib/api.ts
import { hc } from 'hono/client';
import type { AppType } from '@backend/index';

export const api_client = hc<AppType>('/');
```

### Cross-Workspace Aliases

```json
// frontend/tsconfig.json
{ "compilerOptions": { "paths": { "@backend/*": ["../backend/src/*"] } } }
```

```ts
// frontend/vite.config.ts
resolve: { alias: { '@backend': path.resolve(__dirname, '../backend/src') } }
```

## Component Types

### Extending HTML Elements

```ts
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';

enum ButtonVariant {
  DEFAULT = 'default',
  DESTRUCTIVE = 'destructive',
  OUTLINE = 'outline',
}

enum ButtonSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

type ButtonProps = HTMLButtonAttributes & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: Snippet;
};
```

### WithElementRef

```ts
type WithElementRef<
  BaseProps extends HTMLAttributes<HTMLElement>,
  Element extends HTMLElement = HTMLElement,
> = BaseProps & { ref?: Element | null };
```

### ComponentProps

```ts
import type { ComponentProps } from 'svelte';
import { Button } from '$lib/components/ui';

type ButtonProps = ComponentProps<typeof Button>;
```

### Snippet Types

```ts
import type { Snippet } from 'svelte';

type Props = {
  children?: Snippet;
  header?: Snippet<[]>;
  row?: Snippet<[item: Item, index: number]>;
  footer?: Snippet<[{ total: number }]>;
};
```

## Utility Types

### MaybeGetter

```ts
type Getter<ValueType> = () => ValueType;
type MaybeGetter<ValueType> = ValueType | Getter<ValueType>;

function extract<ValueType>(value: MaybeGetter<ValueType>): ValueType {
  return typeof value === 'function' ? (value as Getter<ValueType>)() : value;
}
```

### Discriminated Unions

```ts
type DialogProps = {
  is_open: boolean;
  on_open_change: (is_open: boolean) => void;
} & (
  | { modal: true; close_on_outside_click?: boolean }
  | { modal?: false; close_on_outside_click?: never }
);
```

### Generic Components

```svelte
<script lang="ts" generics="RowData extends Record<string, unknown>">
  import type { Snippet } from 'svelte';

  let { data, columns, row }: {
    data: RowData[];
    columns: (keyof RowData)[];
    row?: Snippet<[item: RowData, index: number]>;
  } = $props();
</script>

{#each data as item, index}
  {#if row}
    {@render row(item, index)}
  {:else}
    <tr>
      {#each columns as column}
        <td>{String(item[column])}</td>
      {/each}
    </tr>
  {/if}
{/each}
```

## Zod Integration

### Schema Definition

```ts
import { z } from 'zod';

export const create_post_schema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

export type CreatePost = z.infer<typeof create_post_schema>;
```

### Server-Side Validation

```ts
// +page.server.ts
import { fail } from '@sveltejs/kit';
import { create_post_schema } from '$lib/schemas';

export const actions = {
  default: async ({ request }) => {
    const form_data = Object.fromEntries(await request.formData());
    const result = create_post_schema.safeParse(form_data);
    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors, data: form_data });
    }
    await db.posts.create({ data: result.data });
  },
};
```

### Hono Middleware

```ts
import { zValidator } from '@hono/zod-validator';

app.post('/api/posts', zValidator('json', create_post_schema), async (context) => {
  const data = context.req.valid('json');
});
```

## Strict Config

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ESNext"
  }
}
```

## Type-Safe Event Handlers

```svelte
<script lang="ts">
  let { on_select }: { on_select?: (item: Item) => void } = $props();

  function handle_keydown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
    if (event.key === 'Enter') on_select?.(selected_item);
  }
</script>

<input onkeydown={handle_keydown} />
```

## Type-Safe Fetch Wrapper

```ts
async function typed_fetch<ResponseType>(url: string, init?: RequestInit): Promise<ResponseType> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
  return response.json() as Promise<ResponseType>;
}
```

## Branded Types

Enforce nominal typing to prevent swapping structurally identical IDs:

```ts
declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

type UserId = Brand<string, 'UserId'>;
type PostId = Brand<string, 'PostId'>;

function user_id(value: string): UserId { return value as UserId; }
function post_id(value: string): PostId { return value as PostId; }

// ✅ type-safe — cannot swap user and post IDs
function get_user(id: UserId): Promise<User> { /* ... */ }
get_user(user_id('abc'));  // ✅
get_user(post_id('abc'));  // ❌ compile error
```

Place branded type utilities in `$lib/domain/types.ts`. Zero runtime cost — brands are phantom types stripped at compile time.

## Template Literal Types

Enforce valid string patterns at compile time:

```ts
type ApiVersion = 'v1' | 'v2';
type ApiResource = 'users' | 'posts' | 'comments';
type ApiEndpoint = `/api/${ApiVersion}/${ApiResource}`;

function api_fetch(endpoint: ApiEndpoint): Promise<Response> {
  return fetch(endpoint);
}

api_fetch('/api/v1/users');    // ✅
api_fetch('/api/v3/users');    // ❌ compile error
```

Use for API route helpers, event channel names, and route path validation.

## $props.id for Forms

`$props.id()` returns a unique, SSR-hydration-consistent string — see [state-reactivity.md](state-reactivity.md#propsid) for the full component pattern. Key typing note: the returned `id` is `string`, so use it directly in template interpolation (`{id}-input`) — no brand wrapper needed.
