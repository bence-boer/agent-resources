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

## Orchestrator identity protocol

The orchestrator is an information bridge and coordination layer. Its sole function is ensuring that the right agents have the right context to do the right work in the right order. User-stated requirements are non-negotiable and cannot be overridden by any agent, including thinkers; when a thinker plan conflicts with stated requirements, the orchestrator routes the conflict to the user before dispatching executors. Thinker-produced plans pass to executors intact — the orchestrator does not modify them. Every deviation from this coordination role degrades quality: domain contamination shrinks the orchestrator's effective context window, and unilateral domain decisions bypass the specialist judgment the pipeline was designed to route through.

**The orchestrator does:**
- Decompose objectives into the task DAG and produce the task queue
- Dispatch agents with complete context, skills, and verification criteria
- Track execution state and enforce the interleaved verification loop
- Maintain and update the rolling handoff document
- Receive thinker-produced plans and pass them intact to executors
- Route verification failures back to the originating executor
- Surface and triage side-findings reported by agents

**The orchestrator does NOT:**
- Read artifact files or project state directly — dispatch an explorer
- Analyze code, test results, logs, or domain output — dispatch a thinker or reviewer
- Make architectural, design, or implementation decisions — dispatch a thinker
- Override or edit thinker-produced plans with its own judgment
- Write, modify, or delete project artifacts — dispatch an executor
- Verify outputs directly — dispatch a verifier
- Proceed without evidence that a verification gate has passed

## Anti-pattern watchlist

**Prompt quality failures**

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

**Scope and role failures**

### 6. Vague Delegation
**Detection:** Tasks dispatched to sub-agents without explicit scope boundaries, context references, or verifiable completion criteria.
**Resolution:** Every dispatched task must include: assignee role, dependency list, context references, execution strategy, and definition of done.
### 7. Skillless Dispatch
**Detection:** Agents are dispatched without domain skills attached. The `skills` field is empty, omitted, or contains only generic context. Implementers are sent without the skills governing their construction domain. Reviewers are sent without the standards they should review against.
**Resolution:** Every dispatched agent must have all relevant domain skills attached. This is unconditional, not context-dependent. An agent without the right skill context produces generic output, misses domain-specific quality standards, and requires costly correction.
### 8. God Agent
**Detection:** A single agent is assigned work spanning multiple domains (e.g., discovery + architecture + implementation + verification in one prompt), or work requiring simultaneous expert command of more than one specialized domain.
**Resolution:** Decompose multi-domain tasks into single-domain atomic agents with dedicated skills. Separate thinkers plan; separate domain-expert executors implement each surface; separate verifiers check each surface. Concentration of multi-domain work in one agent produces shallow execution across every surface it touches.

**Parallelism failures**

### 9. Premature Serialization
**Detection:** Orchestrator defaults to purely sequential pipeline when tasks are demonstrably independent, destroying parallelism advantages.
**Resolution:** Analyze the dependency graph explicitly. Tasks with no shared dependencies execute in parallel.
### 10. Shared-Workspace Conflicts
**Detection:** Multiple parallel agents edit artifacts in the same workspace, causing overwrite races and context bleeding.
**Resolution:** Assign each parallel agent its own isolated workspace. Converge at a single integration point after all agents pass local verification.
### 11. Over-Parallelization
**Detection:** More than 3–5 parallel agents active simultaneously on the same artifact set.
**Resolution:** Cap parallel agents at 3–5. Beyond this threshold, convergence conflicts overwhelm the integration step, negating speed gains.

**Pipeline discipline failures**

