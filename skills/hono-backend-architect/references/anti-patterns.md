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

### Manual JWT Decoding → `getUser()`

```ts
// ❌ — bypasses signature verification, trivially forgeable
const base64 = auth_token.split('-')[1];
const session = JSON.parse(atob(base64));

// ✅ — validates JWT signature server-side
const { data: { user }, error } = await context.var.supabase.auth.getUser();
if (error || !user) return context.json({ message: 'Unauthorized' }, 401);
```

### Non-Null Assertions on User → Auth Guard Middleware

```ts
// ❌ — crashes with TypeError if session is null
const user_id = session(context)!.user.id;

// ✅ — auth_guard guarantees user exists on context
const user_id = context.var.user.id;
```

### Raw Error Forwarding → Sanitized Errors

```ts
// ❌ — leaks table names, RLS details, internal structure
throw new HTTPException(500, { message: 'Failed', cause: supabase_error });

// ✅ — log server-side, return sanitized message
context.var.logger.error({ error: supabase_error }, 'Failed to fetch expenses');
throw new HTTPException(500, { message: 'Failed to fetch expenses' });
```

### Module-Level Supabase Client → Per-Request Injection

```ts
// ❌ — shares state across requests, breaks cookie-based auth
const supabase = createServerClient(url, key);

app.get('/items', async (context) => {
  const { data } = await supabase.from('items').select();
});

// ✅ — fresh client per request with cookie forwarding
const supabase_middleware = (): MiddlewareHandler => {
  return async (context, next) => {
    const client = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      cookies: { /* cookie handlers from request */ },
    });
    context.set('supabase', client);
    await next();
  };
};
```

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
const config = { port: 8000, host: 'localhost' } satisfies ServerConfig;
```

### Duplicated Types → Zod Inference

```ts
// ❌ — types drift from validation
const expense_schema = z.object({ amount: z.number(), description: z.string() });
interface Expense { amount: number; description: string; }

// ✅ — single source of truth
const expense_schema = z.object({ amount: z.number(), description: z.string() });
type Expense = z.infer<typeof expense_schema>;
```

### Inline Validation → Edge Validation via Route Schemas

```ts
// ❌ — validation mixed into handler
export const create = async (context: Context) => {
  const body = await context.req.json();
  if (!body.amount || typeof body.amount !== 'number') {
    return context.json({ error: 'Invalid amount' }, 400);
  }
  // ... business logic
};

// ✅ — Zod validates at route definition, handler receives typed data
export const create_route = createRoute({
  method: 'post',
  path: '/expenses',
  request: { body: json_content_required(insert_expense_schema, 'New expense') },
  responses: { ... },
});

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const expense = context.req.valid('json'); // Already validated and typed
  // ... business logic
};
```
