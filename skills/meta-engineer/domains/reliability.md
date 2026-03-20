# Domain — Reliability

## Use when

The task touches external calls, process lifecycle, resource management, concurrent operations, or failure recovery.

## Route next

- [error-handling.md](error-handling.md) — to design user-facing failure paths
- [observability.md](observability.md) — to make failures visible before they cascade
- [state-and-data.md](state-and-data.md) — to ensure state survives failures and restarts

## Questions

- What happens when external calls fail, time out, or return garbage? (e.g., retry with backoff, fallback, circuit breaker, fail closed)
- If the process crashes mid-operation, what state is left behind? (e.g., partial write, orphaned resource, locked record, corrupted cache)
- Does every resource acquisition have a guaranteed release path? (e.g., finally blocks, cleanup handlers, timeout limits, connection pools)
- What is the blast radius if this code fails? (e.g., one user, one feature, entire service, data corruption, cascading failure)
- Can you distinguish transient failures from permanent ones? (e.g., network blip vs invalid credential, temporary overload vs bad config, retryable vs fatal)
