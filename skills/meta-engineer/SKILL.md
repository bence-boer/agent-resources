---
name: meta-engineer
description: >
  Engineering rigor discipline for building software. Use when working on features, fixing bugs,
  refactoring, investigating issues, integrating systems, or reviewing architecture and the task
  demands the canonical solution, not just a working one. Scenario-based and modular: route through
  the relevant foundation, scenario, and domain files to reason about invariants, state integrity,
  validation, type design, failure modes, testing, architecture, complexity, and security.
---

# Meta Engineer

Provides a structured thinking framework for applying engineering rigor to software development. SELECT AND ALWAYS STRICTLY FOLLOW all relevant modules: begin with the foundation files below, choose one primary scenario, add only the domains that materially apply. Finish with self-review.

## Core principles

- Eliminate the failure class, not the instance.
- Prove as early as possible. Prefer types, schemas, exhaustive handling, and toolchain checks over tests; tests over runtime recovery.
- Reason locally. Dependencies should be visible at the point of change or one step away.
- Cover the state-space, not only the observed case.
- Restrict by default. Open only the inputs, states, and permissions the design truly needs.
- Keep a single source of truth. Derive; do not duplicate.
- Abstract, do not merely extract. A good abstraction captures a stable rule and prevents misuse.
- Everything earns its place. Delete dead code, vestigial parameters, and speculative structure.

## Operating stance

- Solve the underlying problem at the right level. Patch one instance only if the broader failure class truly cannot be removed.
- Make state explicit. Prefer one source of truth, explicit transitions, and representations that make invalid states hard or impossible.
- Push validation earlier. Validate at the boundary, trust inside, and keep runtime checks for what genuinely cannot be known sooner.
- Keep reasoning local. Each function, module, and component should be understandable without reconstructing the whole system.
- Keep abstractions restrictive. A good API should remove misuse opportunities, not export them.
- Treat every dependency and every boundary input as suspect until validated.
- Preserve behavior intentionally. If a contract must change, change it explicitly and validate all consumers.
- Prove important claims. Every material claim should have static, test, runtime, or operational evidence.
- If something cannot be decided from facts, surface the decision explicitly before coding.

## Routing order

1. Always start with [foundation/core.md](foundation/core.md), [foundation/ownership.md](foundation/ownership.md), and [foundation/validation.md](foundation/validation.md).
2. Add [foundation/scope.md](foundation/scope.md) if boundaries are fuzzy.
3. Add [foundation/constraints.md](foundation/constraints.md) if compatibility, safety, scale, or rollout limits materially shape the solution.
4. Pick one primary scenario from the matrix below.
5. Add only the domain files that apply. Scenario files tell you which ones usually matter.
6. Always finish with [finish/self-review.md](finish/self-review.md). Add [finish/handoff.md](finish/handoff.md) if another person or agent continues the work.

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

## Working rule

Read narrowly. Model explicitly. State the invariant. Enumerate valid and invalid states. Prove each
material claim. Search sibling paths and failure surfaces, not only the named case.
