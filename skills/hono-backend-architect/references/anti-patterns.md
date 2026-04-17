# Anti-Patterns

## Naming & Style

### camelCase → snake_case

```ts
// ❌
const authGuard = (): MiddlewareHandler => { ... };
const supabaseMiddleware = (): MiddlewareHandler => { ... };
function createApp() { ... }
const errorBoundary: ErrorHandler = (err, c) => { ... };

// ✅
const auth_guard = (): MiddlewareHandler => { ... };
const supabase_middleware = (): MiddlewareHandler => { ... };
function create_app() { ... }
const error_boundary: ErrorHandler = (error, context) => { ... };
```

Library imports retain their original casing (`createRoute`, `HTTPException`, `OpenAPIHono`).

### Single-Letter Variables → Descriptive Names

```ts
// ❌
app.get('/items', async (c) => {
  const q = c.req.query('q');
  const r = await db.select().from(items).where(like(items.name, `%${q}%`));
  return c.json(r);
});

// ✅
app.get('/items', async (context) => {
  const search_query = context.req.query('q');
  const matching_items = await db
    .select().from(items).where(like(items.name, `%${search_query}%`));
  return context.json(matching_items);
});
```

### Single-Letter Generics → Descriptive Names

```ts
// ❌
function paginate<T>(items: T[], page: number): T[] { ... }
type Result<T, E> = { data: T } | { error: E };

// ✅
function paginate<ItemType>(items: ItemType[], page: number): ItemType[] { ... }
type Result<DataType, ErrorType> = { data: DataType } | { error: ErrorType };
```

### Default Exports → Named Exports

```ts
// ❌
export default router;
import expenseRouter from './expenses';

// ✅
export { router as expense_router };
import { expense_router } from './expenses/expenses.index.js';
```

### Unsorted Imports → Alphabetical by Module Path

```ts
// ❌
import { z } from 'zod';
import { createRoute } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import type { AppRouteHandler } from '@/lib/types.js';

// ✅
import { createRoute } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { AppRouteHandler } from '@/lib/types.js';
```

Group: external packages first (alphabetical), then internal imports (alphabetical), separated by a blank line.

## Security

Security anti-patterns with full BAD/GOOD examples are in [security-patterns.md](../security-patterns.md). Key violations: manual JWT decoding, raw error forwarding, module-level Supabase client, non-null assertions on user.

## Code Style

### Nested Conditionals → Guard Clauses

```ts
// ❌
export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const body = context.req.valid('json');
  if (body) {
    const { data, error } = await context.var.supabase
      .from('expenses').insert(body).select().single();
    if (!error) {
      return context.json(data, 201);
    } else {
      throw new HTTPException(500, { message: 'Failed to create expense' });
    }
  }
};

// ✅
export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const body = context.req.valid('json');
  if (!body) throw new HTTPException(422, { message: 'Invalid request body' });

  const { data, error } = await context.var.supabase
    .from('expenses').insert(body).select().single();

  if (error) throw new HTTPException(500, { message: 'Failed to create expense' });
  return context.json(data, 201);
};
```

### Unnecessary Intermediate Variables → Inline

```ts
// ❌
const supabase_result = await context.var.supabase.from('expenses').select();
const expenses = supabase_result.data;
const fetch_error = supabase_result.error;

// ✅
const { data: expenses, error } = await context.var.supabase.from('expenses').select();
```

### Inline Type Assertions → Proper Types

```ts
// ❌
const config = {
  port: 8000 as const,
  host: 'localhost' as const,
};

// ✅
const config = { port: 8000, host: 'localhost' } as const satisfies ServerConfig;
```

Type inference and edge validation patterns with full BAD/GOOD examples are in [typescript-patterns.md](../typescript-patterns.md). Key rules: infer types from Zod schemas with `z.infer<>`, validate at route definition not in handlers.
