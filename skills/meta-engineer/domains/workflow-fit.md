# Domain — Workflow fit

## Use when

The task touches multi-step flows, handoffs, approvals, retries, or navigation between states.

## Route next

- [user-value.md](user-value.md) — to keep the workflow anchored in user benefit
- [error-handling.md](error-handling.md) — to cover failure and recovery inside the flow
- [completeness.md](completeness.md) — to catch mirrored paths and adjacent states

## Questions

- Where does this change enter the existing workflow, and what happens immediately before and after? (e.g., create, approve, retry, navigate back)
- What cognitive jump are you asking the user or teammate to make? (e.g., new concept, new timing, new place to look, changed terminology)
- Does this reduce friction across the whole flow or just move it? (e.g., fewer steps, less context switching, clearer handoff)
- What surrounding states deserve first-class handling? (e.g., empty, loading, partial success, interrupted work, expired session)
- Based on current workflows and use cases, what would be the ideal flow, making it feel seamless? (e.g., predictable next steps, auto-focused inputs, logical progression, minimal decisions)
