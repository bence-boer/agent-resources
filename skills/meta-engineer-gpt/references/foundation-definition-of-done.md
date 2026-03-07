# Foundation - Definition of done

## Use when

Use before implementation, before review, and before deciding to stop.

## Route next

- [domain-correctness-and-verification.md](domain-correctness-and-verification.md) - to map claims to checks
- [domain-completeness.md](domain-completeness.md) - to catch adjacent work and mirrored paths
- [foundation-quality-gates.md](foundation-quality-gates.md) - to enforce the final baseline before shipping

## Questions

- What evidence proves the task is actually finished? Examples: user flow works, invariants hold, metrics stay healthy
- What supporting work must exist for this to stay finished? Examples: tests, logs, docs, migration plan
- What edge cases would make done a lie if left open? Examples: empty state, duplicate submit, rollback path
- What future change should become easier after this work, not harder? Examples: add another variant, trace failures, remove old path
