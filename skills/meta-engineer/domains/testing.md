# Domain — Testing

## Use when

The task needs proof of correctness, behavior verification, or regression prevention.

## Route next

- [correctness.md](correctness.md) — to map claims to concrete evidence
- [completeness.md](completeness.md) — to catch paths and edge cases you might skip
- [reliability.md](reliability.md) — to verify failure and recovery behavior

## Questions

- What specific proof gives you confidence this works? (e.g., unit tests, integration tests, type safety, manual reproduction, end-to-end verification)
- Are tests verifying actual behavior, or just testing implementation details? (e.g., testing public APIs, focusing on outcomes, not mocking internals)
- What are the bizarre edge cases that "should never happen"? (e.g., negative numbers, extremely long strings, concurrent mutations, missing fields, empty collections)
- If a future developer breaks this logic, will a test fail immediately and clearly? (e.g., descriptive test names, isolated assertions, clear failure messages)
- What negative cases matter more than happy path tests? (e.g., unauthorized access, invalid input, resource exhaustion, timeout, concurrent modification)
