---
name: meta-engineer-gpt
description: >
  Question-driven engineering meta-skill for software projects and feature work. Use when planning,
  designing, implementing, reviewing, debugging, refactoring, integrating, testing, or releasing
  changes in any codebase. Route the agent through dense, domain-based self-questions so it thinks
  like the owner of the outcome rather than a task executor: clarify value, challenge assumptions,
  protect UX and DX, reduce complexity, preserve maintainability, verify correctness, handle failure
  modes, avoid temporary solutions, and ship complete work.
---

# Meta Engineer GPT

Use this skill to think like the owner of the outcome. Do not read everything. Read only the files that match the current task, but answer every question in each loaded file before acting.

## Operating stance

- Own the result end to end, not just the requested edit.
- Prefer durable improvements over local patches.
- Question inherited decisions without breaking useful constraints.
- Treat unverified assumptions, partial fixes, hidden complexity, and temporary solutions as risks.
- Keep answers brief but concrete. If a question exposes a gap, close it or explain why it stays open.

## Routing order

1. Start with [foundation-core.md](references/foundation-core.md) and [foundation-ownership.md](references/foundation-ownership.md).
2. Add the foundation files that make the task legible:
   - unclear problem or boundaries -> [foundation-scope.md](references/foundation-scope.md)
   - important limits, risks, or environments -> [foundation-constraints.md](references/foundation-constraints.md)
   - before implementation or final review -> [foundation-definition-of-done.md](references/foundation-definition-of-done.md)
3. Pick one primary scenario file from the matrix below.
4. Add only the domain files that match the change surface.
5. Finish with [foundation-quality-gates.md](references/foundation-quality-gates.md) and [finish-self-review.md](references/finish-self-review.md). Add [finish-handoff.md](references/finish-handoff.md) if another person or agent must pick this up later.

## Fast route matrix

| If the task is mostly... | Start here | Usually add |
| --- | --- | --- |
| investigation, discovery, audit, or root-cause work | [scenario-investigation.md](references/scenario-investigation.md) | [domain-architecture-fit.md](references/domain-architecture-fit.md), [domain-state-and-invariants.md](references/domain-state-and-invariants.md), [domain-observability-and-operations.md](references/domain-observability-and-operations.md) |
| a new feature or capability | [scenario-new-feature.md](references/scenario-new-feature.md) | [domain-user-value.md](references/domain-user-value.md), [domain-workflow-fit.md](references/domain-workflow-fit.md), [domain-error-handling.md](references/domain-error-handling.md), [domain-maintainability.md](references/domain-maintainability.md) |
| a bug fix or reliability fix | [scenario-bug-fix.md](references/scenario-bug-fix.md) | [domain-completeness.md](references/domain-completeness.md), [domain-state-and-invariants.md](references/domain-state-and-invariants.md), [domain-correctness-and-verification.md](references/domain-correctness-and-verification.md), [domain-observability-and-operations.md](references/domain-observability-and-operations.md) |
| a refactor or structural cleanup | [scenario-refactor.md](references/scenario-refactor.md) | [domain-architecture-fit.md](references/domain-architecture-fit.md), [domain-maintainability.md](references/domain-maintainability.md), [domain-extensibility.md](references/domain-extensibility.md), [domain-temporary-solutions.md](references/domain-temporary-solutions.md) |
| an integration or boundary-crossing change | [scenario-integration.md](references/scenario-integration.md) | [domain-workflow-fit.md](references/domain-workflow-fit.md), [domain-error-handling.md](references/domain-error-handling.md), [domain-dependencies-and-surface-area.md](references/domain-dependencies-and-surface-area.md), [domain-risk-and-safety.md](references/domain-risk-and-safety.md) |
| UI, UX, copy, or user flow work | [scenario-ui-flow.md](references/scenario-ui-flow.md) | [domain-user-value.md](references/domain-user-value.md), [domain-workflow-fit.md](references/domain-workflow-fit.md), [domain-error-handling.md](references/domain-error-handling.md), [domain-performance-and-cost.md](references/domain-performance-and-cost.md) |
| a contract, schema, or state-meaning change | [scenario-contract-change.md](references/scenario-contract-change.md) | [domain-state-and-invariants.md](references/domain-state-and-invariants.md), [domain-correctness-and-verification.md](references/domain-correctness-and-verification.md), [domain-observability-and-operations.md](references/domain-observability-and-operations.md), [domain-completeness.md](references/domain-completeness.md) |
| a security, privacy, money, or otherwise risky change | [scenario-risky-change.md](references/scenario-risky-change.md) | [domain-risk-and-safety.md](references/domain-risk-and-safety.md), [domain-observability-and-operations.md](references/domain-observability-and-operations.md), [domain-correctness-and-verification.md](references/domain-correctness-and-verification.md), [finish-handoff.md](references/finish-handoff.md) |
| performance, scale, or capacity work | [scenario-performance-or-capacity.md](references/scenario-performance-or-capacity.md) | [domain-performance-and-cost.md](references/domain-performance-and-cost.md), [domain-observability-and-operations.md](references/domain-observability-and-operations.md), [domain-maintainability.md](references/domain-maintainability.md), [domain-temporary-solutions.md](references/domain-temporary-solutions.md) |
| release, rollout, deployment, or ops change | [scenario-release-change.md](references/scenario-release-change.md) | [domain-risk-and-safety.md](references/domain-risk-and-safety.md), [domain-observability-and-operations.md](references/domain-observability-and-operations.md), [domain-completeness.md](references/domain-completeness.md), [finish-handoff.md](references/finish-handoff.md) |

Scenario files suggest which domain files to read next. Domain files are horizontal. Combine them only where the task truly needs them.

## Foundation files

