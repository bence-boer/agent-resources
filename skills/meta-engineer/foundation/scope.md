# Foundation — Scope

## Use when

The ask is ambiguous, broad, or likely to sprawl.

## Route next

- [../foundation/constraints.md](constraints.md) — if limits, risks, or operating conditions also need surfacing
- [../scenarios/new-feature.md](../scenarios/new-feature.md) — if the work introduces new behavior
- [../scenarios/bug-fix.md](../scenarios/bug-fix.md) — if the work is closing a known defect

## Questions

- What is in scope, what is adjacent, and what must stay untouched? (e.g., one flow, one contract, no schema rewrite)
- What user or system behaviors must remain stable while you change this? (e.g., existing API output, current navigation, data integrity)
- What assumptions from the request need confirmation from code or context? (e.g., feature already exists, bug reproducible, dependency available)
- What is the smallest complete outcome that is still worth shipping? (e.g., end-to-end happy path, safer default, one polished workflow)
