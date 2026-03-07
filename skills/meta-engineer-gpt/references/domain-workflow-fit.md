# Domain - Workflow fit

## Use when

Use when the task touches multi-step flows, handoffs, approvals, retries, or navigation between states.

## Route next

- [domain-user-value.md](domain-user-value.md) - to keep the workflow anchored in user benefit
- [domain-error-handling.md](domain-error-handling.md) - to cover failure and recovery inside the flow
- [domain-completeness.md](domain-completeness.md) - to catch mirrored paths and adjacent states

## Questions

- Where does this change enter the existing workflow, and what happens immediately before and after it? Examples: create, approve, retry
- What cognitive jump are you asking the user or teammate to make? Examples: new concept, new timing, new place to look
- Does this reduce friction across the whole flow or just move it? Examples: fewer steps, less context switching, clearer handoff
- What surrounding states deserve first-class handling? Examples: empty, loading, partial success, interrupted work
