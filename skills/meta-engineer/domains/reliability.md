# Domain - Reliability

## Use when

The task touches external calls, process lifecycle, resource management, concurrent operations, or failure recovery.

## Route next

- [error-handling.md](error-handling.md) to design user-facing failure paths
- [observability.md](observability.md) to make failures visible before they cascade
- [state-and-data.md](state-and-data.md) to ensure state survives failures and restarts

## Apply

- Design for retries, restarts, duplicates, timeouts, and partial completion.
- Make writes idempotent or explicitly guarded where repeated delivery is possible.
- Release resources deterministically.
- Limit blast radius and define safe defaults.
- Distinguish retryable from terminal failure.

## Resolve explicitly

- What happens if the process dies mid-operation?
- What is left behind on partial failure?
- What is retryable versus terminal?
- How is blast radius contained?

## Minimum proof

- Representative retry, restart, or timeout path is addressed
- Recovery behavior is explicit rather than implied
- Resource cleanup and partial-state handling are credible
