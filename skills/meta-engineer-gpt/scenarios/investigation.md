# Scenario - Investigation

## Use when

The next right move is to explain what exists, why it behaves that way, and where the real cause probably lives.

## Route next

- [../domains/architecture.md](../domains/architecture.md) to reason about boundaries and ownership
- [../domains/state-and-data.md](../domains/state-and-data.md) to inspect truth, transitions, and duplication
- [../domains/observability.md](../domains/observability.md) to identify which signals exist and which are missing
- [../domains/correctness.md](../domains/correctness.md) to test claims against evidence

## Default posture

- Explain current behavior, ownership, and data flow before recommending change.
- Separate evidence from theory.
- Follow the data and control path across boundaries, not only the obvious file.
- End with the strongest current theory and the next best check if that theory is wrong.

## Resolve explicitly

- What is known from evidence?
- What is inferred but not yet proven?
- What evidence distinguishes symptom from cause?
- What next check would invalidate the current theory fastest?

## Minimum proof

- Reproducible narrative grounded in evidence
- Clear separation of known facts and open uncertainty
- Concrete next action that reduces uncertainty materially
