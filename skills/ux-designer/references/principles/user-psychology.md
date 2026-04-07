# Principle — User Psychology

Governs alignment between the interface and user expectations. Integrates Jakob's Law (users expect your product to work like others they know), mental models (compressed understanding of how systems work), cognitive bias (systematic reasoning shortcuts), and Paradox of the Active User (users skip instructions and act immediately).

## Use when

Any design involves conventions, onboarding, terminology, or managing user expectations.

## Route next

- [decision-architecture.md](decision-architecture.md) — to account for biases in choice presentation
- [cognitive-load.md](cognitive-load.md) — to manage expectations about information processing
- [feedback-perception.md](feedback-perception.md) — to shape emotional and perceptual response

## Rules

- Users spend most of their time in other products. Match established conventions before inventing new patterns. Novel interactions require compelling justification.
- Users do not read instructions, documentation, or onboarding content upfront. They act immediately and learn through interaction. Design for this reality.
- Provide contextual guidance at the point of need (inline hints, placeholder text, tooltips), not centralized tutorials or documentation links.
- Terminology must match the user's domain vocabulary, not the system's internal naming. The user's word wins.
- When introducing new patterns, allow gradual transition: familiar fallback alongside new option. Abrupt forced changes break learned habits.
- Design for actual behavior, not rational ideal behavior. Users satisfice (take the first adequate option), not optimize (evaluate all options).
- Confirmation bias: users interpret ambiguous feedback as confirming what they expected. Make error states unambiguous and visually distinct from success.
- Anchoring: the first number, price, or option a user sees disproportionately influences subsequent judgment. Place the most representative value first.

## Environment-Specific Psychology

User expectations shift fundamentally between B2B and B2C contexts. Design density, vocabulary, and flow complexity must match.

**B2B / Enterprise:**
- Primary motivation is task completion and operational efficiency. Reducing click counts and cognitive load outweighs visual polish.
- Power users require shortcuts, bulk actions, and keyboard-driven workflows. "Minimalist" consumer-style design with excessive whitespace can harm productivity if it forces constant scrolling.
- Role-based flows: B2B tools serve multiple personas (Admin, Operator, Executive). Surface only relevant information per role.
- Design decisions are justified by business metrics: reduced training time, lowered error rates, increased throughput.

**B2C / Consumer:**
- Primary motivation is personal value, emotion, and habit formation. Time-to-value must be immediate — complex onboarding causes instant churn.
- Aesthetics and micro-interactions build brand loyalty and perceived quality (Aesthetic-Usability Effect).
- Choice is minimized to prevent friction. Navigation emphasizes discovery and exploration over efficiency.

## Questions

- What 3 products does the target user interact with most, and what conventions from those products set expectations here? (e.g., Slack's channel sidebar, Notion's page hierarchy, Gmail's label system, Figma's layer panel)
- Where does the design require the user to learn something new, and is that learning cost justified by the benefit? (e.g., novel gesture, non-standard icon, custom terminology, unfamiliar layout pattern)
- What will the user attempt to do in their first 30 seconds without reading anything, and does the design support that attempt? (e.g., clicking the most prominent element, searching for something familiar, exploring the navigation)
- Where might confirmation bias cause the user to miss an error or misinterpret system state? (e.g., green color on a partial success, "Saved" message when save is still pending, ambiguous empty state vs no-results state)
- Is this a B2B or B2C context, and does the design density, vocabulary, and flow complexity match the user's expectations and motivations?
