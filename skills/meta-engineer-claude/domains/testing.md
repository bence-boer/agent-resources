# Testing — Verifying Correctness Systematically

Tests are executable documentation. They prove what the code does, not what you hope it does.

→ Also read: [reliability](../qualities/reliability.md), [maintainability](../qualities/maintainability.md)

1. Am I testing behavior and outcomes, or implementation details? (e.g., test the API response, not the internal function calls)
2. Do my tests cover the unhappy paths — errors, edge cases, and boundary conditions? (e.g., invalid input, unauthorized access, empty data, concurrent operations)
3. Are my tests independent, deterministic, and fast? (e.g., no shared state between tests, no timing dependencies, no external service calls)
4. Does each test make exactly one assertion about one behavior? (e.g., separate tests for validation, authorization, business logic, response shape)
5. If this test fails, does the test name and output immediately tell me what's broken? (e.g., descriptive names, clear assertions, meaningful error messages)
6. Am I testing at the right level of abstraction? (e.g., unit for logic, integration for boundaries, E2E for critical paths — not everything at one level)
