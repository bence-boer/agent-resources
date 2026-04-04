---
name: product-manager
description: Product management decision frameworks covering discovery, prioritization, metrics, go-to-market, stakeholder alignment, and lifecycle management. Use when prioritizing features (RICE, ICE, MoSCoW), defining success metrics (North Star metric, HEART), structuring user research (JTBD, double diamond, opportunity solution trees), planning GTM strategy, mapping stakeholders, managing product lifecycle, sunsetting a product, or making any product decision that needs a structured framework. Triggers on "help me prioritize," "what metrics should I track," "should we build this," roadmap planning, or stakeholder alignment tasks. Do NOT use for engineering implementation decisions, UX/visual design, or marketing campaign execution.
---

# Product Manager

Each framework produces a concrete artifact — a filled template, a scored backlog, a metric definition, or a decision document. Load only the reference file that matches the current task.

## What this skill owns

- Product discovery: structuring research, defining user problems, mapping opportunities
- Feature prioritization: scoring, ranking, and scoping backlogs
- Metrics: selecting frameworks, defining KPIs, setting targets
- Go-to-market: B2B vs B2C positioning, growth model selection, pricing
- Stakeholder alignment: mapping influence, clarifying roles, structuring feedback
- Product lifecycle: phase diagnosis, sunsetting decisions, EOL execution

## Non-goals

- UX/UI design decisions (use a UX skill)
- Implementation and engineering execution (use engineering skills)
- General leadership or management coaching
- Competitive moat theory without a concrete decision attached
- Technical architecture or DevOps guidance

## Routing matrix

| If the task involves… | Load this |
| --- | --- |
| Understanding users, defining problems, JTBD, OST, engagement loops | [discovery.md](references/discovery.md) |
| Ranking features, scoping MVP, backlog triage | [prioritization.md](references/prioritization.md) |
| Choosing metrics, defining KPIs, setting targets | [metrics.md](references/metrics.md) |
| Launch planning, pricing, B2B/B2C, PLG/SLG | [gtm.md](references/gtm.md) |
| Aligning teams, managing stakeholders, structuring feedback | [stakeholders.md](references/stakeholders.md) |
| Diagnosing lifecycle phase, sunsetting, EOL planning | [lifecycle.md](references/lifecycle.md) |

If the task spans multiple areas, load the primary area first and reference others as needed.

## Anti-patterns

### 1. Feature factory
**Detection:** Features ship continuously with no outcome tracking. Roadmap is a list of outputs, not problems to solve.
**Resolution:** Attach a target metric and success criteria to every feature before committing to build it.

### 2. HiPPO decisions (Highest Paid Person's Opinion)
**Detection:** Priorities shift based on executive requests with no supporting data or user evidence.
**Resolution:** Require an evidence basis label (data, research, or explicit assumption) for every priority change.

### 3. Scope creep through "one more thing"
**Detection:** Scope grows incrementally after commitment. Each addition seems small but the aggregate delays delivery.
**Resolution:** Freeze scope at commitment. New requests enter the backlog and compete in the next prioritization cycle.

## Universal decision checks

Apply these to every product decision before finalizing:

1. **Outcome, not output.** What measurable result does this produce? If only a feature ships with no target metric, the decision is incomplete.
2. **Evidence basis.** Is this backed by data, user research, or an explicit assumption? Label which one. Assumptions must be testable.
3. **Who is affected.** Users, business, engineering, or all three? Identify tradeoffs between them.
4. **Focus.** One problem, one segment, one lever at a time. Reject scope that tries to solve everything simultaneously.
5. **Reversibility.** Can this be undone or rolled back? Irreversible decisions need stronger evidence.
6. **Success criteria.** Define what "worked" looks like before starting, not after.

## How to finish

Before delivering any PM artifact:

- Confirm every field in the template is filled with specifics, not placeholders
- Verify metrics have baselines, targets, and timeframes
- Check that assumptions are stated explicitly and marked as testable
- Ensure the output is self-contained — someone not in the conversation can act on it

## Questions this skill answers

- "Prioritize these features"
- "Help me define success metrics"
- "Write a JTBD statement"
- "Should we build this feature?"
- "Plan a product launch"
- "How do I structure user research?"
- "Create an opportunity solution tree"
- "What metrics should I track?"
- "Help with stakeholder alignment"
- "Is it time to sunset this product?"
