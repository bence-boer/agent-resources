# Domain — Architecture

## Use when

The task touches boundaries between layers, services, modules, teams, or sources of truth.

## Route next

- [state-and-data.md](state-and-data.md) — to ground the design in truth and transitions
- [dependencies.md](dependencies.md) — to contain coupling and blast radius
- [maintainability.md](maintainability.md) — to make the boundary legible in code shape

## Questions

- Does this change reinforce the system's core model or fight it? (e.g., single source of truth, event flow, service boundary, layer isolation)
- What boundary should own this responsibility? (e.g., client, server, worker, shared module, library)
- What coupling are you adding across layers or teams? (e.g., shared type leak, circular dependency, implicit timing, runtime assumption)
- If this pattern spread across the codebase, would you be happy about it? (e.g., yes as standard, no as special case, needs guardrails)
- How easily can this be ripped out, replaced, or upgraded in the future? (e.g., interface segregation, dependency injection, low coupling, stable contracts)
