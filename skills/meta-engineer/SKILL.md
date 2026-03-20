---
name: meta-engineer
description: >
  A meta-cognitive thinking skill for autonomous software engineering. Instead of prescribing rules,
  this skill guides you to ask yourself critical questions before, during, and after implementing a
  feature or fixing a bug. By answering these questions, you take emotional ownership of the task and
  ensure a perfectly polished, secure, and maintainable outcome across the entire SDLC.
---

# Meta Engineer

This skill does not prescribe how to write code. It provides a question-driven thinking framework that makes you the owner of the outcome, not just the executor of the task.

Do not read everything. Read only the files that match the current task, but answer every question in each loaded file before acting.

## Operating stance

- Own the outcome end to end, not just the assigned edit.
- Be critical of what exists. Be self-critical of your own work.
- Prefer durable improvements over local patches.
- Treat unverified assumptions, partial fixes, hidden complexity, and temporary solutions as risks.
- Question inherited decisions without breaking useful constraints.
- The goal is perfection. Close every gap or explain why it stays open.

## Routing order

1. **Always start** with [foundation/core.md](foundation/core.md) and [foundation/ownership.md](foundation/ownership.md).
2. **Add if needed:**
   - Ambiguous boundaries or broad ask → [foundation/scope.md](foundation/scope.md)
   - Important limits, risks, or environments → [foundation/constraints.md](foundation/constraints.md)
3. **Pick one scenario** from the matrix below.
4. **Add only the domain files** that match the change surface. Scenario files suggest which.
5. **Always finish** with [finish/self-review.md](finish/self-review.md). Add [finish/handoff.md](finish/handoff.md) if another person or agent continues the work.

## Scenario routing matrix

| If the task is mostly… | Start here | Usually add |
| --- | --- | --- |
| A new feature or capability | [new-feature](scenarios/new-feature.md) | user-value, workflow-fit, error-handling, maintainability, extensibility |
| A bug fix or reliability fix | [bug-fix](scenarios/bug-fix.md) | correctness, completeness, state-and-data, observability, reliability |
| A refactor or structural cleanup | [refactor](scenarios/refactor.md) | maintainability, architecture, developer-experience, completeness, temporary-solutions |
| Investigation, discovery, or audit | [investigation](scenarios/investigation.md) | architecture, state-and-data, observability, correctness |
| An integration or boundary-crossing change | [integration](scenarios/integration.md) | dependencies, error-handling, reliability, architecture, security |
| UI, UX, copy, or user flow work | [ui-flow](scenarios/ui-flow.md) | user-value, workflow-fit, visual-design, error-handling, performance |
| A contract, schema, or data-meaning change | [contract-change](scenarios/contract-change.md) | state-and-data, correctness, completeness, observability, dependencies |
| Security, privacy, money, or high-risk change | [risky-change](scenarios/risky-change.md) | security, reliability, observability, correctness, testing |
| Performance, scale, or capacity work | [performance](scenarios/performance.md) | performance, observability, architecture, maintainability, temporary-solutions |
| Release, rollout, deployment, or ops change | [release](scenarios/release.md) | observability, reliability, completeness, security, testing |

All domain files live in [domains/](domains/). Scenario files include "Route next" links.

## Working rule

Read narrowly, think deeply, act completely. Do not use the example fragments as requirements. Use them only as alignment hints.
