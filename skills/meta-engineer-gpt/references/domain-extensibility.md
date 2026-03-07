# Domain - Extensibility

## Use when

Use when the task might soon gain more roles, states, variants, channels, regions, or product options.

## Route next

- [domain-maintainability.md](domain-maintainability.md) - to keep the extension path readable instead of clever
- [domain-architecture-fit.md](domain-architecture-fit.md) - to place the extension seam in the right boundary
- [domain-state-and-invariants.md](domain-state-and-invariants.md) - to ensure new variants do not violate core rules

## Questions

- If one more variant, role, region, or workflow arrives next month, what changes? Examples: config only, one switch, one contract
- What is the extension seam here? Examples: interface, adapter, hook, schema field
- What assumption will block the next legitimate requirement? Examples: one status only, single tenant, fixed ordering
- Are you encoding policy in the wrong layer? Examples: UI-only rule, hardcoded mapping, buried fallback
