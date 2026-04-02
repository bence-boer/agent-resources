# Prioritization

Frameworks for ranking features, scoping releases, and making tradeoff decisions. Select the framework that fits the data available and the decision context.

## Framework selection

| Situation | Use this |
| --- | --- |
| Data-rich environment, large backlog, need transparent justification | RICE |
| Discovery phase, need to understand which features delight vs. are expected | Kano |
| Time-constrained release, need fast scope agreement | MoSCoW |
| Identifying unmet needs where importance is high but satisfaction is low | Opportunity Scoring |
| Quick triage without quantitative data | Impact-Effort Matrix |

---

## RICE Scoring

Produces a numerical rank for each item in a backlog. Works when you have data on reach, can estimate impact, and want defensible prioritization.

### Formula

$$\text{RICE} = \frac{\text{Reach} \times \text{Impact} \times \text{Confidence}}{\text{Effort}}$$

### Definitions

| Factor | What it measures | How to set it |
| --- | --- | --- |
| **Reach** | Number of users/customers affected per time period | Use actual data: DAU, MAU, customers in segment. Specify the time window. |
| **Impact** | Degree of effect on the target metric per user | Scale: 3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal. |
| **Confidence** | How sure you are about the estimates | 100% = high (backed by data), 80% = medium (some evidence), 50% = low (gut feel). |
| **Effort** | Person-months (or person-weeks) to ship | Estimate with engineering. Include design, QA, and ops if significant. |

### How to use

1. List candidate features or initiatives.
2. For each, fill in Reach, Impact, Confidence, and Effort with real numbers.
3. Calculate the RICE score.
4. Rank by score. Use the ranking as input to discussion, not as the final decision.

### Output template

```
| Feature | Reach | Impact | Confidence | Effort | RICE Score | Rank |
|---------|-------|--------|------------|--------|------------|------|
| A       | …     | …      | …          | …      | …          | …    |
| B       | …     | …      | …          | …      | …          | …    |
```

### Anti-patterns

- Using made-up Reach numbers instead of actual data
- Setting Confidence to 100% on everything (defeats the purpose)
- Treating the score as the decision instead of an input
- Ignoring dependencies between features

---

## Kano Model

Classifies features by how they affect user satisfaction. Useful in discovery to separate baseline expectations from differentiators.

### Categories

| Category | Description | Effect on satisfaction |
| --- | --- | --- |
| **Must-be (Basic)** | Expected. Absence causes dissatisfaction; presence doesn't increase satisfaction. | Missing = angry users. Present = neutral. |
| **Performance (Linear)** | More is better. Satisfaction scales linearly with how well it's done. | Better execution = happier users, proportionally. |
| **Attractive (Delighter)** | Unexpected. Absence doesn't hurt; presence creates disproportionate satisfaction. | Missing = no one notices. Present = delight. |
| **Indifferent** | Users don't care either way. | No effect on satisfaction. |
| **Reverse** | Some users actively dislike this feature. | Presence hurts satisfaction for a segment. |

### How to classify

Ask users paired questions for each feature:

1. "How would you feel if this feature were present?" (functional question)
2. "How would you feel if this feature were absent?" (dysfunctional question)

Response options for each: Like it / Expect it / Neutral / Can live without / Dislike it.

Cross-reference the two answers to classify:

| | Like (functional) | Expect | Neutral | Live without | Dislike |
| --- | --- | --- | --- | --- | --- |
| **Dislike (dysfunctional)** | Attractive | Must-be | Must-be | Must-be | — |
| **Live without** | Attractive | Indifferent | Indifferent | Indifferent | Reverse |
| **Neutral** | Attractive | Indifferent | Indifferent | Indifferent | Reverse |
| **Expect** | Performance | Indifferent | Indifferent | Indifferent | Reverse |
| **Like** | — | Reverse | Reverse | Reverse | — |

### Priority order

1. Must-be features first (absence = user churn)
2. Performance features second (drive satisfaction gains)
3. Attractive features third (create differentiation)
4. Cut Indifferent features
5. Investigate Reverse features before building

### Anti-patterns

- Skipping the survey and guessing classifications
- Treating all "nice ideas" as Attractive when they're actually Indifferent
- Ignoring Must-be features because they're boring

---

## MoSCoW Method

Four-bucket classification for fast scope decisions, especially under deadline pressure.

### Categories

| Bucket | Rule |
| --- | --- |
| **Must-have** | Without this, the release is broken or valueless. Non-negotiable. |
| **Should-have** | Important but the release can ship without it. Plan for next iteration. |
| **Could-have** | Desirable if there's time left. First to cut when scope tightens. |
| **Won't-have** | Explicitly out of scope for this release. Acknowledged, not forgotten. |

### How to use

1. List all candidate items.
2. For each, ask: "If we ship without this, does the release fail its purpose?" If yes → Must-have.
3. For remaining items, ask: "Would delaying this to the next cycle cause real harm?" If yes → Should-have.
4. Everything else is Could-have or Won't-have.
5. Must-haves should not exceed 60% of available capacity. If they do, the scope is too large.

### Output template

```
Release: [name/date]
Capacity: [person-weeks available]

Must-have (≤60% capacity):
- [ ] …
- [ ] …

Should-have:
- [ ] …

Could-have:
- [ ] …

Won't-have (this release):
- [ ] …
```

### Anti-patterns

- Everything labeled Must-have (defeats the purpose)
- No explicit Won't-have list (leads to scope creep)
- Must-haves exceeding 60% of capacity with no pushback

---

## Opportunity Scoring

Plots feature importance against current satisfaction to find gaps worth filling.

### How it works

Survey users on two dimensions for each feature or capability:

1. **Importance**: "How important is [capability] to you?" (1–10)
2. **Satisfaction**: "How satisfied are you with the current [capability]?" (1–10)

### Interpretation

| Quadrant | Importance | Satisfaction | Action |
| --- | --- | --- | --- |
| **Underserved (top-left)** | High | Low | Priority investment — high unmet need |
| **Well-served (top-right)** | High | High | Maintain — don't regress |
| **Over-served (bottom-right)** | Low | High | Reduce investment — diminishing returns |
| **Low priority (bottom-left)** | Low | Low | Ignore unless importance shifts |

### Anti-patterns

- Small sample size making the scores unreliable
- Surveying internal stakeholders instead of actual users
- Not re-running the survey as the product evolves

---

## Impact-Effort Matrix

A 2×2 grid for quick qualitative triage when quantitative data is unavailable.

### Quadrants

| | Low Effort | High Effort |
| --- | --- | --- |
| **High Impact** | Quick wins — do first | Big bets — plan carefully |
| **Low Impact** | Fill-ins — do if trivial | Money pits — avoid |

### How to use

1. List candidate items.
2. Place each on the grid based on team judgment.
3. Prioritize: Quick wins → Big bets → Fill-ins. Drop Money pits.

### Anti-patterns

- Spending too long debating placement (this is a fast triage tool — 30 min max)
- Using this as the only framework when data is available (switch to RICE)
- Confusing "low effort" with "low quality" — quick wins should still meet quality standards
