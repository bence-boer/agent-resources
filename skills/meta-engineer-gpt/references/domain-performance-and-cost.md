# Domain - Performance and cost

## Use when

Use when the task affects latency, throughput, query volume, memory, cloud spend, or user-perceived responsiveness.

## Route next

- [domain-observability-and-operations.md](domain-observability-and-operations.md) - to measure reality instead of guessing
- [domain-temporary-solutions.md](domain-temporary-solutions.md) - to refuse opaque speed hacks that create lasting debt
- [domain-maintainability.md](domain-maintainability.md) - to keep optimizations legible

## Questions

- What cost does this change add at steady state? Examples: extra query, heavier payload, more memory, more clicks
- Which path deserves optimization because users feel it or operations pay for it? Examples: hot list view, retry loop, import job
- What data shape, caching, batching, or precomputation choice best matches reality? Examples: small hot set, bursty writes, cold reports
- What would be faster today but expensive to live with later? Examples: hidden cache invalidation, tangled memoization, denormalized sprawl
