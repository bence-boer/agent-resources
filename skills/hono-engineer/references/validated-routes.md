# Validated Routes

Use this when validating JSON, form, query, param, header, or cookie input, especially with Zod or Standard Schema validators.

## Owned surface

This file owns validator targets, `c.req.valid()`, manual `validator()`, Zod Validator, Standard Schema Validator, multiple validators, and validation-specific test caveats. RPC client consumption belongs in `rpc-client.md`.

## Validator targets

| Target | Use for | Critical caveat |
|---|---|---|
| `json` | JSON request body | Request/test must send `Content-Type: application/json`. |
| `form` | URL-encoded or multipart form fields | Request/test must send matching form content type. |
| `query` | URL query string | Values arrive as strings; use coercion. |
| `param` | Path params | Values arrive as strings. |
| `header` | Request headers | Keys in validator value must be lowercase. |
| `cookie` | Cookie values | Prefer signed cookies for integrity-sensitive values. |

## Manual validator

```ts
import { validator } from 'hono/validator'

app.post(
  '/posts',
  validator('json', (value, c) => {
    if (typeof value.title !== 'string') {
      return c.json({ error: 'title is required' }, 400)
    }
    return { title: value.title }
  }),
  (c) => {
    const body = c.req.valid('json')
    return c.json({ title: body.title }, 201)
  }
)
```

## Zod Validator

```ts
import { zValidator } from '@hono/zod-validator'
import * as z from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1),
  published: z.coerce.boolean().optional(),
})

const route = app.post(
  '/posts',
  zValidator('json', createPostSchema),
  (c) => {
    const body = c.req.valid('json')
    return c.json({ post: body }, 201)
  }
)
```

## Standard Schema Validator

Use `@hono/standard-validator` when the project standardizes on a Standard Schema-compatible library such as Zod, Valibot, or ArkType. Keep Hono integration in route code; keep schema design in the chosen validation library's conventions.

## Multiple validators

```ts
app.post(
  '/posts/:id',
  zValidator('param', z.object({ id: z.string() })),
  zValidator('query', z.object({
    preview: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
  })),
  zValidator('json', createPostSchema),
  (c) => {
    const { id } = c.req.valid('param')
    const query = c.req.valid('query')
    const body = c.req.valid('json')
    return c.json({ id, query, body }, 200)
  }
)
```

## Anti-patterns

- **Empty validated body:** add the correct `Content-Type` in clients and tests.
- **Uppercase header keys:** use `value['idempotency-key']`, not `value['Idempotency-Key']`.
- **String numeric query:** use `z.coerce.number()` or explicit parsing.
- **Inconsistent invalid shape:** define a consistent validation error body before integrating RPC.
- **Validation-doc split:** do not duplicate schemas separately for OpenAPI; choose an OpenAPI-capable schema path when docs are required.

## Template

Use [validated-route.ts](../assets/templates/validated-route.ts) for a route-level validator and [rpc-server-client.ts](../assets/templates/rpc-server-client.ts) when the validated route must feed a typed client.
