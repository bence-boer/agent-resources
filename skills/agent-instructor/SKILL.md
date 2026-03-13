---
name: agent-instructor
description: >
  Prompt engineering framework for writing execution-ready instructions for coding agents.
  Use whenever drafting, rewriting, or reviewing prompts for implementation, bug fixing,
  refactoring, audits, handoffs, or subagent delegation. Trigger this skill even when the
  request is informal ("help me phrase this", "write a better prompt", "make this actionable").
---

# Agent Instructor

Design prompts that are unambiguous, testable, and execution-ready on first pass.

## Outcome standard

A good prompt makes the agent able to act without guessing:

- clear objective
- complete context
- explicit constraints
- measurable acceptance criteria
- required output format

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

Before sending a prompt, verify:

- Can an agent identify the exact goal in under 10 seconds?
- Are all required resources explicitly listed?
- Are scope boundaries and exclusions explicit?
- Are constraints enforceable and non-contradictory?
- Is the validation plan concrete and sufficient?
- Is “done” objectively measurable?
- Are deliverables concrete and formatted?
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

If input is vague, rewrite by adding:

- missing objective precision
- missing context/resources
- explicit constraints
- executable validation criteria
- precise output contract

Do not add random detail. Add only decision-critical detail.

## High-signal prompt template

```md
Objective:
<exact outcome and why it matters>

Context:
<paths/docs/logs/refs the agent must use>

Scope:
In scope: <surfaces>
Out of scope: <surfaces>
Also validate: <adjacent areas>

Constraints:
<security/perf/policy/tool/model constraints>
Forbidden: <destructive or shortcut behavior>

Execution:
<required approach, skills, delegation rules>

Validation / Definition of done:
<checks, CI expectations, E2E expectations, stabilization loop>

Deliverables:
<files/commits/reports and response format>
```