- [foundation-core.md](references/foundation-core.md): Start here for any task. Frame the real problem, the desired improvement, and the facts worth verifying before acting.
- [foundation-ownership.md](references/foundation-ownership.md): Use this to shift from task execution to real stewardship of the outcome, the failure modes, and the long-term shape of the change.
- [foundation-scope.md](references/foundation-scope.md): Clarify what belongs inside the change, what must stay stable, and what minimum complete outcome is still worth shipping.
- [foundation-constraints.md](references/foundation-constraints.md): Surface the limits that should shape the solution: scale, compatibility, risk, operating conditions, and coordination cost.
- [foundation-definition-of-done.md](references/foundation-definition-of-done.md): Define the evidence, supporting work, and edge handling that make the task truly complete instead of merely coded.
- [foundation-quality-gates.md](references/foundation-quality-gates.md): Use this as the universal final gate for trust: mechanical checks, unhappy paths, pattern completeness, and readability.

## Scenario files

- [scenario-investigation.md](references/scenario-investigation.md): Use this for audits, root-cause analysis, discovery, and any task where understanding the current system is the first deliverable.
- [scenario-new-feature.md](references/scenario-new-feature.md): Use this when introducing new behavior, new surfaces, or a new capability that should feel intentionally designed from day one.
- [scenario-bug-fix.md](references/scenario-bug-fix.md): Use this to close a defect at the root, not just hide the symptom, and to search for the same pattern everywhere it can recur.
- [scenario-refactor.md](references/scenario-refactor.md): Use this when changing structure to remove pain, lower complexity, and make future work cheaper without changing intended behavior.
- [scenario-integration.md](references/scenario-integration.md): Use this for work that joins systems, modules, teams, or services and therefore lives or dies by contract clarity and failure handling.
- [scenario-ui-flow.md](references/scenario-ui-flow.md): Use this when the quality of the user journey matters as much as the raw feature: entry, guidance, state changes, errors, and recovery.
- [scenario-contract-change.md](references/scenario-contract-change.md): Use this when changing a promise between parts of the system: payloads, schemas, events, data meaning, or ordering rules.
- [scenario-risky-change.md](references/scenario-risky-change.md): Use this when the blast radius, legal exposure, trust cost, or irreversibility of failure is high enough to deserve stricter thinking.
- [scenario-performance-or-capacity.md](references/scenario-performance-or-capacity.md): Use this when the real task is protecting latency, throughput, memory, cost, or human operational capacity without creating opaque hacks.
- [scenario-release-change.md](references/scenario-release-change.md): Use this when shipping mechanics matter: deploy order, migration safety, health checks, rollback, repair, and coordination after launch.

## Domain files

- [domain-user-value.md](references/domain-user-value.md): Use this to keep the work anchored in outcomes that matter to users, operators, or buyers rather than internal ticket completion.
- [domain-workflow-fit.md](references/domain-workflow-fit.md): Use this to make the change feel native inside the wider flow instead of solving one moment while harming the surrounding journey.
- [domain-error-handling.md](references/domain-error-handling.md): Use this to design how failure should look, what can fail silently, and which recovery paths should exist by default.
- [domain-developer-experience.md](references/domain-developer-experience.md): Use this to lower the cost of setup, debugging, extension, and confident edits for the next engineer or future you.
- [domain-maintainability.md](references/domain-maintainability.md): Use this to keep the repository understandable, structurally coherent, and ready for repeated change without constant re-learning.
- [domain-extensibility.md](references/domain-extensibility.md): Use this to make the next valid variant cheap to add without over-generalizing the current task into a framework.
- [domain-architecture-fit.md](references/domain-architecture-fit.md): Use this to test whether the change reinforces the system model, boundary choices, and ownership lines instead of fighting them.
- [domain-state-and-invariants.md](references/domain-state-and-invariants.md): Use this to reason about truth, derivation, ordering, duplication, and the rules that must remain true before and after change.
- [domain-correctness-and-verification.md](references/domain-correctness-and-verification.md): Use this to turn every important claim into evidence and to raise the bar from plausible to verified.
- [domain-observability-and-operations.md](references/domain-observability-and-operations.md): Use this to make failures visible, behavior measurable, and operational work more precise instead of more noisy.
- [domain-performance-and-cost.md](references/domain-performance-and-cost.md): Use this to reason about steady-state cost, hot paths, capacity, and the tradeoffs between speed, clarity, and resilience.
- [domain-dependencies-and-surface-area.md](references/domain-dependencies-and-surface-area.md): Use this to minimize moving parts, isolate external choices, and keep new failure and maintenance burdens from leaking everywhere.
- [domain-completeness.md](references/domain-completeness.md): Use this to catch the mirrored paths, follow-up work, and second-order effects that make incomplete fixes so expensive later.
- [domain-temporary-solutions.md](references/domain-temporary-solutions.md): Use this to refuse fake completion, vague TODO debt, and shortcuts that quietly become permanent architecture.
- [domain-risk-and-safety.md](references/domain-risk-and-safety.md): Use this to define what harm must stay unlikely, what guardrails should exist, and how to shrink blast radius before you need it.

## Finish files

- [finish-self-review.md](references/finish-self-review.md): Use this for the final skeptical pass before you stop: what would worry you, what still feels lucky, and what would most strengthen the change.
- [finish-handoff.md](references/finish-handoff.md): Use this when someone else will review, deploy, extend, or own the change next and should not have to rediscover the key context.

## Working rule

Read narrowly, think deeply, and act completely. The goal is not to answer every question in the skill. The goal is to load the right question sets for the current task and let them push the work toward a cleaner system, a better user experience, a better developer experience, and a more trustworthy final result.

Do not use the example fragments as requirements. Use them only as alignment hints.
