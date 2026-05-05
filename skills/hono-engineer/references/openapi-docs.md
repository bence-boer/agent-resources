# OpenAPI Docs

Use this when generating OpenAPI, Swagger, or Scalar documentation for a Hono API.

## Owned surface

This file owns the Hono-side architecture for API documentation and the package-selection boundary. The source Hono docs list ecosystem packages but do not define one canonical OpenAPI implementation API, so exact package syntax must be verified against the selected package.

## Decision path

1. Define request and response schemas close to the route.
2. Reuse schemas for runtime validation where the selected package supports it.
3. Return explicit JSON statuses so response variants are documentable.
4. Serve a machine-readable spec route such as `/openapi.json`.
5. Serve a UI route with the chosen UI package, such as Scalar or Swagger UI.

## Ecosystem options named by Hono docs

| Need | Candidate |
|---|---|
| Zod to OpenAPI schemas | Zod OpenAPI |
| OpenAPI UI | Scalar, Swagger UI |
| OpenAPI editor | Swagger Editor |
| Hono route integration | Hono OpenAPI, hono-zod-openapi |

## Safe implementation stance

Use package-specific docs before writing exact code. Do not infer APIs from package names. A safe skeleton should mark these as placeholders:

```ts
// Pseudocode: verify exact API against the chosen OpenAPI package.
const route = app.openapi(createRoute({
  method: 'get',
  path: '/posts',
  responses: {
    200: { description: 'Posts', content: { 'application/json': { schema: postsSchema } } },
  },
}), (c) => c.json({ posts: [] }, 200))
```

## Integration rules

- Do not duplicate validation and documentation schemas unless the chosen package cannot share them.
- Define error response shapes deliberately; undocumented errors produce misleading client docs.
- Keep docs routes public only when that is an explicit product decision.
- If using auth, document security schemes and protected routes consistently.

## Anti-patterns

- **Core Hono OpenAPI assumption:** Hono core does not itself define a complete OpenAPI authoring API in the provided docs.
- **Schema drift:** separate validation and documentation schemas diverge.
- **Implicit response docs:** route returns multiple statuses but docs list only 200.
- **Package API invention:** verify exact imports and calls for the selected package.

## Template

Use [openapi-app.ts](../assets/templates/openapi-app.ts).