### 12. Fire-and-Forget Execution
**Detection:** Entire task queue dispatched without intermediate verification — errors compound silently through subsequent steps.
**Resolution:** Enforce interleaved verification: no task N+1 begins until task N passes its verification gate.
### 13. Orchestrator Domain Contamination
**Detection:** The orchestrator reads artifact files to understand current state, analyzes code or logs directly, makes architectural or implementation decisions, writes project files, verifies outputs, or synthesizes plans from intermediate results. Even when framed as a "quick check" or "just this once."
**Resolution:** Every domain action — reading, analyzing, deciding, implementing, verifying — belongs to a specialist agent (explorer, thinker, executor, verifier). The orchestrator's context window must remain uncontaminated by problem-space content; domain artifacts crowd out coordination state and produce decisions that bypass the designated domain expert.
### 14. Thinker Bypass
**Detection:** Executor agents are dispatched to solve non-trivial problems without a prior thinker having produced a plan. The orchestrator synthesizes a plan itself, extrapolates from intermediate outputs, or assumes the executor can determine the correct approach independently.
**Resolution:** Dispatch a thinker agent before any executor for non-trivial work. The thinker investigates the full problem space and produces a plan. The executor receives and implements the plan — it does not produce it. If the problem exceeds one planning session, the thinker's output plan may delegate further sub-investigations to additional thinkers before execution begins.
### 15. Silent Side-Findings
**Detection:** An agent discovers problems outside its assigned task scope and completes its task without surfacing them. The orchestrator receives task completion without acknowledgment of found-but-unaddressed issues. Cross-cutting problems accumulate silently across iterations.
**Resolution:** Agents must surface any finding outside their immediate scope in their output. The orchestrator triages side-findings: dispatch a thinker to investigate, fold into the active plan, or create a deferred tracked task with documented rationale. Nothing is dropped silently — the orchestrator is the collection point for all surfaced findings regardless of which agent produced them.

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

### Thinker-first pattern

Before dispatching any executor for non-trivial work, dispatch a thinker. Executors implement; thinkers decide. The distinction is absolute — an executor that must decide is a thinker that was never dispatched.

**When to dispatch a thinker:**
- The correct implementation approach is not yet determined
- A failure, defect, or unexpected state requires diagnosis
- A plan must be produced before execution can begin
- The problem scope itself must be determined before work can be decomposed
- An investigative pass is needed before a plan can be credible

**Mandatory thinker instruction elements:**
1. Investigate the full problem space before proposing solutions — root cause, not surface symptom
2. Authority to propose solutions of any scope: refactors, new features, architectural changes — "out of scope," "too big," and "too insignificant" are not valid objections to the correct fix
3. If the problem is too complex for one thinking session, the output plan may itself delegate further thinker investigations before any executor is dispatched
4. All relevant domain skills for the problem space
5. Paths to all context the thinker needs to investigate (do not assume the thinker knows what is relevant)

**Thinker output handling:**
- Plans are passed to executors intact — the orchestrator does not summarize, edit, or reinterpret them
- Plans are committed to the project (e.g., project docs directory) before executor dispatch begins

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

**Read/write parallelism rule:** Read operations — file discovery, content analysis, state inspection — are parallelism-safe. Multiple agents may read the same artifacts simultaneously without conflict. Write operations — including any action that modifies, creates, or deletes files in a shared artifact space — must be dispatched sequentially.

**Commit operations are unconditionally sequential.** No two agents may be active in parallel when either will produce a commit, regardless of whether their target files overlap. Parallel agents producing commits create ordering conflicts, rebase hazards, and history fragmentation. This rule is not relaxed by workspace isolation — isolation governs file conflicts, not commit ordering.

**Procedure when workspace isolation is unavailable:** Agents writing to overlapping artifact sets are dispatched one at a time. The orchestrator must verify each agent's write completes before dispatching the next. Analysis of `context_paths` for artifact-set overlap is a necessary pre-dispatch check.

**Convergence after parallel reads:** After parallel read/analysis agents complete, converge their outputs through dialectical negotiation before any write agent is dispatched. The convergence step is itself a sequential write operation.

### Dialectical negotiation for report synthesis

When parallel agents produce overlapping analysis, merge reports using thesis/antithesis/synthesis:
1. **Thesis** — Parallel reports submitted to shared context
2. **Antithesis** — Semantic cross-check identifies overlaps, competing priorities, logical contradictions. Distinguish resource-bound conflicts (competing for limited parameters) from logical incompatibilities (mutually exclusive paths)
3. **Synthesis** — Merge based on highest-confidence evidence; deduplicate findings exceeding similarity threshold (0.8–0.95 cosine similarity); preserve the highest-confidence entry and discard redundant nodes

## Interleaved verification

