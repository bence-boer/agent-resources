# Domain — Error handling

## Use when

Inputs can be wrong, dependencies can fail, state can drift, or users need a path back from failure.

## Route next

- [security.md](security.md) — if failure can cause real harm
- [observability.md](observability.md) — to expose actionable signals and breadcrumbs
- [correctness.md](correctness.md) — to prove failure handling behaves as intended

## Questions

- How should failure look to the person experiencing it? (e.g., explicit cause, next step, no technical jargon, no blame)
- What can fail silently today, and how will you stop that? (e.g., dropped write, swallowed exception, stale cache, ignored error return)
- What recovery options should exist after each likely failure? (e.g., retry, undo, draft preserved, support trail, graceful fallback)
- Which errors should fail fast, and which should degrade gracefully? (e.g., invalid auth fails fast, optional analytics degrades, flaky dependency retries)
- Does the system recover automatically from transient failures? (e.g., circuit breakers, exponential backoff, state reconciliation, reconnection)
