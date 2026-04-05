---
name: agent-orchestrator
description: >
  Prompt engineering and multi-agent orchestration framework for software modification
  pipelines. Covers execution-ready prompt design (chain-of-thought, few-shot, structured
  output forcing), task decomposition into Directed Acyclic Graphs, orchestration pattern
  selection (sequential, parallel, hierarchical, blackboard), Brain/Heart architecture
  separation, Git worktree conflict isolation, interleaved verification loops, and agent
  dispatch coordination. Use when writing agent prompts, orchestrating multi-agent workflows,
  decomposing tasks for agent swarms, designing verification pipelines, or delegating subtasks.
  Trigger on any agent prompt, orchestration, or multi-agent coordination task — even informal
  ("help me phrase this", "write a better prompt", "coordinate these agents", "break this into
  tasks"). Do NOT use for creating agent profiles (.agent.md — use Agent Creator), creating
  skills (use Skill Creator), or general creative writing.
---

# Agent Orchestrator

Write execution-ready agent prompts and design multi-agent orchestration pipelines that decompose complex objectives into verified, atomic work units.

## Expert vocabulary

**Prompt Engineering:** chain-of-thought prompting (Wei et al.), few-shot prompting (Brown et al.), retrieval-augmented generation (Lewis et al.), instruction tuning (Ouyang et al.), structured output forcing

**Task Decomposition & Orchestration:** task decomposition (Khot et al.), Directed Acyclic Graph (DAG), subtask delegation, fan-out/fan-in delegation, atomic task, definition of done, Brain/Heart separation, sequential pipeline, parallel execution, hierarchical routing, blackboard pattern (Engelmore & Morgan)

**Conflict Resolution & State:** Git worktree isolation, merge integration point, dialectical negotiation, semantic deduplication

**Evaluation & Constraints:** acceptance criteria, interleaved verification loop, generator-evaluator harness, deterministic check, exit criteria, negative constraints, scope fencing

**Retrieval Anchors:** context window management, progressive disclosure, grounding

## Anti-pattern watchlist

### 1. Wish Prompt
**Detection:** Prompt uses "improve," "fix," "make better," "clean up" without a measurable target or end-state.
**Resolution:** Replace vague verb with specific outcome + observable metric. "Fix the auth" → "Make `POST /login` return 200 with valid JWT when given correct credentials, and 401 otherwise."

### 2. Context Dump
**Detection:** Prompt pastes entire files, full docs, or long logs without indicating which parts matter.
**Resolution:** Excerpt only relevant sections; annotate each excerpt with its purpose ("this config shows the current DB connection; the agent must change the `host` field").

### 3. Missing Escape Hatch
**Detection:** No fallback behavior for when the agent gets stuck, hits ambiguity, or encounters unexpected state.
**Resolution:** Add explicit blocker-handling: "If X is unclear, do Y. If build fails after 3 attempts, stop and report the exact error and what you tried."

### 4. Implicit Scope
**Detection:** No explicit in-scope / out-of-scope boundaries; agent must guess what it may touch.
**Resolution:** Add scope block listing included surfaces and explicit exclusions. "In scope: `src/auth/**`, auth tests. Out of scope: database migrations, CI config."

### 5. Test-Free Done
**Detection:** Definition of done has no verifiable checks — just "make sure it works" or "it should be correct."
**Resolution:** Add concrete verification: lint/build/test commands, expected exit codes, curl commands with expected responses, or CI status checks.

### 6. Premature Serialization
**Detection:** Orchestrator defaults to purely sequential pipeline when tasks are demonstrably independent, destroying parallelism advantages.
**Resolution:** Analyze the dependency graph explicitly. Tasks with no shared dependencies or file paths execute in parallel.

### 7. Vague Delegation
**Detection:** Tasks dispatched to sub-agents without explicit scope boundaries, context paths, or verifiable completion criteria.
**Resolution:** Every dispatched task must include: assignee role, dependency list, context paths, execution strategy, and definition of done.

### 8. Fire-and-Forget Execution
**Detection:** Entire task queue dispatched without intermediate verification — errors compound silently through subsequent steps.
**Resolution:** Enforce interleaved verification: no task N+1 begins until task N passes its verification gate.

### 9. Shared-Workspace Conflicts
**Detection:** Multiple parallel agents edit files in the same working directory, causing overwrite races and context bleeding.
**Resolution:** Assign each parallel agent its own Git worktree with an isolated branch. Merge at a single integration point after all agents pass local verification.

### 10. Over-Parallelization
**Detection:** More than 3–5 parallel implementation agents active simultaneously on the same codebase.
**Resolution:** Cap parallel agents at 3–5. Beyond this threshold, merge conflicts overwhelm the integration step, negating speed gains.

## Prompt architecture

Use these blocks in order when writing any agent prompt. Omit only when truly irrelevant.

1. **Objective** — What must be achieved, in one sentence. Required end state, not implementation trivia.
2. **Context and resources** — Exact files, paths, docs, URLs, commits, logs, or APIs. Source-of-truth references and precedence if multiple sources conflict.
3. **Scope boundaries** — In-scope surfaces and explicit non-goals. Coupled areas to check (tests, docs, CI, UX, migrations, contracts).
4. **Constraints** — Security, compatibility, performance, tooling, model, environment, or policy limits. Forbidden actions (destructive commands, rule bypasses, shortcut fixes).
5. **Execution expectations** — Required approach (explore first, then implement; prefer existing patterns; use relevant skills), branch/commit strategy, delegation requirements for subagents.
6. **Validation and definition of done** — Which checks must pass (lint/build/tests/CI). Required end-to-end validations. Completion rule.
7. **Deliverables** — Exact expected outputs (files, diffs, report structure, commands). Required response style (summary, evidence, next steps).

## Prompt quality rules

- Prefer concrete nouns over vague language
- Replace "improve/fix/refactor" with measurable targets
- Specify order when order matters
- State tradeoff priorities when they conflict (correctness > speed)
- Demand evidence for claims ("include command output path/check result")
- Include fallback behavior for blockers (try alternatives, then return exact blocker + evidence)
- When dispatching agents, specify which domain skills to load for the task context
- Execute large file write operations in bounded batches (200–300 lines per operation) to prevent tool-call timeouts

## Orchestration architecture

### Brain/Heart separation

Decouple the stateless planning layer (Brain) from the stateful execution layer (Heart). Fusing these into a single entity creates systemic fragility — execution failures crash the strategic plan.

**Brain (Planner):** Evaluates the objective, loads system context, decomposes the request into a structured task DAG. Stateless per request. Provides execution strategy hints (parallel vs sequential) based on the dependency graph. Does not write code, run tests, or debug.

**Heart (Executor):** Receives the task DAG, tracks dynamic execution state, manages retry logic, enforces timeouts, aggregates results. Stateful per execution. Houses the execution strategy engine that dictates operational flow based on the Brain's plan.

Independent scaling and isolated failure domains: a sub-agent hallucination managed by the Heart does not corrupt the Brain's strategic plan, allowing recovery without losing trajectory.

### Orchestration execution patterns

Select the pattern based on the task graph topology:

| Pattern | Mechanism | Use when | Hazards |
|---------|-----------|----------|---------|
| Sequential Pipeline | Linear chain — each agent processes validated output of the preceding agent | Clear stage dependencies with ordered refinement | Early failures propagate unchecked; maximum latency |
| Parallel Execution | Multiple agents work simultaneously on independent subtasks, converging at an aggregator | Independent domain tasks with no shared file paths | Resource-intensive; merge conflicts if boundaries not isolated |
| Hierarchical Routing | Coordinator delegates dynamically based on intermediate results | Complex unpredictable tasks requiring real-time capability assessment | Infinite delegation loops; non-deterministic execution path |
| Blackboard | Shared knowledge repository — agents read/write asynchronously | Cross-domain synthesis, complex conflict resolution | Context overflow from unstructured accumulation |

The dependency graph determines the pattern — never parallelize tasks with sequential dependencies.

## Task decomposition

Decompose complex objectives into atomic work units. Every subtask must satisfy four properties:

1. **Atomic** — Cannot be meaningfully subdivided without losing critical context
2. **Independently verifiable** — Success checked via automated tests, linting, or exit codes — no subjective self-evaluation
3. **Independent** — Minimal overlapping dependencies with concurrent subtasks — no race conditions
4. **Bounded** — Clear scope parameters and explicit completion criteria signaling the executor to terminate

### Task schema

Output decomposition as structured JSON. This schema is the universal interface between the planning and execution layers:

| Field | Type | Purpose |
|-------|------|---------|
| `task_id` | string | Unique identifier for DAG tracking |
| `description` | string | Precise, measurable objective — vague verbs ("improve," "optimize") prohibited |
| `assignee_role` | string | Agent archetype required (explorer, architect, implementer, verifier) |
| `dependencies` | array | Preceding task_ids that must reach COMPLETED before dispatch |
| `context_paths` | array | File paths, URLs, or doc boundaries the agent may ingest |
| `execution_strategy` | string | parallel, sequential, or background |
| `definition_of_done` | string | Exact test command, exit code, or verification metric |
| `skills` | array | Domain skills the agent should load for task context |

Forcing the planner to articulate the definition of done before dispatch prevents the test-free-done anti-pattern at the architectural level.

## Conflict resolution

### Git worktree isolation

For parallel execution, assign each sub-agent its own Git worktree with an independent branch and working directory. Unlike standard branching, worktrees allow concurrent edits across branches without file-locking conflicts.

**Process:** Dispatch → agents edit in isolated directories → local verification passes → orchestrator merges branches at a single integration point → resolve conflicts deterministically at merge time.

**Scaling limit:** 3–5 concurrent implementation agents. Beyond this, merge conflict volume overwhelms clean integration.

### Sequential write discipline

When Git worktree isolation is unavailable, agents writing to overlapping file sets must be dispatched sequentially. Parallel agents cannot coordinate and will overwrite each other's changes. The orchestrator must analyze `context_paths` for file-set overlap before choosing parallel vs sequential execution.

### Dialectical negotiation for report synthesis

When parallel agents produce overlapping analysis, merge reports using thesis/antithesis/synthesis:

1. **Thesis** — Parallel reports submitted to shared context
2. **Antithesis** — Semantic cross-check identifies overlaps, competing priorities, logical contradictions. Distinguish resource-bound conflicts (competing for limited parameters) from logical incompatibilities (mutually exclusive paths)
3. **Synthesis** — Merge based on highest-confidence evidence; deduplicate findings exceeding similarity threshold (0.8–0.95 cosine similarity); preserve the highest-confidence entry and discard redundant nodes

## Interleaved verification

Never dispatch an entire task queue without checking intermediate results. Operate on a cycle of implement → verify → proceed.

1. Implementer completes atomic code differential
2. Orchestrator pauses further implementation in that thread
3. Verifier agent inspects the isolated artifact (deterministic checks first)
4. IF rejected: defect report routed back to original Implementer for localized fix loop
5. Loop until Verifier approves
6. Orchestrator unlocks next phase

Only after all sequential tasks pass localized verification gates does the orchestrator dispatch a full-system Reviewer or Synthesizer for integrated evaluation against the original objective.

**Economics:** Verification requires less computation than generation. Use smaller, optimized models for Verifier agents to reduce cost and latency while maintaining rigor.

**CI as final gate:** After all tasks pass local verification and full-system review, the CI pipeline serves as the ultimate deterministic gate. The pipeline is not complete until CI is green.

**Comprehensive scope:** Verifiers should check the full affected surface — not just the files listed in `context_paths` — to catch regressions in coupled code.

## Spec-driven development pipeline

The canonical orchestration sequence for modification tasks. Define the desired outcome before writing any code:

1. **Map** — Dispatch explorer agents to build code maps and conceptual models of affected system areas
2. **Specify** — Define the desired end state, behavioral rules, and acceptance criteria as a specification. No code yet
3. **Architect** — Project the specification onto the code map. Produce a Technical Architecture Plan with file-level changes and interface contracts
4. **Test** — Draft test definitions (E2E, integration) based on the specification and architecture plan before implementation begins (pipeline-level TDD)
5. **Decompose** — Break the architecture plan into atomic agent tasks with a dependency graph and task queue
6. **Implement** — Dispatch implementers sequentially or in isolated worktrees. Each writes unit tests first, then code (task-level TDD)
7. **Verify** — After each implementation step, dispatch a verifier. Loop fix cycles locally until approved
8. **Review** — After all tasks pass verification, dispatch a reviewer for full-system evaluation against the original objective and specification
9. **Gate** — CI pipeline must pass as the final deterministic gate. Not done until CI is green
10. **Clean up** — Remove temporary planning, audit, and intermediate files before reporting completion

Steps 6–7 repeat per task. Steps 8–9 gate the entire pipeline. If the review or CI gate fails, route failures back to the appropriate step.

## Subagent delegation template

Use this when dispatching work to a subagent:

```
Task: <single responsibility objective>
Context: <relevant paths/files/specs only>
Constraints: <hard limits and forbidden actions>
Expected output: <exact files/edits/report fields>
Validation: <checks to run and evidence to return>
Done when: <objective completion criteria>
```

## Rewriting weak prompts

For each vague prompt, identify which architecture blocks (§ Prompt architecture) are missing or weak, then add the minimum decision-critical detail to fill them. Do not pad with random detail.

## High-signal prompt template

Mirrors the architecture blocks. Fill each placeholder; omit only when truly irrelevant.

```
Objective: <single-sentence required end state>
Context: <paths, docs, logs, refs>
Scope: In scope: <surfaces> | Out of scope: <surfaces> | Also validate: <adjacent>
Constraints: <hard limits> | Forbidden: <actions>
Execution: <approach, skills, delegation>
Validation / Done: <checks, CI, E2E, stabilization>
Deliverables: <files, commits, reports, format>
```

## Prompt lint checklist

Verify each block from § Prompt architecture is present, then check:

- Could an agent act on this prompt without guessing?
- Does the prompt avoid repo-specific assumptions unless provided?
- Are security and data-safety requirements stated where relevant?
- Could another agent continue from the output without rediscovery?

## Orchestration design checklist

- Is the DAG acyclic with no circular dependencies?
- Does every task have a definition of done with verifiable criteria?
- Are parallel tasks truly independent (no shared file paths)?
- Is interleaved verification enforced between sequential stages?
- Is the CI pipeline defined as the final deterministic gate?
- Are agents instructed to load relevant domain skills for their task context?
- For agents without worktree isolation: are overlapping file-set writes dispatched sequentially?
- Has the specification been defined before implementation begins?
- Were test definitions drafted before implementation dispatch (pipeline-level TDD)?
- Are parallel agents isolated via worktrees or separate directories?
- Is the max parallel agent count ≤ 5?
- Are escalation conditions defined for ambiguous or contradictory goals?

## Examples

### Pair 1 — Feature implementation prompt

**BAD:**
```
Fix the search feature. It's slow and doesn't work well.
Users are complaining. Make it better and add tests.
```
Problems: Wish Prompt ("make it better"), Implicit Scope (which search feature? what files?), Test-Free Done (no success criteria), missing context (no paths, no current behavior, no perf numbers).

**GOOD:**
```
Objective: Reduce P95 latency of GET /api/search from 1200ms to under 300ms.

Context: Search handler in src/api/search.ts queries Postgres via
src/db/queries.ts#searchProducts. Current EXPLAIN output in
docs/search-explain.md shows sequential scan on `products`.

Scope:
  In scope: src/api/search.ts, src/db/queries.ts, related test files.
  Out of scope: UI changes, other API endpoints, schema migrations.

Constraints: Must use existing Postgres indexes or add new ones via migration.
No external search engines.

Validation: `npm test -- --grep search` passes. `k6 run tests/perf/search.js`
reports P95 < 300ms.

Done when: Tests green, perf target met, migration file included.
```

### Pair 2 — Task decomposition

**BAD:**
```json
{ "task": "Refactor the authentication system", "agent": "coder" }
```
Problems: Not atomic, no dependencies, no verifiable done, vague assignee.

**GOOD:**
```json
[
  {
    "task_id": "map-auth-flow",
    "description": "Map JWT auth flow from login through token refresh in src/auth/",
    "assignee_role": "explorer",
    "dependencies": [],
    "context_paths": ["src/auth/"],
    "skills": [],
    "execution_strategy": "sequential",
    "definition_of_done": "Code map covers login, token issue, refresh, and logout paths"
  },
  {
    "task_id": "design-auth-refactor",
    "description": "Design stateless JWT architecture replacing session-based auth",
    "assignee_role": "architect",
    "dependencies": ["map-auth-flow"],
    "context_paths": ["src/auth/", "docs/auth-requirements.md"],
    "skills": ["auth-patterns"],
    "execution_strategy": "sequential",
    "definition_of_done": "Architecture plan with file-level change list and interface definitions"
  },
  {
    "task_id": "implement-token-service",
    "description": "Implement TokenService class in src/auth/token-service.ts per architecture plan",
    "assignee_role": "implementer",
    "dependencies": ["design-auth-refactor"],
    "context_paths": ["src/auth/token-service.ts", "src/auth/types.ts"],
    "skills": ["auth-patterns"],
    "execution_strategy": "parallel",
    "definition_of_done": "npm test -- --grep TokenService passes with >90% branch coverage"
  }
]
```

### Pair 3 — Subagent delegation

**BAD:**
```
Review the PR and fix any issues. Make sure it follows best practices.
```
Problems: Wish Prompt ("fix any issues," "best practices"), Implicit Scope (entire PR? which docs?), Missing Escape Hatch (what if conflicts exist?), consultant-speak.

**GOOD:**
```
Task: Address all 4 review comments on PR #342 so the PR passes CI and is merge-ready.
Context: Review comments on src/auth/session.ts (token expiry logic) and
  src/auth/session.test.ts (missing edge case). Read via `gh pr view 342 --comments`.
Constraints: Do not change the public API signature of refreshToken().
Expected output: One commit per resolved comment in src/auth/session.ts and test file.
Validation: `npm test` passes. `npm run lint` passes. No unresolved review threads.
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
- Help me phrase this task for Copilot / an AI agent
- How do I design a multi-agent workflow?
- How do I break down a complex task for multiple agents?
- What orchestration pattern should I use?
- How do I prevent agents from conflicting with each other?
- How do I set up verification loops between agents?
- How do I coordinate parallel agent execution?
- How do I handle merge conflicts between parallel agents?
- What is spec-driven development for agent pipelines?
- How should I sequence exploration, specification, and implementation?
- Should I write tests before dispatching implementation agents?