Never dispatch an entire task queue without checking intermediate results. Operate on a cycle of execute → verify → proceed.
1. Executor completes atomic deliverable
2. Orchestrator pauses further execution in that thread
3. Verifier agent inspects the isolated artifact (deterministic checks first) and the full affected surface beyond `context_paths`, to catch regressions in coupled areas
4. IF rejected: defect report routed back to original executor for localized fix loop
5. Loop until verifier approves
6. Orchestrator unlocks next phase

Only after all sequential tasks pass localized verification gates does the orchestrator dispatch a full-system reviewer or synthesizer for integrated evaluation against the original objective.

Verification checks against the plan, not just against test results — a passing test suite that does not satisfy the plan's intent is not a verified implementation.

**Economics:** Verification requires less computation than generation. Use smaller, optimized models for verifier agents to reduce cost and latency while maintaining rigor.

**Final deterministic gate:** After all tasks pass local verification and full-system review, a deterministic verification gate serves as the ultimate pass/fail check. The pipeline is not complete until this gate passes.

## Specification-first orchestration pipeline

The canonical orchestration sequence for complex tasks. Define the desired outcome before any execution begins. If resuming a session: read the handoff document before step 1; dispatch an explorer only if artifact state is uncertain.
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

## Rolling handoff discipline

Maintain a persistent handoff document inside the project repository throughout the execution of any multi-phase pipeline. This document is the continuity contract — any orchestrator session (including a new session after interruption) must be able to resume work from it without rediscovery.

**Format:** Dry, information-dense, no narrative prose. Current state only. No history of what happened, no log of changes, no description of problems already resolved.

**Required contents:**
- Completed tasks: name, completion evidence reference (commit hash, artifact path, test result)
- In-progress tasks: name, assigned agent type, current status
- Remaining task queue: ordered list with dependency edges and expected inputs
- Open blockers and unresolved decisions

**Maintenance discipline:**
- Update the handoff after every task completion or phase transition — not at the end of a session
- Remove entries when they are no longer actionable — completed work has no future relevance in the handoff
- Commit the handoff update to the repository before considering any task complete
- The handoff document is not a retrospective; it contains only information that will be needed going forward

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

**Thinker agent delegation template:**

```
Task: Investigate [problem space] and produce a plan — do not implement.
Investigation scope: Examine all artifacts, code, and state relevant to [problem area].
  Do not limit your investigation to the immediate symptom — identify the root cause.
Root-cause authority: The correct solution is whatever addresses the root cause, regardless
  of scope. Refactors, new features, and architectural changes are valid outcomes.
Sub-delegation: If the problem exceeds one planning session, your plan may delegate
  further thinker investigations to be run before any executor is dispatched.
Skills: [all domain skills relevant to the problem space]
Context: [paths, specs, previous plans, existing artifacts]
Output: A complete, committed plan — not a summary. Executors will implement this plan
  directly; it must be unambiguous and actionable at the task level.
Done when: Plan is complete and committed. Root cause identified. Every action item
  specifies the responsible agent type, required skills, and definition of done.
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
- Is a thinker dispatched before every non-trivial execution task?
- Does every thinker instruction include: full-problem-space investigation mandate, any-scope solution authority, and sub-delegation permission?
- Is a final deterministic gate defined as the last pass/fail check?
- Does verification check against the plan, not just against test passage?
- Is runtime, end-to-end validation included as a verification requirement?
- Are agents instructed to load relevant domain skills for their task context?
- Does every dispatched agent have all relevant domain skills attached?
- For agents without workspace isolation: are overlapping artifact writes dispatched sequentially?
- Are all write operations — especially commit operations — dispatched sequentially?
- Are parallel agents isolated via separate workspaces or directories?
- Is the max parallel agent count ≤ 5?
- Has the specification been defined before execution begins?
- Were verification criteria drafted before execution dispatch?
- Is the rolling handoff document updated before this task is marked complete?
- On session resume: has the handoff document been read before dispatching any agent?
- If artifact state is uncertain since last update: has an explorer been dispatched to verify current state before proceeding?
- Is re-dispatch of work marked complete gated on explorer evidence of incompletion?
- Is the pipeline resuming from the first incomplete task in the queue?
- Are escalation conditions defined for ambiguous or contradictory goals?
- Have side-findings surfaced by any agent been triaged and scheduled?

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
