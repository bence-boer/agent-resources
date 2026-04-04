---
name: meta-engineer
description: >
  Engineering rigor discipline for building software. Use when working on features, fixing bugs,
  refactoring, investigating issues, integrating systems, or reviewing architecture and the task
  demands the canonical solution, not just a working one. Scenario-based and modular: route through
  the relevant foundation, scenario, and domain files to reason about invariants, state integrity,
  validation, type design, failure modes, testing, architecture, complexity, and security.
  Do NOT use for routine code-review feedback, style enforcement, or pure architecture planning
  without implementation.
---

# Meta Engineer

SELECT AND ALWAYS STRICTLY FOLLOW all relevant modules: begin with the foundation files below, choose one primary scenario, add only the domains that materially apply. Finish with self-review.

## Routing order

1. Always start with [foundation/core.md](foundation/core.md), [foundation/ownership.md](foundation/ownership.md), and [foundation/validation.md](foundation/validation.md).
2. Add [foundation/scope.md](foundation/scope.md) if boundaries are fuzzy.
3. Add [foundation/constraints.md](foundation/constraints.md) if compatibility, safety, scale, or rollout limits materially shape the solution.
4. Pick one primary scenario from the matrix below.
5. Add only the domain files that apply. Scenario files tell you which ones usually matter.
6. Always finish with [finish/self-review.md](finish/self-review.md). Add [finish/handoff.md](finish/handoff.md) if another person or agent continues the work.

## Core principles

- Eliminate the failure class, not the instance.
- Prove as early as possible. Prefer types, schemas, exhaustive handling, and toolchain checks over tests; tests over runtime recovery.
- Reason locally. Dependencies should be visible at the point of change or one step away.
- Cover the state-space, not only the observed case.
- Restrict by default. Open only the inputs, states, and permissions the design truly needs.
- Keep a single source of truth. Derive; do not duplicate.
- Abstract, do not merely extract. A good abstraction captures a stable rule and prevents misuse.
- Treat every dependency and boundary input as suspect until validated.
- Preserve behavior intentionally. If a contract must change, change it explicitly and validate all consumers.
- Surface undecidable choices. If something cannot be decided from facts, surface the decision explicitly before coding.

## Scenario routing matrix

| If the task is mostly... | Start here | Usually add |
| --- | --- | --- |
| A new feature or capability | [new-feature](scenarios/new-feature.md) | user-value, workflow-fit, invariants, error-handling, maintainability, extensibility |
| A bug fix or reliability fix | [bug-fix](scenarios/bug-fix.md) | invariants, correctness, completeness, state-and-data, observability, reliability |
| A refactor or structural cleanup | [refactor](scenarios/refactor.md) | maintainability, architecture, developer-experience, completeness, temporary-solutions |
| Investigation, discovery, or audit | [investigation](scenarios/investigation.md) | architecture, state-and-data, observability, correctness |
| An integration or boundary-crossing change | [integration](scenarios/integration.md) | dependencies, invariants, error-handling, reliability, architecture, security |
| UI, UX, copy, or user flow work | [ui-flow](scenarios/ui-flow.md) | user-value, workflow-fit, state-and-data, visual-design, error-handling, performance |
| A contract, schema, or data-meaning change | [contract-change](scenarios/contract-change.md) | invariants, state-and-data, correctness, completeness, observability, dependencies |
| Security, privacy, money, or high-risk change | [risky-change](scenarios/risky-change.md) | security, invariants, reliability, observability, correctness, testing |
| Performance, scale, or capacity work | [performance](scenarios/performance.md) | performance, observability, architecture, maintainability, temporary-solutions |
| Release, rollout, deployment, or ops change | [release](scenarios/release.md) | observability, reliability, completeness, security, testing |

All domain files live under the `domains/` folder. Read narrowly, but do not stop early.

## Questions this skill answers

- "Review this implementation for correctness"
- "What could go wrong with this change?"
- "Help me think through this feature's edge cases"
- "Audit this code for reliability"
- "What invariants should I maintain?"
- "Is this refactor safe?"
- "Review the error handling in this module"
- "What's the right abstraction here?"
- "Think through the failure modes"
- "How should I validate this input?"
