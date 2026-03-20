# Domain - Performance

## Use when

The task affects latency, throughput, query volume, memory, cost, or user-perceived responsiveness.

## Route next

- [observability.md](observability.md) to measure reality instead of guessing
- [temporary-solutions.md](temporary-solutions.md) to refuse opaque speed hacks that create lasting debt
- [maintainability.md](maintainability.md) to keep optimizations legible

## Apply

- Measure before optimizing and re-measure after.
- Target the real hot path, repeated cost, or user-visible delay.
- Prefer reducing work, I/O, payload size, or complexity over hidden caches.
- Keep the optimization explainable and observable.
- Reject speedups that create opaque long-term failure modes unless they are clearly worth it.

## Resolve explicitly

- What resource is actually tight?
- What baseline and target metric matter?
- What repeated work can be removed structurally?
- What optimization would age badly?

## Minimum proof

- Evidence of improvement or justified hot-path reasoning
- No new invisible complexity trap in the optimized path
- Failure and recovery behavior remain understandable
