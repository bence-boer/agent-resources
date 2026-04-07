# Scenario — Redesign

## Use when

Rethinking or substantially improving an existing interface.

## Route next

- [../principles/user-psychology.md](../principles/user-psychology.md) — to manage transition from old to new
- [../principles/visual-hierarchy.md](../principles/visual-hierarchy.md) — to restructure layout and emphasis
- [../principles/cognitive-load.md](../principles/cognitive-load.md) — to reduce accumulated complexity
- [../principles/complexity.md](../principles/complexity.md) — to identify essential vs accidental complexity

## Content Audit Steps

Before redesigning, inventory what exists. This prevents rebuilding features users rely on and identifies dead content to cut.

1. **Catalog:** List every page, module, and functional capability in the current system.
2. **Map Dependencies:** Identify how data objects relate (e.g., Customer → Invoices → Support Tickets).
3. **Analyze Traffic:** Use analytics to identify dead content (low engagement) and high-traffic bottlenecks.
4. **Rationalize:** Decide what to keep, merge, or retire based on current business objectives and user needs.

## UX Triage Scale

Match design rigor to business risk before starting work.

| Level | Mode | When to use | Deliverables |
| --- | --- | --- | --- |
| 1 | Lean & Fast | Low-risk, sprint-level iterations within existing patterns | Whiteboard sketches, verbal alignment |
| 2 | Lean with Signals | Early proof-of-concepts where some validation is needed | Basic prototypes, feedback from 2–3 users |
| 3 | Balanced UX | Mid-sized features affecting multiple systems or users | Wireframes, flow diagrams, usability testing |
| 4 | Formal UX | Critical features with legal, compliance, or financial risk | High-fidelity prototypes, research reports, annotations |
| 5 | Enterprise UX | Replatforming, core system redesigns, or multi-year initiatives | Comprehensive IA, design systems, change management |

## 7Rs Modernization Framework

When auditing a legacy application, categorize each module to determine strategy.

| Strategy | Definition | Use when |
| --- | --- | --- |
| Retire | Decommission the system | Business value no longer justifies cost of run |
| Retain | Keep as-is with minimal changes | System is stable with low impact on current goals |
| Rehost | Move to modern infrastructure | "Lift and shift" to reduce costs without changing code |
| Replatform | Move to new platform with minor code changes | Exploiting cloud-native features like auto-scaling |
| Refactor | Improve internal code/UI without changing core architecture | Cleaning up visual debt and fixing inconsistent patterns |
| Rearchitect | Shift to a new architecture | Current system too rigid to scale with new requirements |
| Rebuild | Rewrite from scratch | Technical debt makes any other approach impossible |

## Progressive Redesign Strategy

Avoid "Big Bang" redesigns — they fail from user resistance and technical complexity.

1. **Isolate Business Logic:** Expose legacy capabilities through a modern API layer.
2. **Modernize the Shell:** Implement global navigation and design tokens for immediate visual consistency.
3. **Redesign by Domain:** Focus on high-value, high-traffic modules first (dashboard, primary task flow). Wrap in modern UI fetching data from the legacy backend.
4. **Validate Incrementally:** Run parallel versions or canary releases of redesigned flows. Measure against the legacy baseline.

## Questions

- What specific problem does the redesign solve that is not solvable with incremental changes? (e.g., fundamental IA mismatch, accumulated feature sprawl, misaligned mental model, broken core workflow)
- What existing user habits must the new design preserve or provide a clear migration path for? (e.g., keyboard shortcuts, spatial memory of element positions, saved workflows, learned navigation patterns)
- How will users transition without losing productivity or trust? (e.g., gradual rollout, parallel availability, guided tour, opt-in preview)
- What measurement will confirm the redesign is an improvement, not just different? (e.g., task completion time, error rate, feature discoverability, user satisfaction score)
- What is the appropriate triage level for this redesign, and does the planned effort match? (See UX Triage Scale above.)
- Which of the 7Rs applies to each module being redesigned? (Not everything needs a rebuild — some modules should be retained or retired.)
