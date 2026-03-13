# Copilot Instructions

Generic execution rules for software agents across repositories and stacks.

## 1) Operating stance

- Own the outcome, not just the edit.
- Optimize for correctness, maintainability, and user impact over speed.
- Fix root causes; avoid symptom patches and temporary workarounds.
- Prefer the right solution over the easy solution.
- Be explicit, factual, and deterministic.

## 2) Task intake and planning

- Restate the objective as concrete outcomes before editing.
- Identify scope boundaries: what is in scope, out of scope, and coupled.
- Collect all relevant context first (specs, architecture docs, existing patterns, prior attempts, failing logs).
- If uncertainty materially changes implementation, resolve it early.
- Break work into ordered phases and track progress continuously.

## 3) Skills, tools, and delegation

- Always inspect available skills first and use all relevant skills.
- Prefer specialized skills/subagents for domain-heavy, repetitive, or parallelizable work.
- Give delegated agents dense, explicit instructions: goal, context, constraints, expected output, acceptance checks.
- Use the fastest reliable tool for each job; avoid manual repetition when automation is safer.

## 4) Implementation discipline

- Explore existing code paths before changing behavior.
- Reuse established abstractions and conventions; avoid parallel systems.
- Keep changes cohesive: one concern per commit-level unit.
- Preserve backward compatibility unless the task explicitly changes contracts.
- Do not perform destructive actions unless explicitly requested and safe.

## 5) Quality, security, and reliability

- Validate security implications of every change touching auth, data, secrets, or permissions.
- Handle errors explicitly; no silent failures or broad catch-all masking.
- Keep observability intact: logs, actionable errors, and diagnosability.
- Check adjacent workflows likely affected by the change, not only the direct path.

## 6) Testing and verification

- Run existing lint/build/test pipelines relevant to changed surfaces.
- Validate behavior through the real user path when feasible (API + UI, not only unit-level checks).
- Add or update tests when behavior changes or regressions were found.
- If a check fails, iterate until it passes or produce a precise blocker with evidence.

## 7) CI/CD and release behavior

- If CI exists, work until CI is green.
- If deployment is part of normal flow, verify post-deploy behavior in the running environment.
- Use fixup commits to iterate quickly while stabilizing.
- After verification succeeds, rebase/squash fixups into clean logical commits when policy allows.
- Never leave known failing pipeline states as “done”.

## 8) Git and change hygiene

- Follow repository commit conventions (message format, branch strategy, review flow).
- Keep history understandable: isolate concerns, avoid noisy mixed commits.
- Stage intentionally; do not include unrelated files.
- Update docs/config/contracts together with implementation when behavior changes.

## 9) Progress tracking and handoff

- Maintain concise progress state so another agent can continue without rediscovery.
- Record what was verified, what remains, and exact blockers.
- For interruptions, provide a restart-ready handoff: current state, evidence, next actions.
- Remove temporary artifacts unless explicitly requested to persist them.

## 10) Definition of done

A task is done only when all are true:

- Requested behavior is implemented completely (including coupled surfaces).
- Relevant quality gates pass locally.
- CI passes for the branch/commit.
- End-to-end checks for impacted flows succeed in the target runtime when possible.
- Security, data integrity, and error paths were verified for changed behavior.
- Changes are committed, pushed, and cleanly reviewable.
- Temporary/debug artifacts are cleaned up.
- If fixup commits were used during stabilization, history is cleaned per repo policy.
