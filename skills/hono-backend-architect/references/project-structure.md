# Project Structure

## Recommended: Vertical Slice Layout

Balances Clean Architecture's separation with practical colocation. Each feature is self-contained.

```
src/
├── app.ts                     # create_app() factory
├── index.ts                   # Entry point (Bun.serve / Deno.serve)
├── env.ts                     # Zod-validated env config
├── lib/
│   ├── types.ts               # AppBindings, AppRouteHandler<Route>
│   ├── create-app.ts          # App factory with middleware
│   ├── configure-open-api.ts  # Swagger/scalar UI setup
│   ├── helpers.ts             # json_content, create_error_schema
│   └── constants.ts           # HTTP codes, shared error schemas
├── middleware/
│   ├── supabase.ts            # supabase_middleware() + auth_guard()
│   ├── error-boundary.ts      # Global onError handler
│   ├── rate-limiter.ts        # Rate limiting factory
│   └── logger.ts              # Pino/custom logger middleware
├── routes/
│   ├── index.route.ts         # Health check / root route
│   ├── expenses/
│   │   ├── expenses.schemas.ts    # Zod schemas + createRoute defs
│   │   ├── expenses.handlers.ts   # Handler implementations
│   │   ├── expenses.index.ts      # Wires routes to handlers
│   │   └── expenses.test.ts       # Integration tests
│   └── auth/
│       ├── auth.schemas.ts
│       ├── auth.handlers.ts
│       ├── auth.index.ts
│       └── auth.test.ts
├── services/                  # Business logic (no HTTP context)
│   ├── expense.service.ts
│   └── auth.service.ts
├── db/
│   ├── index.ts               # DB client (Drizzle/Supabase)
│   ├── schema.ts              # Drizzle schema + insert/select types
│   └── migrations/
└── supabase/
    ├── types.ts               # Generated database types
    └── client.ts              # createServerClient helper
```

## Naming Conventions

| Convention | Example | Used For |
|-----------|---------|----------|
| kebab-case dirs | `error-boundary/` | Directories |
| kebab-case files | `create-app.ts` | Library/middleware files |
| dot-separated files | `expenses.schemas.ts` | Feature-scoped files |
| PascalCase types | `AppBindings`, `ListRoute` | Types, interfaces |
| snake_case exports | `create_app`, `auth_guard` | Functions, variables, methods |
| snake_case schemas | `expense_schema`, `period_schema` | Zod schemas |
| UPPER_SNAKE_CASE | `CONTEXT_KEY` | Constants (Symbol keys, magic values) |

## File Naming Conventions

| File Type | Pattern | Example |
|-----------|---------|---------|
| Route schemas | `<feature>.schemas.ts` | `expenses.schemas.ts` |
| Route handlers | `<feature>.handlers.ts` | `expenses.handlers.ts` |
| Route index | `<feature>.index.ts` | `expenses.index.ts` |
| Tests | `<feature>.test.ts` | `expenses.test.ts` |
| Middleware | `<concern>.ts` | `supabase.ts`, `rate-limiter.ts` |
| Services | `<feature>.service.ts` | `expense.service.ts` |

## Route Wiring Pattern

Each feature's `index.ts` wires route definitions to handlers:

```ts
// routes/expenses/expenses.index.ts
import { create_router } from '@/lib/create-app.js';

import * as handlers from './expenses.handlers.js';
import * as routes from './expenses.schemas.js';

const router = create_router()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.get_one, handlers.get_one)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export { router as expense_router };
```

Top-level `app.ts` composes all feature routers:

```ts
// app.ts
import { create_app } from '@/lib/create-app.js';

import { auth_router } from '@/routes/auth/auth.index.js';
import { expense_router } from '@/routes/expenses/expenses.index.js';
import { index_router } from '@/routes/index.route.js';

const app = create_app()
  .route('/', index_router)
  .route('/', expense_router)
  .route('/', auth_router);

export type AppType = typeof app;
```

Routes MUST be chained (`.route().route()`) on a single instance for type inference. Separate `app.route()` calls lose type info.

## Barrel Exports

Every feature module exports via its index file with named exports only:

```ts
// routes/expenses/expenses.index.ts
export { expense_router } from './expenses.router.js';
export { expense_schema, insert_expense_schema, type Expense } from './expenses.schemas.js';
```

Never use default exports — always named:

```ts
// ❌
export default router;

// ✅
export { router as expense_router };
```

## When Clean Architecture Adds Noise

Full Clean Architecture (adapters/application/domain/infrastructure) is overkill for most Hono APIs. Use it only when:
- Multiple delivery mechanisms exist (HTTP + gRPC + CLI)
- Domain logic is complex enough to justify use case classes
- Team size demands strict boundary enforcement

For typical Hono + Supabase apps, the vertical slice layout above provides sufficient separation without the indirection overhead.
