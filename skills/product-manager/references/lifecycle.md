# Lifecycle

Frameworks for diagnosing product lifecycle phase and executing product sunset. Use when assessing strategic focus, deciding whether to invest or retire, or planning End-of-Life.

## Lifecycle phases

A product moves through five phases. Each requires different PM focus, metrics, and investment levels. Diagnose the current phase before making strategic decisions — the right action depends entirely on where the product is.

| Phase | Characteristics | PM focus | Primary metrics |
| --- | --- | --- | --- |
| **Discovery** | No product-market fit. High uncertainty. Rapid prototyping. | Validate assumptions. Run cheap experiments. Kill bad ideas fast. | Assumption validation rate, user interview count, prototype test results |
| **Introduction** | Product launched. Early traction being sought. | GTM execution. Drive awareness and activation. Measure first cohort behavior. | Activation rate, early retention (D1/D7), CAC, initial NPS |
| **Growth** | Product-market fit established. Scaling. | Optimize acquisition funnel. Expand features based on usage data. Reduce CAC. | DAU/MAU growth rate, funnel conversion rates, CAC trend, MRR growth |
| **Maturity** | Growth plateauing. Market saturation approaching. | Maximize profitability. Reduce churn. Expand LTV through cross-sell/upsell. Defend market position. | NRR, gross churn, LTV:CAC ratio, profit margin, feature adoption rate |
| **Decline** | Usage and revenue falling. Market shifting. | Evaluate: pivot, reinvent, or sunset. Decide based on data, not sentiment. | Revenue trend, active user trend, cost of maintenance vs. revenue, market alternatives |

### How to diagnose the current phase

Ask these questions:

1. Do we have product-market fit? (Are users retaining without heavy push?) — If no → Discovery or Introduction
2. Is our primary constraint finding users or keeping them? — Finding → Introduction/Growth. Keeping → Maturity.
3. Is growth rate accelerating, stable, or declining? — Accelerating → Growth. Stable → Maturity. Declining → Decline.
4. Is the cost of maintaining this product justified by its returns? — If the answer is becoming "no" → Decline.

### Phase transitions

- **Discovery → Introduction**: When you have a testable product and are ready to acquire users beyond pilot groups.
- **Introduction → Growth**: When early cohorts retain and the acquisition funnel shows repeatable conversion.
- **Growth → Maturity**: When growth rate decelerates despite maintained or increased investment.
- **Maturity → Decline**: When retention drops, revenue contracts, or the market shifts to alternatives.

---

## Product sunsetting

When maintaining a product costs more than its returns — in money, engineering time, or opportunity cost — it's time to sunset. This is a planned, phased process, not an abrupt shutdown.

### Decision criteria

Sunset when any of the following hold:

- Revenue is declining and the trend is irreversible given market conditions
- Maintenance cost exceeds the product's contribution margin
- Engineering time on the product blocks higher-value work
- The product no longer aligns with company strategy
- User base has migrated to alternatives

**Exception:** A low-volume product with high margins may not warrant sunsetting. Check margin, not just volume.

### The sunsetting process

#### Phase 1: Build the business case

- Document current revenue, costs, margin, and trend
- Identify engineering hours spent on maintenance vs. new investment
- Quantify opportunity cost — what could the team build instead?
- Present data, not opinions. Political decisions without data create resentment.

#### Phase 2: Set the EOL timeline

- Set a fixed End-of-Life date, typically 6–12 months out
- Working backward from EOL, schedule: last feature release, last billing cycle, data export deadline, infrastructure shutdown
- Publish the timeline internally before external communication

#### Phase 3: Communicate to customers

- Be transparent about why. Customers tolerate sunset when they understand the reason.
- Notify through every active channel: email, in-app, account managers for enterprise
- Give specific dates, not vague "sometime soon"
- Tailor messaging by segment: enterprise customers need more lead time and personal contact

#### Phase 4: Provide migration paths

- Offer data export tools
- Point to replacement products (yours or third-party — honesty builds long-term trust)
- Provide migration incentives (discounts, extended trials on replacement products)
- Staff a dedicated support channel for migration questions

#### Phase 5: Wind down operations

- Ramp down infrastructure gradually per the timeline
- Halt marketing spend
- Fulfill remaining legal and regulatory obligations (contract terms, data deletion per GDPR/privacy requirements, warranty commitments)
- Archive documentation and internal knowledge

#### Phase 6: Reallocate and review

- Move engineering, design, and marketing capacity to priority initiatives
- Run a blameless post-mortem: what worked in the sunset process, what caused unnecessary friction, what to do differently next time
- Document lessons for future sunsets

### Output template

```
Product: [name]
EOL Date: [date]
Current state: [revenue, margin, user count, trend]
Reason: [data-backed rationale]

Timeline:
- [date] Last feature release
- [date] Customer notification begins
- [date] Migration tools available
- [date] Last billing cycle
- [date] Data export deadline
- [date] Infrastructure shutdown

Migration:
- Export tools: [what's available]
- Replacement product: [internal or third-party recommendation]
- Incentives: [discounts, extended access]

Risk assessment:
- Customer churn risk: [high/medium/low + mitigation]
- Brand damage risk: [high/medium/low + mitigation]
- Legal exposure: [obligations and compliance plan]

Post-mortem scheduled: [date]
```

### Anti-patterns

- Sudden shutdown with no notice (destroys customer trust)
- Sunsetting based on politics instead of data
- No migration path (customers feel abandoned)
- Dragging out the process beyond the timeline (wastes the resources you're trying to free)
- Skipping the post-mortem (same mistakes repeat on the next sunset)
