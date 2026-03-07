# Domain - Architecture fit

## Use when

Use when the task touches boundaries between layers, services, modules, teams, or sources of truth.

## Route next

- [domain-state-and-invariants.md](domain-state-and-invariants.md) - to ground the design in truth and transitions
- [domain-dependencies-and-surface-area.md](domain-dependencies-and-surface-area.md) - to contain coupling and blast radius
- [domain-maintainability.md](domain-maintainability.md) - to make the boundary legible in code shape

## Questions

- Does this change reinforce the systems core model or fight it? Examples: single source of truth, event flow, service boundary
- What boundary should own this responsibility? Examples: client, server, worker, shared module
- What coupling are you adding across layers or teams? Examples: shared type leak, circular dependency, implicit timing
- If this pattern spread across the codebase, would you be happy about it? Examples: yes as standard, no as special case
