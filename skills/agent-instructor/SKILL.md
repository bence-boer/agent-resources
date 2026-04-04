---
name: agent-instructor
description: >
  Prompt engineering framework for writing execution-ready instructions for coding agents.
  Use whenever drafting, rewriting, or reviewing prompts for implementation, bug fixing,
  refactoring, audits, handoffs, or subagent delegation. Trigger this skill even when the
  request is informal ("help me phrase this", "write a better prompt", "make this actionable").
  Do NOT use for general creative writing, end-user documentation, or non-agent communication.
  Do NOT use for creating skills (use Skill Creator) or team/agent composition.
---

# Agent Instructor

Design prompts that are unambiguous, testable, and execution-ready on first pass.

## Expert vocabulary

**Prompt engineering** — chain-of-thought prompting (Wei et al.), few-shot prompting (Brown et al.), zero-shot prompting, retrieval-augmented generation (Lewis et al.), system prompt, instruction tuning (Ouyang et al.), prompt injection defense, structured output forcing.

**Task decomposition** — task decomposition (Khot et al.), subtask delegation, single-responsibility prompts, context window management, progressive disclosure, orchestration layer, fan-out/fan-in delegation.

**Evaluation** — acceptance criteria, falsifiability, coverage matrix, edge-case enumeration, hallucination detection, grounding, oracle test, regression anchor.

**Constraint engineering** — guardrails, negative constraints, boundary conditions, forbidden-action lists, scope fencing, blast-radius limiting, invariant preservation.

## Anti-pattern watchlist

### Wish Prompt
**Detection:** prompt uses words like "improve," "fix," "make better," "clean up" without a measurable target or end-state definition.
**Resolution:** replace vague verb with specific outcome + observable metric. "Fix the auth" → "Make `POST /login` return 200 with valid JWT when given correct credentials, and 401 otherwise."

### Context Dump
**Detection:** prompt pastes entire files, full docs, or long logs without indicating which parts matter or why they are included.
**Resolution:** excerpt only the relevant sections; annotate each excerpt with its purpose ("this config shows the current DB connection; the agent must change the `host` field").

### Missing Escape Hatch
**Detection:** no fallback behavior specified for when the agent gets stuck, hits an ambiguity, or encounters an unexpected state.
**Resolution:** add explicit blocker-handling instruction: "If X is unclear, do Y. If build fails after 3 attempts, stop and report the exact error and what you tried."

### Implicit Scope
**Detection:** no explicit in-scope / out-of-scope boundaries; agent must guess what it may and may not touch.
**Resolution:** add a scope block listing included surfaces and explicit exclusions. "In scope: `src/auth/**`, auth tests. Out of scope: database migrations, CI config."

### Test-Free Done
**Detection:** definition of done has no verifiable checks — just "make sure it works" or "it should be correct."
**Resolution:** add concrete verification: specific lint/build/test commands, expected exit codes, curl commands with expected responses, or CI status checks.

## Prompt architecture (required blocks)

Use these blocks in order. Omit only when truly irrelevant.

1. **Objective**
   - What must be achieved, in one sentence.
   - Required end state, not implementation trivia.

2. **Context and resources**
   - Exact files, paths, docs, URLs, commits, logs, or APIs to use.
   - Source-of-truth references and precedence (if multiple sources conflict).

3. **Scope boundaries**
   - In-scope surfaces and explicit non-goals.
   - Coupled areas that must be checked (tests, docs, CI, UX, migrations, contracts).

4. **Constraints**
   - Security, compatibility, performance, tooling, model, environment, or policy limits.
   - Forbidden actions (destructive commands, rule bypasses, shortcut fixes).

5. **Execution expectations**
   - Required approach (explore first, then implement; prefer existing patterns; use relevant skills).
   - Branch/commit strategy if important.
   - Delegation requirements if subagents should be used.

6. **Validation and definition of done**
   - Which checks must pass (lint/build/tests/CI).
   - Required end-to-end validations.
   - Completion rule (e.g., “iterate fixups until CI passes, then clean history per policy”).

7. **Deliverables**
   - Exact expected outputs (files, diffs, report structure, commands, commit/push requirement).
   - Required response style (concise summary, verification evidence, next steps).

## Prompt quality rules

