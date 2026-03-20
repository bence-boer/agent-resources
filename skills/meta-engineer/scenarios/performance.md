# Scenario - Performance

## Use when

Users feel slowness, systems saturate, or operators are paying for unnecessary work.

## Route next

- [../domains/performance.md](../domains/performance.md) to choose measurements and tradeoffs that match reality
- [../domains/observability.md](../domains/observability.md) to measure before and after honestly
- [../domains/architecture.md](../domains/architecture.md) to ensure the optimization fits the system model
- [../domains/maintainability.md](../domains/maintainability.md) and [../domains/temporary-solutions.md](../domains/temporary-solutions.md) to avoid brittle speedups

## Default posture

- Prove the bottleneck before optimizing.
- Target the real hot path or repeated cost.
- Prefer structural reductions in work over hidden caches or opaque tricks.
- Keep the optimized path understandable and measurable.

## Resolve explicitly

- What resource is actually tight?
- What metric proves improvement?
- What complexity tradeoff is acceptable?
- What optimization would age badly if left in place?

## Minimum proof

- Before and after measurement, or equivalent evidence for the claimed win
- No unexplained complexity spike in the edited path
- Failure and recovery behavior still sane under the optimized design
