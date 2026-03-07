# Domain - Developer experience

## Use when

Use when the change affects how engineers discover, modify, verify, or reason about the system.

## Route next

- [domain-maintainability.md](domain-maintainability.md) - to turn local clarity into lasting structure
- [domain-dependencies-and-surface-area.md](domain-dependencies-and-surface-area.md) - to remove unnecessary moving parts
- [finish-handoff.md](finish-handoff.md) - to capture the knowledge the next person would otherwise have to rediscover

## Questions

- What part of this change will be annoying to revisit unless you improve it now? Examples: unclear setup, duplicated logic, hidden rules
- How can you make the correct path the easy path for the next engineer? Examples: narrow API, better types, sensible defaults
- What knowledge is currently trapped in your head? Examples: ordering rule, rollout caveat, invariant
- What would make debugging or extension slower than it needs to be? Examples: mixed concerns, magic values, scattered state
