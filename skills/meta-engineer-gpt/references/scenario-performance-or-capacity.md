# Scenario - Performance or capacity

## Use when

Use when users feel slowness, systems saturate, costs rise, or operators are paying for unnecessary work.

## Route next

- [domain-performance-and-cost.md](domain-performance-and-cost.md) - to pick measurements and tradeoffs that match reality
- [domain-observability-and-operations.md](domain-observability-and-operations.md) - to measure the before and after honestly
- [domain-maintainability.md](domain-maintainability.md) - to keep the optimization readable and changeable
- [domain-temporary-solutions.md](domain-temporary-solutions.md) - to refuse brittle speedups that age badly

## Questions

- What resource is actually tight? Examples: CPU, memory, query count, human attention
- What user or operational pain does that constraint create today? Examples: slow page, queue buildup, alert noise
- How will you measure improvement without fooling yourself? Examples: percentile latency, throughput, error rate
- What optimization would hurt clarity or resilience more than it helps? Examples: hidden cache, brittle batching, premature tuning
