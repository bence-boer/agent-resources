# Failure Modes Reference

> Focused extract of the MAST (Multi-Agent System Testing) taxonomy relevant to individual agent design. Read this when building agents for teams, when debugging why an agent produces poor output, or when a user reports that agents are stepping on each other's toes.

---

## Scope

The full MAST taxonomy covers 14 failure modes across communication, coordination, and quality categories. This reference covers the subset that affects **individual agent design** — failure modes preventable through better agent definitions. Team-level failures (deadlock, livelock, groupthink) are out of scope here.

---

## FM-2.3: Role Confusion

**What happens:** An agent performs tasks outside its defined scope, duplicating or contradicting another agent's work.

**Detection signals:**
- Two agents produce overlapping outputs on the same topic
- An agent addresses topics listed in its "does not do" section
- Agent produces artifacts not described in its prompt

**Prevention:**
- Every agent prompt must include explicit scope boundaries (what it does NOT do)
- When building for a team, cross-reference scope sections to verify no overlap
- Decision categories must be specific. "Technical decisions" is too broad. "Technology selection within approved stack" is checkable

---

## FM-3.1: Rubber-Stamp Approval

**What happens:** A review agent approves work without meaningful critique. Every review comes back positive.

**Detection signals:**
- Review output contains only praise
- No issues identified across multiple review cycles
- Feedback is generic, not specific to the artifact reviewed

**Prevention:**
- Any agent with a review responsibility must have prompt instructions mandating issue identification
- Include a findings structure in the expected output
- Frame the review role as finding defects, not "reviewing"
- Add this anti-pattern to the prompt of every reviewer agent

---

## FM-3.2: Error Cascading

**What happens:** An error in an early-stage agent's output propagates through subsequent agents, amplifying at each step.

**Detection signals:**
- Final output contains errors traceable to early-stage decisions
- Downstream agents confidently build on upstream mistakes

**Prevention:**
- Every agent receiving input from another agent should validate incoming artifacts before proceeding
- Include in scope boundaries: "escalate when incoming artifact appears inconsistent or incomplete"

---

## FM-3.3: Capability Saturation

**What happens:** An agent is asked to perform a task beyond its effective capability. Instead of acknowledging limitations, it produces confident but low-quality output.

**Detection signals:**
- Output is fluent and well-formatted but factually incorrect or logically flawed
- Agent does not flag uncertainty
- Agent produces generic advice instead of specific guidance

**Prevention:**
- Define explicit capability boundaries in scope
- Include a prompt instruction: "If a task requires knowledge outside your domain, acknowledge the limitation and escalate"
- Domain vocabulary must be deep and precise, not broad and shallow

---

## FM-1.2: Misinterpretation

**What happens:** A receiving agent interprets an artifact differently than the sender intended. Both agents believe they are correct.

**Detection signals:**
- Downstream output is coherent but addresses a different problem than upstream specified
- Key terms are used with different meanings by different agents

**Prevention:**
- When building team agents, ensure prompts describe expected input/output artifact formats
- Include verification: "After receiving input, summarize your understanding before proceeding"
- Shared vocabulary terms should be consistent across interacting agents

---

## FM-2.4: Authority Vacuum

**What happens:** A necessary decision falls outside all agents' defined authority. No agent acts. Progress stalls.

**Detection signals:**
- Progress stalls with no circular dependency
- Decision requests go unanswered or are deflected
- Agents produce outputs that carefully avoid committing to the unmapped decision

**Prevention:**
- When building team agents, enumerate known decision categories and verify complete coverage
- Every agent should have a default escalation path for unmapped decisions
- Include cross-cutting concerns (security, compliance, performance) in at least one agent's scope

---

## Prevention Checklist

| Check | Prevents | How to Verify |
|---|---|---|
| Scope boundaries with 3+ "does not" items | FM-2.3 Role Confusion | Count boundary items |
| No authority overlap with team members | FM-2.3 Role Confusion | Cross-reference scope sections |
| Review agents mandate issue-finding | FM-3.1 Rubber-Stamp | Check prompt for adversarial review instructions |
| Input validation mentioned in prompt | FM-3.2 Error Cascading | Check for incoming artifact validation |
| Capability boundaries stated | FM-3.3 Capability Saturation | Check scope for complexity limits |
| Escalation for unknown situations | FM-3.3 Capability Saturation | Check for uncertainty escalation |
| Artifact formats described | FM-1.2 Misinterpretation | Check prompt for format expectations |
| Default escalation path exists | FM-2.4 Authority Vacuum | Check for catch-all escalation |

---

*Source: MAST framework — Multi-Agent System Testing taxonomy*