- Prefer concrete nouns over vague language.
- Replace “improve/fix/refactor” with measurable targets.
- Specify order when order matters.
- State tradeoff priorities when they conflict (e.g., correctness > speed).
- Demand evidence for claims (“include command output path/check result”).
- Include fallback behavior for blockers (try alternatives, then return exact blocker + evidence).

## Prompt lint checklist

Verify each block from § Prompt architecture is present and sufficient, then check:

- Could an agent act on this prompt without guessing?
- Does the prompt avoid repo-specific assumptions unless provided?
- Are security and data-safety requirements stated where relevant?
- Could another agent continue from the output without rediscovery?

## Subagent delegation template

Use this when instructing a subagent:

```md
Task: <single responsibility objective>
Context: <relevant paths/files/specs only>
Constraints: <hard limits and forbidden actions>
Expected output: <exact files/edits/report fields>
Validation: <checks to run and evidence to return>
Done when: <objective completion criteria>
```

## Rewriting weak prompts (fast transform)

For each vague prompt, identify which architecture blocks (§ Prompt architecture) are missing or weak, then add the minimum decision-critical detail to fill them. Do not pad with random detail.

## High-signal prompt template

Mirrors the architecture blocks. Fill each placeholder; omit only when truly irrelevant.

```md
Objective: <one-sentence end state>
Context: <paths, docs, logs, refs>
Scope: In scope: <surfaces> | Out of scope: <surfaces> | Also validate: <adjacent>
Constraints: <hard limits> | Forbidden: <actions>
Execution: <approach, skills, delegation>
Validation / Done: <checks, CI, E2E, stabilization>
Deliverables: <files, commits, reports, format>
```

## Examples

### Pair 1 — Feature implementation prompt

**BAD:**
```
Fix the search feature. It's slow and doesn't work well.
Users are complaining. Make it better and add tests.
```
Problems: Wish Prompt ("make it better"), Implicit Scope (which search feature? what files?), Test-Free Done (no success criteria), Context Dump missing (no paths, no current behavior, no perf numbers).

**GOOD:**
```
Objective: Reduce P95 latency of GET /api/search from 1200ms to under 300ms.

Context: The search handler is in src/api/search.ts. It queries
Postgres via src/db/queries.ts#searchProducts. Current EXPLAIN output
is in docs/search-explain.md showing a sequential scan on `products`.

Scope:
  In scope: src/api/search.ts, src/db/queries.ts, related test files.
  Out of scope: UI changes, other API endpoints, schema migrations.

Constraints: Must use existing Postgres indexes or add new ones via
a migration file. No external search engines (Elastic, Typesense).

Validation: `npm test -- --grep search` passes. Measure P95 with
`k6 run tests/perf/search.js` — must report < 300ms.

Done when: Tests green, perf target met, migration file included.
```

### Pair 2 — Subagent delegation prompt

**BAD:**
```
Review the PR and fix any issues you find. Make sure the code is
clean and follows best practices. Also update the docs if needed.
```
Problems: Wish Prompt ("fix any issues," "clean," "best practices"), Implicit Scope (entire PR? which docs?), Missing Escape Hatch (what if conflicts exist?), Test-Free Done.

**GOOD:**
```
Objective: Address all 4 review comments on PR #342 so the PR passes
CI and is merge-ready.

Context: Review comments are on src/auth/session.ts (token expiry
logic) and src/auth/session.test.ts (missing edge case). Read the
comments via `gh pr view 342 --comments`.

Scope:
  In scope: src/auth/session.ts, src/auth/session.test.ts.
  Out of scope: other files in the PR diff, README, CI config.

Constraints: Do not change the public API signature of refreshToken().
Preserve backward compatibility with existing callers.

Execution: Fix each comment in a separate commit. Run tests after each.
If a comment is ambiguous, add a TODO with the exact ambiguity and move on.

Validation: `npm test` passes. `npm run lint` passes. No remaining
unresolved review threads.

Done when: All 4 comments resolved, CI green, commit history clean.
```

## Questions this skill answers

- How do I write a good prompt for a coding agent?
- How should I structure instructions for an AI coding assistant?
- What makes an agent prompt execution-ready vs vague?
- How do I delegate a subtask to a subagent?
- How do I rewrite a weak or vague prompt into a strong one?
- What should I include in acceptance criteria for an agent task?
- How do I scope a prompt so the agent doesn't touch unrelated code?
- What are common mistakes in agent prompts?
- How do I write a prompt for a bug fix / refactor / feature / audit?
- Help me phrase this task for Copilot / an AI agent.
