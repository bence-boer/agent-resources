# Go-to-Market

Frameworks for launch planning, growth model selection, and pricing. Use when deciding how to bring a product to market, choosing between PLG and SLG, or setting prices.

## B2B vs B2C differences

These environments require different GTM approaches. Know which one you're operating in before making any GTM decision.

| Dimension | B2B | B2C |
| --- | --- | --- |
| **Buyer** | Committee of 6–10 stakeholders (end-user, IT, finance, legal) | Individual deciding for themselves |
| **Sales cycle** | 6–12 months | Minutes to days |
| **Decision driver** | ROI analysis, compliance, integration fit | Personal utility, emotion, brand, price |
| **Pricing** | Negotiable, custom, often annual contracts | Fixed, published, psychological anchoring |
| **GTM tactics** | Consultative sales, content marketing, outbound lead gen, published roadmaps | Digital advertising, influencer partnerships, self-serve UX, immediate time-to-value |
| **Release cadence** | Structured, predictable, communicated in advance | Rapid, data-driven, continuous |

### Implications for product decisions

- **B2B:** Invest in sales enablement, long-term roadmap visibility, security/compliance stories, and API documentation. The product demo is often the most important sales tool.
- **B2C:** Invest in onboarding speed, self-serve flows, and reducing time-to-value. First impressions determine conversion.

---

## Growth model: PLG vs SLG

The growth model determines how customers discover, adopt, and expand their use of the product. Many mature companies use both.

### Product-Led Growth (PLG)

The product itself drives acquisition, activation, and expansion. Users adopt bottom-up: individual → team → organization.

**Characteristics:**
- Free trial or freemium tier
- Self-serve onboarding, no salesperson required
- Low CAC (acquisition is organic or product-driven)
- Viral or network effects drive expansion
- Revenue expands through usage growth or team seat additions

**When PLG fits:**
- Low complexity product that individuals can adopt alone
- Value is experienced quickly without setup or training
- Network effects increase value as more users join
- Target user has authority to start using the product without procurement

**PM focus in PLG:**
- Eliminate every friction point in signup and onboarding
- Define and optimize the "aha moment" (first experience of core value)
- Build referral and sharing loops into the product
- Track activation rate obsessively

### Sales-Led Growth (SLG)

Customer journey is guided by sales and customer success teams. Adoption is top-down: executive buyer → implementation → user rollout.

**Characteristics:**
- High-touch sales process with demos, pilots, and negotiations
- High CAC offset by high contract values
- Long sales cycles (months)
- Customer success teams drive retention and expansion

**When SLG fits:**
- Complex product requiring implementation support or change management
- Buyer is not the end-user (economic buyer ≠ user)
- High contract values justify sales team cost
- Security, compliance, or procurement requirements gate adoption

**PM focus in SLG:**
- Build sales enablement tools (demos, ROI calculators, competitive comparisons)
- Maintain a published product roadmap for buyer confidence
- Prioritize integration capabilities and API completeness
- Track pipeline conversion rates and deal cycle length

### Hybrid approach

Most products eventually need elements of both:
- PLG companies add enterprise sales teams when grassroots adoption reaches procurement thresholds
- SLG companies add self-serve demos and automated nurturing to improve pipeline velocity

The transition point: when individual adoption hits organizational limits (security audits, bulk procurement, admin controls), PLG needs SLG support.

---

## Pricing methodology

Pricing is iterative, not a one-time decision. Follow these steps in order.

### Step 1: Calculate total costs

- **Direct costs**: hosting, infrastructure, third-party services, per-user costs
- **Indirect costs**: sales, marketing, support, overhead, R&D amortization

### Step 2: Define target margin

| Business type | Typical gross margin range |
| --- | --- |
| SaaS | 70–90% |
| Physical product | 30–60% |
| Marketplace | 15–30% (take rate) |

### Step 3: Set a baseline price

Use cost-plus pricing as the floor: total cost per unit × (1 + target margin %).

This is the minimum viable price. It rarely reflects what the market will pay.

### Step 4: Validate against market

- **Competitor pricing**: Where does the market cluster? What tier do competitors target?
- **Willingness to pay**: Survey or interview target customers. "At what price would this be too expensive to consider?" and "At what price would this seem too cheap to trust?"
- **Perceived value**: What is the customer's alternative? What does it cost them in time, money, or risk? Price against the alternative, not against your costs.

### Step 5: Test and adjust

- Run pricing experiments with different cohorts
- Use **negative price testing** — lower the price and measure whether conversion increases proportionally (if not, price wasn't the barrier)
- Monitor the effect on LTV, not just conversion

### Pricing models

| Model | How it works | When to use |
| --- | --- | --- |
| **Freemium** | Free tier with limited features; paid tiers unlock more | PLG, high volume, low marginal cost, need viral adoption |
| **Tiered** | 2–4 tiers with increasing features/limits/support | Self-serve segmentation; let customers choose their value level |
| **Per-seat** | Price scales with number of users | Collaborative products where value scales with team size |
| **Usage-based** | Price scales with consumption (API calls, storage, transactions) | Infrastructure or platform products; aligns cost with value |
| **Flat rate** | One price, all features | Simple products with uniform use cases |

### Anti-patterns

- Pricing based only on costs without considering willingness to pay
- Copying competitor prices without understanding your relative value
- Offering too many tiers (>4 creates choice paralysis)
- Never testing or iterating on price after launch
- Premium pricing with no supporting narrative or UX quality (creates cognitive dissonance)
