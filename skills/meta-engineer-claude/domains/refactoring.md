# Refactoring — Restructuring Existing Code

Refactoring should improve the code without changing behavior. Verify both.

→ Also read: [maintainability](../qualities/maintainability.md), [developer-experience](../qualities/developer-experience.md)

1. What specific problem am I solving by refactoring, and how will I measure that it's been solved? (e.g., reduced duplication, clearer boundaries, lower cognitive load)
2. Do I have sufficient verification to prove behavior is unchanged? (e.g., existing test coverage, type safety, manual flow testing)
3. Am I refactoring in small, individually verifiable steps, or making one big risky change? (e.g., extract → move → rename → inline, each independently committable)
4. Have I searched the entire codebase for all instances of the pattern I'm changing? (e.g., similar code in other modules, references, imports, configs)
5. Does this refactoring leave a clearer, more consistent codebase — or just a differently structured one? (e.g., aligns with existing patterns, reduces exceptions, improves discoverability)
