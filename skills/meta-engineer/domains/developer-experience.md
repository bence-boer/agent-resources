# Domain — Developer experience

## Use when

The change affects how engineers discover, modify, verify, or reason about the system.

## Route next

- [maintainability.md](maintainability.md) — to turn local clarity into lasting structure
- [dependencies.md](dependencies.md) — to remove unnecessary moving parts
- [../finish/handoff.md](../finish/handoff.md) — to capture knowledge the next person would otherwise rediscover

## Questions

- What part of this change will be annoying to revisit unless you improve it now? (e.g., unclear setup, duplicated logic, hidden rules, missing types)
- How can you make the correct path the easy path for the next engineer? (e.g., narrow API, better types, sensible defaults, clear naming)
- What knowledge is currently trapped in your head? (e.g., ordering rule, rollout caveat, invariant, non-obvious edge case)
- What would make debugging or extension slower than it needs to be? (e.g., mixed concerns, magic values, scattered state, implicit dependencies)
- Does the tooling catch mistakes immediately before they become problems? (e.g., strict typing, fast feedback loops, pre-commit hooks, linting)
