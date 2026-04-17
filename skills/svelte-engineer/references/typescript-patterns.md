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
  BasePropsType extends HTMLAttributes<HTMLElement>,
  ElementType extends HTMLElement = HTMLElement,
> = BasePropsType & { ref?: ElementType | null };
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

### Rest-Prop Index Signature

Enabling `...rest_props` spread to native elements requires an index signature on the Props interface:

```svelte
<script lang="ts">
  import type { HTMLDivAttributes } from 'svelte/elements';

  enum BadgeVariant {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
  }

  interface Props extends HTMLDivAttributes {
    label: string;
    variant?: BadgeVariant;
    // HTMLDivAttributes includes [key: string]: unknown implicitly via svelte/elements
  }

  let { label, variant = BadgeVariant.PRIMARY, ...rest_props }: Props = $props();
</script>

<div data-variant={variant} {...rest_props}>
  {label}
</div>
```

When not extending `HTMLXxxAttributes`, add the index signature explicitly:

```ts
interface Props {
  label: string;
  variant?: string;
  [key: string]: unknown; // required for ...rest_props spread
}
```

With `noUncheckedIndexedAccess: true` in tsconfig, `rest_props['dynamic-key']` is `unknown | undefined` — narrow before use.

## Utility Types

### MaybeGetter

```ts
type Getter<ValueType> = () => ValueType;
type MaybeGetter<ValueType> = ValueType | Getter<ValueType>;

function extract<ValueType>(value: MaybeGetter<ValueType>): ValueType {
  // TypeScript cannot narrow `T | (() => T)` based on `typeof === 'function'`
  // because T itself could be a function type, making the check ambiguous.
  // This is a documented compiler limitation — the cast is sound given MaybeGetter's intent.
  if (typeof value !== 'function') return value as ValueType;
  return (value as Getter<ValueType>)();
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
<script lang="ts" generics="RowDataType extends Record<string, unknown>">
  import type { Snippet } from 'svelte';

  let { data, columns, row }: {
    data: RowDataType[];
    columns: (keyof RowDataType)[];
    row?: Snippet<[item: RowDataType, index: number]>;
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
  interface Props { on_select?: (item: Item) => void }
  let { on_select }: Props = $props();

  type InputKeyboardEventType = KeyboardEvent & { currentTarget: HTMLInputElement };
  function handle_keydown(event: InputKeyboardEventType) {
    if (event.key === 'Enter') on_select?.(selected_item);
  }
</script>

<input onkeydown={handle_keydown} />
```

## Type-Safe Fetch Wrapper

For Hono-typed clients, use `hc<AppType>()` (shown above) — no cast needed. For non-Hono APIs, use runtime validation to avoid the `as T` cast:

```ts
import * as valibot from 'valibot';

async function validated_fetch<SchemaType extends valibot.BaseSchema<unknown, unknown, valibot.BaseIssue<unknown>>>(
  url: string,
  schema: SchemaType,
  init?: RequestInit
): Promise<valibot.InferOutput<SchemaType>> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
  return valibot.parse(schema, await response.json());
}

// Usage — return type is inferred from schema, zero casts
const todo = await validated_fetch('/api/todos/1', todo_schema);
```

## `as const satisfies T` — Universal Mandate

ALL compile-time constant object and array literals must use `as const satisfies SpecificType`. This gives literal types AND structural validation simultaneously. Neither `as const` alone nor `satisfies` alone is sufficient — both are required together.

```ts
import type { Component } from 'svelte';
import Dashboard from './Dashboard.svelte';
import Settings from './Settings.svelte';

interface RouteConfig {
  readonly path: string;
  readonly component: Component<any>;
  readonly requires_auth: boolean;
}

const ROUTES = {
  DASHBOARD: { path: '/dashboard', component: Dashboard, requires_auth: true },
  SETTINGS: { path: '/settings', component: Settings, requires_auth: true },
} as const satisfies Record<string, RouteConfig>;

// Literal type — path is '/dashboard' | '/settings', not just string
type RoutePath = typeof ROUTES[keyof typeof ROUTES]['path'];

// Generic lookup preserves literal types — no cast needed
function get_route<RouteKeyType extends keyof typeof ROUTES>(key: RouteKeyType): typeof ROUTES[RouteKeyType] {
  return ROUTES[key];
}
```

Also works for variant/icon/label maps:

```ts
const ALERT_CONFIG = {
  success: { icon: CheckIcon, class: 'text-green-600' },
  error:   { icon: XIcon,     class: 'text-red-600'   },
  warning: { icon: AlertIcon, class: 'text-amber-600' },
} as const satisfies Record<string, { icon: typeof CheckIcon; class: string }>;
```

## Switch Exhaustiveness

When branching on an enum or closed string domain with three or more cases, use `switch` with a `default` that asserts the remaining value is `never`. TypeScript reports a compile error if any enum member is unhandled.

```ts
enum AlertKind {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

function get_alert_class(kind: AlertKind) {
  switch (kind) {
    case AlertKind.SUCCESS: return 'text-green-600';
    case AlertKind.ERROR:   return 'text-red-600';
    case AlertKind.WARNING: return 'text-amber-600';
    default: throw new Error(`Unhandled AlertKind: ${kind satisfies never}`);
  }
}
```

For simple value → value mappings with no logic, prefer an `as const satisfies` lookup object over a `switch`:

```ts
const ALERT_CLASS = {
  [AlertKind.SUCCESS]: 'text-green-600',
  [AlertKind.ERROR]:   'text-red-600',
  [AlertKind.WARNING]: 'text-amber-600',
} as const satisfies Record<AlertKind, string>;
```

## Promise Chains over try/catch

Do not wrap `await` in `try { } catch { }`. Use `.then().catch()` for async error handling. The `async` keyword is still permitted; only the `try/catch` wrapper around `await` is forbidden.

```ts
// ❌ try/catch wrapping await
async function load_user(id: string): Promise<void> {
  try {
    const user = await fetch_user(id);
    this.current_user = user;
  } catch (error) {
    this.error = error instanceof Error ? error.message : 'Failed';
  }
}

// ✅ promise chain
function load_user(id: string): Promise<void> {
  return fetch_user(id)
    .then((user) => { this.current_user = user; })
    .catch((error: unknown) => {
      this.error = error instanceof Error ? error.message : 'Failed';
    });
}
```

## Branded Types

Enforce nominal typing to prevent swapping structurally identical IDs:

```ts
declare const __brand: unique symbol;
type Brand<BaseType, BrandTagType extends string> = BaseType & { readonly [__brand]: BrandTagType };

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

## SubmitFunction

For the typed `SubmitFunction` pattern (generic `use:enhance` callback with pre/post submit hooks), see [sveltekit-patterns.md](sveltekit-patterns.md#4-form-actions).
