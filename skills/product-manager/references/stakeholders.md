# Stakeholders

Frameworks for mapping organizational influence, clarifying decision roles, and structuring difficult conversations. Use when aligning teams, preparing for launches, or navigating conflicting priorities.

## Power-Interest Grid

Classifies stakeholders by their power to affect the product and their interest in it. Determines communication strategy for each group.

### The grid

| | High Interest | Low Interest |
| --- | --- | --- |
| **High Power** | **Manage closely** — regular, detailed engagement | **Keep satisfied** — high-level updates, don't surprise them |
| **Low Power** | **Keep informed** — feedback loops, beta access, transparent roadmaps | **Monitor** — periodic reporting, minimal effort |

### Stakeholder types

| Quadrant | Typical roles | Communication approach |
| --- | --- | --- |
| High Power, High Interest | Executive sponsors, VP/C-suite with product ownership | Weekly or biweekly strategic updates. Involve in key decisions. Proactive, not reactive. |
| High Power, Low Interest | Legal, Finance, Risk, Compliance | Summary updates at milestones. Surface blockers early. Don't waste their time with details. |
| Low Power, High Interest | Support teams, end-users, beta testers | Regular feedback sessions. Beta access. Transparent roadmap. They become advocates if treated well. |
| Low Power, Low Interest | Tangential departments, external observers | Quarterly newsletter or status page. Minimal active management. |

### How to use

1. List all stakeholders by name and role.
2. Place each on the grid based on their actual (not theoretical) power and interest.
3. Set a communication cadence for each quadrant.
4. Review the grid at the start of each major initiative — power and interest shift.

### Anti-patterns

- Treating all stakeholders the same (wastes effort on low-priority groups, under-serves high-priority ones)
- Assuming executives with nominal oversight are low-interest (they may have hidden political stakes)
- Never updating the grid as the project evolves

---

## RACI Matrix

Assigns decision roles for specific initiatives or workstreams. Eliminates ambiguity about who does what.

### Roles

| Role | Definition | Rule |
| --- | --- | --- |
| **Responsible** | Does the work | At least one per task. Can be multiple people. |
| **Accountable** | Final decision-maker. Owns the outcome. | Exactly one per task. Never more. |
| **Consulted** | Provides input before a decision is made | Two-way communication. Their expertise matters. |
| **Informed** | Told about decisions after they're made | One-way communication. No decision authority. |

### How to build one

1. List the major deliverables or decisions down the left column.
2. List the teams or roles across the top.
3. Assign exactly one A (Accountable) per row.
4. Assign R (Responsible) to whoever does the work.
5. Mark C for people whose input is needed before the decision.
6. Mark I for people who need to know after.

### Output template

```
Initiative: [name]

| Deliverable | PM | Engineering | Design | Marketing | Legal |
|-------------|-----|-------------|--------|-----------|-------|
| Feature spec | A,R | C | C | I | I |
| Technical design | C | A,R | I | I | I |
| UI design | C | C | A,R | I | I |
| Launch plan | A | I | I | R | C |
| Legal review | I | I | I | I | A,R |
```

### Anti-patterns

- Multiple A's per row (no single owner = no accountability)
- No R assigned (work has an owner but nobody doing it)
- Everyone marked C (too many cooks — slows decisions)
- Building the matrix but never referring to it during execution

---

## Structuring difficult feedback

A template for delivering feedback in cross-functional settings where the PM has no direct authority. Useful when declining feature requests, pushing back on timelines, or addressing performance gaps.

### The structure

1. **State the specific observation.** What happened, when, and what was the impact? No interpretation, just facts.
2. **Explain why it matters.** Connect to a shared goal, metric, or deadline — not personal preference.
3. **State what needs to change.** Be direct about the requested action or behavior.
4. **Offer support.** What will you do to help make the change possible? This is not optional — skipping it signals you're assigning blame, not solving a problem.

### Template

```
Observation: [specific event/behavior + when + impact on what]
Why it matters: [connection to shared goal or metric]
Change needed: [specific, actionable request]
My commitment: [what I'll do to support this]
```

### Examples of when to use

- Declining a feature request from a stakeholder: state the observation (request X), why it doesn't fit (doesn't move metric Y, conflicts with priority Z), what you recommend instead, and what you'll do to help them achieve their underlying goal.
- Pushing back on an unrealistic timeline: state the scope and current capacity, why the timeline creates risk, propose an alternative, and commit to what you can deliver.
- Addressing a delivery gap: state what was expected vs. delivered, the downstream impact, what needs to happen next, and what resources or support you'll provide.

### Anti-patterns

- Vague feedback ("things could be better") — unusable, creates confusion
- Feedback without connection to shared goals — sounds like personal criticism
- All challenge, no support — burns trust and makes future collaboration harder
- Avoiding the conversation entirely — problems compound; undelivered feedback is a PM failure mode
