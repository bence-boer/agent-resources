# Domain - Error handling

## Use when

Inputs can be wrong, dependencies can fail, state can drift, or users need a path back from failure.

## Route next

- [security.md](security.md) if failure can cause real harm
- [observability.md](observability.md) to expose actionable signals and breadcrumbs
- [correctness.md](correctness.md) to prove failure handling behaves as intended

## Apply

- Classify failures: invalid input, permission, not found, transient dependency, concurrency, internal bug.
- Fail closed for unsafe operations and fail loudly for invariant violations.
- Preserve recoverability when possible: retry, resume, draft, idempotency, or clear next action.
- Never swallow errors or return success-shaped lies.
- Keep user-facing messages actionable without leaking sensitive internals.

## Resolve explicitly

- Which failures should block, retry, degrade, or crash?
- What state must survive a failure?
- What should the user or operator do next?
- What errors must be surfaced immediately?

## Minimum proof

- Representative failure-path tests
- Explicit error propagation instead of silent fallback
- Signals sufficient to diagnose the failure class
