# Domain — Extensibility

## Use when

The task might soon gain more roles, states, variants, channels, regions, or product options.

## Route next

- [maintainability.md](maintainability.md) — to keep the extension path readable instead of clever
- [architecture.md](architecture.md) — to place the extension seam in the right boundary
- [state-and-data.md](state-and-data.md) — to ensure new variants do not violate core rules

## Questions

- If one more variant, role, region, or workflow arrives next month, what changes? (e.g., config only, one switch, one contract, new migration)
- What is the extension seam here? (e.g., interface, adapter, hook, schema field, config entry, plugin point)
- What assumption will block the next legitimate requirement? (e.g., single status, one tenant, fixed ordering, hardcoded limit)
- Are you encoding policy in the wrong layer? (e.g., UI-only rule, hardcoded mapping, buried fallback, inline constant)
