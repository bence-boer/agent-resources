# Domain — Performance

## Use when

The task affects latency, throughput, query volume, memory, cost, or user-perceived responsiveness.

## Route next

- [observability.md](observability.md) — to measure reality instead of guessing
- [temporary-solutions.md](temporary-solutions.md) — to refuse opaque speed hacks that create lasting debt
- [maintainability.md](maintainability.md) — to keep optimizations legible

## Questions

- What cost does this change add at steady state? (e.g., extra query, heavier payload, more memory, more clicks, longer render)
- Is there hidden computational complexity being introduced? (e.g., nested loops leading to O(n²), redundant API calls, unoptimized queries, missing pagination)
- Which path deserves optimization because users feel it or operations pay for it? (e.g., hot list view, retry loop, import job, initial page load)
- Am I holding resources longer than necessary? (e.g., missing cleanup, dangling listeners, unclosed connections, large buffers, retained references)
- What would be faster today but expensive to live with later? (e.g., hidden cache invalidation, tangled memoization, denormalized sprawl, opaque batching)
