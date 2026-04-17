# TypeScript Patterns

## AppBindings & Type-Safe Context

Define a single `AppBindings` interface for all typed context variables:

```ts
// lib/types.ts
import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Logger } from 'pino';

export interface AppBindings {
  Variables: {
    supabase: SupabaseClient;
    user: User;
    logger: Logger;
    request_id: string;
  };
}

export type AppRouteHandler<RouteType extends RouteConfig> = RouteHandler<RouteType, AppBindings>;

export type AppOpenAPI = OpenAPIHono<AppBindings>;
```

Usage in handlers — context variables are fully typed:

```ts
export const list: AppRouteHandler<ListRoute> = async (context) => {
  const user = context.var.user;         // Typed as User
  const supabase = context.var.supabase; // Typed as SupabaseClient
};
```

## Zod Schema Patterns

### Schema as Single Source of Truth

Define schemas once, derive types and OpenAPI docs from them:

```ts
// routes/expenses/expenses.schemas.ts
import { z } from 'zod';

export const expense_schema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string().min(1).max(500),
  category: z.string(),
  date: z.string().date(),
  created_at: z.string().datetime(),
});

export type Expense = z.infer<typeof expense_schema>;

export const insert_expense_schema = expense_schema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export type InsertExpense = z.infer<typeof insert_expense_schema>;

export const update_expense_schema = insert_expense_schema.partial();

export type UpdateExpense = z.infer<typeof update_expense_schema>;
```

### Schema Composition

```ts
// Pagination shared across features
export const pagination_schema = z.object({
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationParams = z.infer<typeof pagination_schema>;

// Date range filtering
export const date_range_schema = z.object({
  start_date: z.string().date(),
  end_date: z.string().date(),
});

// Combined for a specific route
export const expense_list_query_schema = pagination_schema.merge(date_range_schema);
```

### OpenAPI Helper Utilities

```ts
// lib/helpers.ts
import { z } from 'zod';

export function json_content<SchemaType extends z.ZodType>(
  schema: SchemaType,
  description: string,
) {
  return {
    content: { 'application/json': { schema } },
    description,
  };
}

export function json_content_required<SchemaType extends z.ZodType>(
  schema: SchemaType,
  description: string,
) {
  return {
    ...json_content(schema, description),
    required: true,
  };
}

export function create_error_schema<SchemaType extends z.ZodType>(schema: SchemaType) {
  return z.object({
    success: z.literal(false),
    error: z.object({
      issues: z.array(z.object({
        code: z.string(),
        path: z.array(z.union([z.string(), z.number()])),
        message: z.string().optional(),
      })),
      name: z.string(),
    }),
  });
}
```

## Discriminated Union Error Types

```ts
const enum ServiceErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN',
  VALIDATION = 'VALIDATION',
}

type ServiceResult<DataType> =
  | { success: true; data: DataType }
  | { success: false; error: string; code: ServiceErrorCode };

// Usage in a service
async function get_expense(
  supabase: SupabaseClient,
  expense_id: string,
  user_id: string,
): Promise<ServiceResult<Expense>> {
  const { data, error } = await supabase
    .from('expenses')
    .select()
    .eq('id', expense_id)
    .single();

  if (error) return { success: false, error: 'Expense not found', code: ServiceErrorCode.NOT_FOUND };
  if (data.user_id !== user_id) return { success: false, error: 'Forbidden', code: ServiceErrorCode.FORBIDDEN };
  return { success: true, data };
}

// Usage in a handler — exhaustive pattern matching
export const get_one: AppRouteHandler<GetOneRoute> = async (context) => {
  const result = await get_expense(
    context.var.supabase, context.req.param('id'), context.var.user.id,
  );

  if (!result.success) {
    const status_map = {
      [ServiceErrorCode.NOT_FOUND]: 404,
      [ServiceErrorCode.FORBIDDEN]: 403,
      [ServiceErrorCode.VALIDATION]: 422,
    } as const satisfies Record<ServiceErrorCode, number>;
    throw new HTTPException(status_map[result.code], { message: result.error });
  }

  return context.json(result.data);
};
```

## Generic Patterns with Descriptive Names

Never use single-letter generics. Use descriptive names that communicate intent:

```ts
// ❌
function parse_response<T>(response: Response): Promise<T> { ... }
type Result<T, E> = { data: T } | { error: E };

// ✅
function parse_response<ResponseBodyType>(response: Response): Promise<ResponseBodyType> { ... }
type Result<DataType, ErrorType> = { data: DataType } | { error: ErrorType };
```

```ts
// ❌
async function paginate<T>(query: PostgrestFilterBuilder<T>, params: PaginationParams) { ... }

// ✅
async function paginate<RowType>(
  query: PostgrestFilterBuilder<RowType>,
  params: PaginationParams,
): Promise<PaginatedResult<RowType>> { ... }
```

## Strict TypeScript Config

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ESNext",
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## End-to-End Type Safety (Hono RPC)

Chain routes on a single app instance for type inference, then export the type:

```ts
// src/app.ts
const app = create_app()
  .route('/', expense_router)
  .route('/', auth_router);

export type AppType = typeof app;
```

Frontend consumes the type via Hono's RPC client:

```ts
// frontend/lib/api.ts
import { hc } from 'hono/client';
import type { AppType } from '@backend/app';

export const api_client = hc<AppType>('/');

// Fully typed — autocomplete on route paths, request bodies, and response types
const response = await api_client.api.expenses.$get({
  query: { start_date: '2024-01-01', end_date: '2024-12-31' },
});
const expenses = await response.json(); // Typed as Expense[]
```

## Type-Safe Fetch Wrapper

For inter-service HTTP calls without Hono RPC:

```ts
async function typed_fetch<ResponseBodyType>(
  url: string,
  init?: RequestInit,
): Promise<ResponseBodyType> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
  return response.json() as Promise<ResponseBodyType>;
}
```
