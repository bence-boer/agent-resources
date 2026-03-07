# Foundation - Scope

## Use when

Use when the ask is ambiguous, broad, or likely to sprawl.

## Route next

- [foundation-definition-of-done.md](foundation-definition-of-done.md) - to turn scope into a finish line
- [scenario-new-feature.md](scenario-new-feature.md) - if the work introduces new behavior
- [scenario-bug-fix.md](scenario-bug-fix.md) - if the work is closing a known defect

## Questions

- What is in scope, what is adjacent, and what must stay untouched? Examples: one flow, one contract, no schema rewrite
- What user or system behaviors must remain stable while you change this? Examples: existing API output, current navigation, data integrity
- What assumptions from the request need confirmation from code or context? Examples: feature already exists, bug reproducible, dependency available
- What is the smallest complete outcome that is still worth shipping? Examples: end-to-end happy path, safer default, one polished workflow
