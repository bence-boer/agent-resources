# Metrics

Frameworks for selecting, defining, and structuring product metrics. Use when choosing what to measure, setting targets, or building a metrics hierarchy.

## Framework selection

| Situation | Use this |
| --- | --- |
| Growth-stage product, need to diagnose funnel leaks | AARRR (Pirate Metrics) |
| Mature product, need to measure UX quality and depth | HEART |
| Need a single metric to align the organization around | North Star Metric |
| SaaS business, need financial health indicators | SaaS KPIs |

---

## AARRR (Pirate Metrics)

A sequential funnel for growth-stage products. Each stage represents a conversion point where users either progress or drop off.

### The funnel

| Stage | What it measures | Example metrics |
| --- | --- | --- |
| **Acquisition** | How users find the product | Signups, landing page visits, install rate |
| **Activation** | First experience of core value ("aha moment") | Onboarding completion rate, time to first value action |
| **Retention** | Whether users come back | D1/D7/D30 retention, weekly active rate |
| **Referral** | Whether users bring others | Invite rate, viral coefficient (K-factor), NPS |
| **Revenue** | Whether the product monetizes | Conversion to paid, ARPU, MRR |

### How to use

1. Map each stage to a specific, measurable metric for your product.
2. Measure conversion between stages: what percentage progresses from Acquisition to Activation? From Activation to Retention?
3. The stage with the lowest conversion rate is the bottleneck. Fix that first.
4. Re-measure after changes to confirm improvement.

### Anti-patterns

- Measuring Acquisition without tracking Activation (vanity metrics — signups mean nothing if users don't activate)
- Optimizing Revenue before Retention is healthy (leaky bucket)
- No defined "aha moment" for Activation (if you can't define it, you can't measure it)

---

## HEART Framework

Five dimensions for measuring UX quality in mature products. Developed at Google. Complements AARRR by going deeper on experience rather than funnel conversion.

### The dimensions

| Dimension | What it measures | Example metrics |
| --- | --- | --- |
| **Happiness** | User satisfaction and sentiment | NPS, CSAT, satisfaction survey scores |
| **Engagement** | Frequency and depth of use | DAU/MAU ratio, sessions per week, time in product |
| **Adoption** | Uptake of new features or by new users | Feature adoption rate, new user activation rate |
| **Retention** | Users returning over time | Cohort retention curves, churn rate |
| **Task Success** | Efficiency and accuracy of completing tasks | Task completion rate, error rate, time-on-task |

### How to use

1. Pick the 2–3 dimensions most relevant to the current product goal. Do not track all five simultaneously unless you have dedicated analytics capacity.
2. For each dimension, define a Goals-Signals-Metrics chain:
   - **Goal**: What outcome matters? (e.g., "Users complete the core workflow efficiently")
   - **Signal**: What user behavior indicates this? (e.g., "Users finish the workflow without backtracking")
   - **Metric**: What's measurable? (e.g., "Workflow completion rate, average steps to completion")
3. Set baselines and targets before making changes.

### Anti-patterns

- Tracking all five dimensions without prioritizing (analysis paralysis)
- Using Happiness scores alone to make product decisions (satisfaction doesn't always predict behavior)
- No baseline measurement before changes (can't prove improvement)

---

## North Star Metric

A single metric that captures the core value the product delivers to users while predicting long-term business revenue.

### Characteristics of a good North Star

- Reflects value delivered to users, not internal business activity
- Leads revenue — if this metric improves, revenue eventually follows
- Is actionable — teams can influence it through product work
- Is understandable by everyone in the organization without explanation

### Examples by product type

| Product type | North Star | Why it works |
| --- | --- | --- |
| Marketplace | Transactions completed per week | Captures both supply and demand health |
| SaaS tool | Weekly active teams using core feature | Reflects value delivery and stickiness |
| Media/content | Time spent consuming content per user | Predicts ad revenue and subscription conversion |
| E-commerce | Purchases per active buyer per month | Directly tied to revenue trajectory |

### How to set one

1. List metrics that reflect user value (not business operations like MRR).
2. For each, ask: "If this goes up, does revenue follow eventually?" Eliminate those where the answer is no.
3. For each survivor, ask: "Can product teams directly influence this?" Eliminate those outside product control.
4. Pick the one that's simplest to explain and most broadly applicable.

### Building a metric tree

The North Star sits at the top. Below it, map **input metrics** — the leading indicators that teams can move through daily work.

```
North Star: [metric]
├── Input 1: [leading metric A] — owned by [team]
├── Input 2: [leading metric B] — owned by [team]
└── Input 3: [leading metric C] — owned by [team]
```

Each input metric should have an owner and a target. Movement in inputs should predictably affect the North Star.

### Anti-patterns

- Picking MRR or revenue as North Star (it's a lagging business metric, not a user value metric)
- A metric no team can directly influence
- Multiple "North Stars" (defeats the alignment purpose)
- No input metric tree (teams can't connect daily work to the North Star)

---

## SaaS KPIs

Financial health indicators for subscription-based businesses. Use these to assess business sustainability, not product quality (use AARRR or HEART for that).

### Core metrics

| Metric | Definition | How to calculate | Benchmark |
| --- | --- | --- | --- |
| **MRR / ARR** | Predictable recurring revenue from active subscriptions | Sum of all active subscription amounts per month (MRR) or annually (ARR). Exclude one-time fees. | Foundation metric — track trend, not just absolute value |
| **CAC** | Cost to acquire one new customer | Total sales + marketing spend ÷ new customers acquired in the period | Varies by channel; compare across channels to find efficiency |
| **LTV** | Total gross margin expected from one customer over their lifetime | Average revenue per customer × gross margin % × average customer lifespan | Healthy: LTV:CAC ≥ 3:1 |
| **CAC Payback** | Months to recover acquisition cost from gross margin | CAC ÷ (monthly revenue per customer × gross margin %) | < 6 months: highly scalable. 6–12: healthy. > 24: critical risk |
| **NRR** | Revenue retained from existing customers including expansion and churn | (Starting MRR + expansion − contraction − churn) ÷ Starting MRR × 100 | > 100% = negative churn (business grows without new customers). > 120% = strong. |
| **Gross Churn** | Revenue lost from cancellations and downgrades | (Churned MRR + Contraction MRR) ÷ Starting MRR × 100 | < 2% monthly for SMB, < 1% for Enterprise |

### How to use

1. Track MRR/ARR as the baseline health indicator.
2. Use LTV:CAC ratio to assess whether growth spending is sustainable.
3. Use CAC Payback to gauge how quickly the business recovers investment.
4. Use NRR to understand if the existing customer base is expanding or contracting.
5. Use Gross Churn as an early warning — rising churn signals product or market problems.

### Reading the ratios together

- **LTV:CAC < 1:1** — Losing money on every customer. Stop spending on acquisition until unit economics improve.
- **LTV:CAC between 1:1 and 3:1** — Marginal. Improve retention or reduce CAC.
- **LTV:CAC > 5:1** — Possibly under-investing in growth. Spend more on acquisition.
- **NRR > 100% + low churn** — Strong product-market fit. Expansion revenue exceeds losses.
- **NRR < 100%** — Contracting base. Revenue depends entirely on new customer acquisition, which is unsustainable long-term.

### Anti-patterns

- Reporting ARR growth while hiding rising churn (masking problems)
- Including one-time fees in MRR (inflates the number, misleads investors)
- Measuring CAC without channel attribution (can't optimize what you can't attribute)
- Ignoring NRR in favor of gross revenue growth (a growing company with NRR < 90% has a retention crisis)
