# Principle — Feedback & Perception

Governs how the system communicates status and shapes user experience at critical moments. Integrates Peak-End Rule (experiences judged by peak intensity and final moment), Aesthetic-Usability Effect (attractive design perceived as more usable), and Postel's Law (be liberal in what you accept, conservative in what you send).

## Use when

Any design involves system responses, error messages, success states, or moments of high user investment.

## Route next

- [interaction.md](interaction.md) — to define feedback timing and mechanics
- [complexity.md](complexity.md) — if error states are becoming complex
- [progress-motivation.md](progress-motivation.md) — if feedback occurs within a multi-step flow

## Rules

- Users judge the entire experience primarily by its most intense moment (peak) and its final moment (end). Invest disproportionate design effort in these two points.
- Identify the moment of highest user anxiety or investment (e.g., payment submission, data deletion, first publish) and design it to feel confident, clear, and resolved.
- Design the final moment of any flow to feel complete and rewarding: confirmation with clear next steps, not an abrupt redirect or silent close.
- Visual polish increases perceived usability. Users tolerate minor functional issues in well-designed interfaces and amplify issues in rough-looking ones. Invest in finish.
- Accept user input liberally: trim whitespace, normalize casing, handle common format variations (phone numbers, dates, URLs). Reject only what is genuinely invalid.
- When rejecting input, specify what is wrong and what is accepted. "Invalid format" fails. "Phone number must be 10 digits (e.g., 555-123-4567)" succeeds.
- Negative experiences are recalled more vividly than positive ones. Error states deserve more design attention than success states.
- After a negative experience (error, data loss, unexpected behavior), the immediate recovery experience determines whether the user retains trust or abandons.

## Questions

- What is the single highest-anxiety moment in this flow, and what does the design do to reduce anxiety at exactly that point? (e.g., real-time validation before submit, confirmation summary before payment, undo option after deletion)
- What is the final moment the user experiences, and does it resolve the flow cleanly? (e.g., confirmation message with next steps, return to origin, clear completion signal — not a blank page or silent redirect)
- Where does the interface reject input that a reasonable person would consider valid? (e.g., spaces in phone numbers, mixed-case email, trailing whitespace in URLs, date format variations)
- How does the design recover trust after something goes wrong? (e.g., clear error explanation, preserved input, easy retry, human support path, acknowledging the problem)
