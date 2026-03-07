# Design — Before Building the Solution

Design the right solution before investing in building the wrong one.

1. What are at least two fundamentally different approaches, and why is one clearly better? (e.g., polling vs push, server-side vs client-side, new table vs column addition)
2. How does this design interact with every adjacent system or module it touches? (e.g., API contract changes cascading to consumers, schema changes requiring type regeneration)
3. What is the simplest design that fully solves the problem without creating future constraints? (e.g., avoid premature abstraction, but don't hardcode either)
4. What are the failure modes of this design, and does each one have a graceful recovery path? (e.g., network errors, invalid state, partial writes, concurrent access)
5. Does this design make the next person's job easier or harder? (e.g., clear interfaces, obvious extension points, documented trade-offs)
6. What will need to change when requirements evolve, and does this design accommodate that without rewriting? (e.g., new status values, additional user roles, increased scale)
7. Am I introducing a new pattern, or is there an existing pattern I should follow for consistency? (e.g., existing service layer conventions, established component architecture)
