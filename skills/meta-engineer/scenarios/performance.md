# Scenario — Performance

## Use when

Users feel slowness, systems saturate, costs rise, or operators are paying for unnecessary work.

## Route next

- [../domains/performance.md](../domains/performance.md) — to pick measurements and tradeoffs that match reality
- [../domains/observability.md](../domains/observability.md) — to measure the before and after honestly
- [../domains/architecture.md](../domains/architecture.md) — to ensure the optimization fits the system model
- [../domains/maintainability.md](../domains/maintainability.md) — to keep the optimization readable and changeable
- [../domains/temporary-solutions.md](../domains/temporary-solutions.md) — to refuse brittle speedups that age badly

## Questions

- What resource is actually tight? (e.g., CPU, memory, query count, human attention, bandwidth, disk)
- What user or operational pain does that constraint create today? (e.g., slow page, queue buildup, alert noise, high cost)
- How will you measure improvement without fooling yourself? (e.g., percentile latency, throughput, error rate, before/after comparison)
- What optimization would hurt clarity or resilience more than it helps? (e.g., hidden cache, brittle batching, premature tuning, opaque hack)
