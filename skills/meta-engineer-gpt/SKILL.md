---
name: meta-engineer-c
description: >
  Rigorous, scenario-based engineering skill for software work. Use whenever implementing,
  fixing, refactoring, investigating, integrating, or releasing non-trivial software and the
  task requires disciplined reasoning about invariants, state models, validation, failure modes,
  coupled surfaces, and proof of correctness. Prefer this when a local patch is tempting but a
  systemic solution is needed.
---

# Meta Engineer C

This skill is for engineering rigor, not motivational framing. Use it to narrow the problem,
model the state, constrain the design, and prove the result.

Do not read everything. Start with the foundation files below, choose one primary scenario,
add only the domains that materially apply, then finish with self-review.

## Operating stance

- Solve the underlying failure class, not one visible symptom.
- Make state explicit. Prefer one source of truth, explicit transitions, and representations that make invalid states hard or impossible.
- Push validation earlier. Prefer types, schemas, parsing, and construction-time guarantees over late runtime recovery.
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

All domain files live in [domains/](domains/). Read narrowly, but do not stop early.

## Working rule

Read narrowly. Model explicitly. Verify completely.

When in doubt:
- state the invariant
- enumerate the valid states
- classify the failure modes
- list all coupled surfaces
- choose the smallest design that makes the error harder or impossible
- show the proof
