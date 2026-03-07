# Domain - Error handling

## Use when

Use when inputs can be wrong, dependencies can fail, state can drift, or users need a path back from failure.

## Route next

- [domain-risk-and-safety.md](domain-risk-and-safety.md) - if failure can cause real harm
- [domain-observability-and-operations.md](domain-observability-and-operations.md) - to expose actionable signals and breadcrumbs
- [domain-correctness-and-verification.md](domain-correctness-and-verification.md) - to prove failure handling behaves as intended

## Questions

- How should failure look to the person experiencing it? Examples: explicit cause, next step, no blamey tone
- What can fail silently today, and how will you stop that? Examples: dropped write, swallowed exception, stale cache
- What recovery options should exist after each likely failure? Examples: retry, undo, draft preserved, support trail
- Which errors should fail fast, and which should degrade gracefully? Examples: invalid auth, optional analytics, flaky dependency
