---
name: agent-orchestrator
description: >
  Multi-agent orchestration and prompt engineering framework for complex task
  pipelines. Covers task decomposition into Directed Acyclic Graphs, orchestration
  pattern selection (sequential, parallel, hierarchical, blackboard), Brain/Heart
  architecture separation, workspace isolation for parallel agents,
  specification-first pipeline design, interleaved verification loops,
  execution-ready prompt design (chain-of-thought, few-shot, structured output
  forcing), and agent dispatch coordination. Use when orchestrating multi-agent
  workflows, decomposing tasks for agent swarms, writing agent prompts, designing
  verification pipelines, or delegating subtasks. Trigger on any orchestration,
  multi-agent coordination, or agent prompt task — even informal ("coordinate
  these agents", "break this into tasks", "write a better prompt", "help me
  phrase this"). Do NOT use for creating agent profiles or skill definitions
  (those have dedicated skills), or general creative writing.
---

# Agent Orchestrator

Write execution-ready agent prompts and design multi-agent orchestration pipelines that decompose complex objectives into verified, atomic work units.

## Expert vocabulary

**Prompt Engineering:** chain-of-thought prompting (Wei et al.), few-shot prompting (Brown et al.), retrieval-augmented generation (Lewis et al.), instruction tuning (Ouyang et al.), structured output forcing

**Task Decomposition & Orchestration:** task decomposition (Khot et al.), Directed Acyclic Graph (DAG), subtask delegation, fan-out/fan-in delegation, atomic task, definition of done, Brain/Heart separation, sequential pipeline, parallel execution, hierarchical routing, blackboard pattern (Engelmore & Morgan)

**Conflict Resolution & State:** workspace isolation, convergence point, dialectical negotiation, semantic deduplication

**Evaluation & Constraints:** acceptance criteria, interleaved verification loop, generator-evaluator harness, deterministic check, exit criteria, negative constraints, scope fencing

**Retrieval Anchors:** context window management, progressive disclosure, grounding

## Anti-pattern watchlist

### 1. Wish Prompt
**Detection:** Prompt uses "improve," "fix," "make better," "clean up" without a measurable target or end-state.
**Resolution:** Replace vague verb with specific outcome + observable metric. "Fix the analysis" → "Recompute all totals in the Q3 report so every row sum matches the column total within ±0.01."

### 2. Context Dump
**Detection:** Prompt pastes entire files, full docs, or long logs without indicating which parts matter.
**Resolution:** Excerpt only relevant sections; annotate each excerpt with its purpose ("this section shows the current pricing structure; the agent must update the discount tiers").

### 3. Missing Escape Hatch
**Detection:** No fallback behavior for when the agent gets stuck, hits ambiguity, or encounters unexpected state.
**Resolution:** Add explicit blocker-handling: "If X is unclear, do Y. If the approach fails after 3 attempts, stop and report the exact blocker and what you tried."

### 4. Implicit Scope
**Detection:** No explicit in-scope / out-of-scope boundaries; agent must guess what it may touch.
**Resolution:** Add scope block listing included surfaces and explicit exclusions. "In scope: competitor pricing data, discount formulas. Out of scope: branding guidelines, customer communications."

### 5. Test-Free Done
**Detection:** Definition of done has no verifiable checks — just "make sure it works" or "it should be correct."
**Resolution:** Add concrete verification: specific validation checks, expected outputs, acceptance criteria, or automated gates that produce pass/fail evidence.

### 6. Premature Serialization
**Detection:** Orchestrator defaults to purely sequential pipeline when tasks are demonstrably independent, destroying parallelism advantages.
**Resolution:** Analyze the dependency graph explicitly. Tasks with no shared dependencies execute in parallel.

### 7. Vague Delegation
**Detection:** Tasks dispatched to sub-agents without explicit scope boundaries, context references, or verifiable completion criteria.
**Resolution:** Every dispatched task must include: assignee role, dependency list, context references, execution strategy, and definition of done.

### 8. Fire-and-Forget Execution
**Detection:** Entire task queue dispatched without intermediate verification — errors compound silently through subsequent steps.
**Resolution:** Enforce interleaved verification: no task N+1 begins until task N passes its verification gate.

### 9. Shared-Workspace Conflicts
**Detection:** Multiple parallel agents edit artifacts in the same workspace, causing overwrite races and context bleeding.
**Resolution:** Assign each parallel agent its own isolated workspace. Converge at a single integration point after all agents pass local verification.

### 10. Over-Parallelization
**Detection:** More than 3–5 parallel agents active simultaneously on the same artifact set.
**Resolution:** Cap parallel agents at 3–5. Beyond this threshold, convergence conflicts overwhelm the integration step, negating speed gains.

## Owned surface and non-goals

**This skill owns:**
- Multi-agent orchestration — decomposing objectives into agent task DAGs
- Prompt engineering — writing execution-ready instructions for agents
- Orchestration pattern selection — sequential, parallel, hierarchical, blackboard
- Conflict resolution between parallel agents — workspace isolation, convergence, dialectical negotiation
- Interleaved verification — execute-verify-proceed cycles between pipeline stages
- Specification-first pipeline design — the canonical 10-step coordination sequence

**Non-goals:**
- Domain-specific process knowledge (lifecycle phases, industry standards, specialized procedures — those belong to domain skills)
- Agent profile or skill definition authoring (those have dedicated skills)
- Direct execution of domain work — this skill coordinates; domain skills provide the content

When composed with domain skills, this skill provides the coordination framework — the domain skill provides the content requirements for each task.

## Prompt architecture

Use these blocks in order when writing any agent prompt. Omit only when truly irrelevant.

1. **Objective** — What must be achieved, in one sentence. Required end state, not process trivia.
2. **Context and resources** — Exact files, paths, docs, URLs, data sources, or references. Source-of-truth references and precedence if multiple sources conflict.
3. **Scope boundaries** — In-scope surfaces and explicit non-goals. Coupled areas to check for downstream effects.
4. **Constraints** — Security, compatibility, performance, resource, policy, or tooling limits. Forbidden actions.
5. **Execution expectations** — Required approach (explore first, then act; prefer existing patterns; use relevant domain skills), delegation requirements for subagents.
6. **Validation and definition of done** — Which checks must pass. Required end-to-end validations. Completion rule.
7. **Deliverables** — Exact expected outputs (artifacts, reports, diffs, summaries). Required response style (summary, evidence, next steps).

## Prompt quality rules

- Prefer concrete nouns over vague language
- Replace "improve/fix/restructure" with measurable targets
- Specify order when order matters
- State tradeoff priorities when they conflict (correctness > speed)
- Demand evidence for claims ("include the check result or source reference")
- Include fallback behavior for blockers (try alternatives, then return exact blocker + evidence)
- When dispatching agents, specify which domain skills to load for the task context

## Orchestration architecture

### Brain/Heart separation

Decouple the stateless planning layer (Brain) from the stateful execution layer (Heart). Fusing these into a single entity creates systemic fragility — execution failures crash the strategic plan.

**Brain (Planner):** Evaluates the objective, discovers available agents and domain skills, loads system context, and decomposes the request into a structured task DAG. Stateless per request. Provides execution strategy hints (parallel vs sequential) based on the dependency graph. Does not perform domain work.

**Heart (Executor):** Receives the task DAG, tracks dynamic execution state, manages retry logic, enforces timeouts, aggregates results. Stateful per execution. Houses the execution strategy engine that dictates operational flow based on the Brain's plan.

Independent scaling and isolated failure domains: a sub-agent error managed by the Heart does not corrupt the Brain's strategic plan, allowing recovery without losing trajectory.

### Orchestration execution patterns

Select the pattern based on the task graph topology:

| Pattern | Mechanism | Use when | Hazards |
|---------|-----------|----------|---------|
| Sequential Pipeline | Linear chain — each agent processes validated output of the preceding agent | Clear stage dependencies with ordered refinement | Early failures propagate unchecked; maximum latency |
| Parallel Execution | Multiple agents work simultaneously on independent subtasks, converging at an aggregator | Independent tasks with no shared artifact paths | Resource-intensive; conflicts if boundaries not isolated |
| Hierarchical Routing | Coordinator delegates dynamically based on intermediate results | Complex unpredictable tasks requiring real-time capability assessment | Infinite delegation loops; non-deterministic execution path |
| Blackboard | Shared knowledge repository — agents read/write asynchronously | Cross-domain synthesis, complex conflict resolution | Context overflow from unstructured accumulation |

The dependency graph determines the pattern — never parallelize tasks with sequential dependencies.

## Task decomposition

Decompose complex objectives into atomic work units. Every subtask must satisfy four properties:

1. **Atomic** — Cannot be meaningfully subdivided without losing critical context
2. **Independently verifiable** — Success checked via automated checks, defined criteria, or deterministic evaluation — no subjective self-evaluation
3. **Independent** — Minimal overlapping dependencies with concurrent subtasks — no race conditions
4. **Bounded** — Clear scope parameters and explicit completion criteria signaling the executor to terminate

### Task schema

Output decomposition as structured JSON. This schema is the universal interface between the planning and execution layers:

| Field | Type | Purpose |
|-------|------|---------|
| `task_id` | string | Unique identifier for DAG tracking |
| `description` | string | Precise, measurable objective — vague verbs ("improve," "optimize") prohibited |
| `assignee_role` | string | Agent archetype required (explorer, planner, executor, verifier) |
| `dependencies` | array | Preceding task_ids that must reach COMPLETED before dispatch |
| `context_paths` | array | File paths, URLs, or reference boundaries the agent may ingest |
| `execution_strategy` | string | parallel, sequential, or background |
| `definition_of_done` | string | Exact verification check, acceptance metric, or completion evidence |
| `skills` | array | Domain skills the agent should load for task context |

Forcing the planner to articulate the definition of done before dispatch prevents the test-free-done anti-pattern at the architectural level.

## Conflict resolution

### Workspace isolation

For parallel execution, assign each sub-agent its own isolated workspace with independent state. Isolation allows concurrent work without resource-locking conflicts.

**Process:** Dispatch → agents work in isolated environments → local verification passes → orchestrator converges results at a single integration point → resolve conflicts deterministically at convergence time.

**Scaling limit:** 3–5 concurrent agents. Beyond this, convergence conflict volume overwhelms clean integration.

### Sequential write discipline

When workspace isolation is unavailable, agents writing to overlapping artifact sets must be dispatched sequentially. Parallel agents cannot coordinate and will overwrite each other's changes. The orchestrator must analyze `context_paths` for artifact-set overlap before choosing parallel vs sequential execution.

### Dialectical negotiation for report synthesis

When parallel agents produce overlapping analysis, merge reports using thesis/antithesis/synthesis:

1. **Thesis** — Parallel reports submitted to shared context
2. **Antithesis** — Semantic cross-check identifies overlaps, competing priorities, logical contradictions. Distinguish resource-bound conflicts (competing for limited parameters) from logical incompatibilities (mutually exclusive paths)
3. **Synthesis** — Merge based on highest-confidence evidence; deduplicate findings exceeding similarity threshold (0.8–0.95 cosine similarity); preserve the highest-confidence entry and discard redundant nodes

## Interleaved verification

Never dispatch an entire task queue without checking intermediate results. Operate on a cycle of execute → verify → proceed.

1. Executor completes atomic deliverable
2. Orchestrator pauses further execution in that thread
3. Verifier agent inspects the isolated artifact (deterministic checks first)
4. IF rejected: defect report routed back to original executor for localized fix loop
5. Loop until verifier approves
6. Orchestrator unlocks next phase

Only after all sequential tasks pass localized verification gates does the orchestrator dispatch a full-system reviewer or synthesizer for integrated evaluation against the original objective.

**Economics:** Verification requires less computation than generation. Use smaller, optimized models for verifier agents to reduce cost and latency while maintaining rigor.

**Final deterministic gate:** After all tasks pass local verification and full-system review, a deterministic verification gate serves as the ultimate pass/fail check. The pipeline is not complete until this gate passes.

**Comprehensive scope:** Verifiers should check the full affected surface — not just the artifacts listed in `context_paths` — to catch regressions in coupled areas.

## Specification-first orchestration pipeline

The canonical orchestration sequence for complex tasks. Define the desired outcome before any execution begins:

1. **Discover** — Dispatch explorer agents to map the current state and build knowledge models of affected areas
2. **Specify** — Define the desired end state, behavioral rules, and acceptance criteria as a specification. No execution yet
3. **Plan** — Project the specification onto the current-state model. Produce a structured plan with artifact-level changes and interface contracts
4. **Define verification** — Draft verification criteria based on the specification and plan before execution begins (pipeline-level test-first design)
5. **Decompose** — Break the plan into atomic agent tasks with a dependency graph and task queue
6. **Execute** — Dispatch executors sequentially or in isolated workspaces. Each produces verification evidence alongside deliverables
7. **Verify** — After each execution step, dispatch a verifier. Loop fix cycles locally until approved
8. **Review** — After all tasks pass verification, dispatch a reviewer for full-system evaluation against the original objective and specification
9. **Gate** — Final deterministic check must pass. Not done until the gate is green
10. **Clean up** — Remove scratch files, working notes, and intermediate planning artifacts that are not part of the declared deliverables before reporting completion

Steps 6–7 repeat per task. Steps 8–9 gate the entire pipeline. If the review or gate fails, route failures back to the appropriate step.

## Subagent delegation template

Use this when dispatching work to a subagent:

```
Task: <single responsibility objective>
Context: <relevant paths/files/specs only>
Constraints: <hard limits and forbidden actions>
Expected output: <exact artifacts/edits/report fields>
Validation: <checks to run and evidence to return>
Done when: <objective completion criteria>
```

## Rewriting weak prompts

For each vague prompt, identify which architecture blocks (§ Prompt architecture) are missing or weak, then add the minimum decision-critical detail to fill them. Do not pad with random detail.

## High-signal prompt template

Mirrors the architecture blocks. Fill each placeholder; omit only when truly irrelevant.

```
Objective: <single-sentence required end state>
Context: <paths, docs, data, refs>
Scope: In scope: <surfaces> | Out of scope: <surfaces> | Also validate: <adjacent>
Constraints: <hard limits> | Forbidden: <actions>
Execution: <approach, skills, delegation>
Validation / Done: <checks, acceptance criteria, stabilization>
Deliverables: <artifacts, reports, format>
```

## Prompt quality checklist

Verify each block from § Prompt architecture is present, then check:

- Could an agent act on this prompt without guessing?
- Does the prompt avoid context-specific assumptions unless provided?
- Are security and data-safety requirements stated where relevant?
- Could another agent continue from the output without rediscovery?

## Orchestration design checklist

- Is the DAG acyclic with no circular dependencies?
- Does every task have a definition of done with verifiable criteria?
- Are parallel tasks truly independent (no shared artifact paths)?
- Is interleaved verification enforced between sequential stages?
- Is a final deterministic gate defined as the last pass/fail check?
- Are agents instructed to load relevant domain skills for their task context?
- For agents without workspace isolation: are overlapping artifact writes dispatched sequentially?
- Has the specification been defined before execution begins?
- Were verification criteria drafted before execution dispatch?
- Are parallel agents isolated via separate workspaces or directories?
- Is the max parallel agent count ≤ 5?
- Are escalation conditions defined for ambiguous or contradictory goals?

## Examples

### Pair 1 — Supply chain optimization prompt

**BAD:**
```
Analyze the supply chain data. It's messy and needs to be better.
Find bottlenecks and make recommendations.
```
Problems: Wish Prompt ("needs to be better"), Implicit Scope (which data? what facilities?), Test-Free Done (no success criteria), missing context (no data sources, no deliverable format).

**GOOD:**
```
Objective: Identify the top 3 logistics bottlenecks causing delivery delays
exceeding 48 hours in the Southeast distribution network.

Context: Shipment logs in data/shipments-q3.csv (origin, destination, timestamps).
Facility capacity data in docs/warehouse-specs.md. Carrier SLA documents in
docs/carrier-contracts/.

Scope:
  In scope: Southeast region facilities (ATL, MIA, CLT), carrier performance metrics.
  Out of scope: Pricing renegotiation, fleet procurement, Western region facilities.

Constraints: Use only the provided data sources. Do not extrapolate beyond Q3 data.
All delay calculations must use actual vs SLA timestamps.

Validation: Every identified bottleneck cites specific shipment IDs and timestamps.
Delay distribution histogram covers all Southeast facilities.

Done when: Report contains bottleneck ranking table with root cause per facility,
delay distribution analysis, and 3 prioritized mitigation recommendations with evidence.
```

### Pair 2 — Task decomposition for curriculum restructuring

**BAD:**
```json
{ "task": "Redesign the engineering curriculum", "agent": "planner" }
```
Problems: Not atomic, no dependencies, no verifiable done, vague assignee.

**GOOD:**
```json
[
  {
    "task_id": "audit-current-curriculum",
    "description": "Map all 42 courses in the current engineering curriculum to learning outcomes, prerequisites, and credit hours",
    "assignee_role": "explorer",
    "dependencies": [],
    "context_paths": ["docs/course-catalog.md", "data/enrollment-history.csv"],
    "skills": [],
    "execution_strategy": "sequential",
    "definition_of_done": "Curriculum map table with all 42 courses showing outcomes, prerequisites, credit hours, and 3-year enrollment trends"
  },
  {
    "task_id": "identify-gaps",
    "description": "Compare current curriculum against accreditation body requirements and industry advisory board recommendations to identify coverage gaps",
    "assignee_role": "planner",
    "dependencies": ["audit-current-curriculum"],
    "context_paths": ["docs/accreditation-standards.md", "docs/advisory-board-report.md"],
    "skills": ["education-standards"],
    "execution_strategy": "sequential",
    "definition_of_done": "Gap analysis matrix mapping each accreditation requirement to current course coverage with gap/overlap classification"
  },
  {
    "task_id": "draft-revised-sequence",
    "description": "Propose revised 4-year course sequence resolving identified gaps while maintaining prerequisite chains and credit hour constraints",
    "assignee_role": "executor",
    "dependencies": ["identify-gaps"],
    "context_paths": ["docs/credit-hour-policy.md", "docs/faculty-capacity.md"],
    "skills": ["curriculum-design"],
    "execution_strategy": "parallel",
    "definition_of_done": "Revised sequence covers 100% of accreditation requirements, all prerequisite chains valid, total credits within 120–128 range"
  }
]
```

### Pair 3 — Subagent delegation for document review

**BAD:**
```
Review the report and fix any issues. Make sure it follows best practices.
```
Problems: Wish Prompt ("fix any issues," "best practices"), Implicit Scope (entire report? which sections?), Missing Escape Hatch (what if conflicting requirements?), consultant-speak.

**GOOD:**
```
Task: Resolve all 4 reviewer comments on the Q3 financial report so the report
passes editorial review and is ready for board distribution.
Context: Reviewer comments in docs/q3-report-feedback.md targeting sections 3.2
  (revenue projections) and 4.1 (risk assessment). Source data in data/q3-actuals.csv.
Constraints: Do not change the executive summary without CFO approval.
  All figures must trace to q3-actuals.csv.
Expected output: Updated report with tracked changes. Summary of each resolved comment.
Validation: All 4 comments addressed. Every figure in sections 3.2 and 4.1 has
  a source reference to q3-actuals.csv. No unresolved reviewer threads.
Done when: All comments resolved, editorial checklist passes, tracked changes visible.
```

## Questions this skill answers

- How do I write a good prompt for an agent?
- How should I structure instructions for an AI assistant?
- What makes an agent prompt execution-ready vs vague?
- How do I delegate a subtask to a subagent?
- How do I rewrite a weak or vague prompt into a strong one?
- What should I include in acceptance criteria for an agent task?
- How do I scope a prompt so the agent doesn't touch unrelated areas?
- What are common mistakes in agent prompts?
- How do I write a prompt for an analysis / review / planning / audit task?
- How do I phrase this task for an AI agent?
- How do I design a multi-agent workflow?
- How do I break down a complex task for multiple agents?
- What orchestration pattern should I use?
- How do I prevent agents from conflicting with each other?
- How do I set up verification loops between agents?
- How do I coordinate parallel agent execution?
- How do I handle conflicts between parallel agents?
- What is specification-first design for agent pipelines?
- How should I sequence discovery, specification, and execution?
- Should I define verification criteria before dispatching agents?
