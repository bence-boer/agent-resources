# Domain - Correctness

## Use when

The task changes behavior, invariants, permissions, calculations, or any path where confidence must be earned.

## Route next

- [testing.md](testing.md) to design verification that catches real failures
- [completeness.md](completeness.md) to prove all relevant paths were exercised
- [../finish/self-review.md](../finish/self-review.md) to challenge whatever still feels lucky or assumed

## Apply

- Reduce the change to a small set of explicit claims.
- Prefer designs where correctness follows from structure, types, and invariants rather than repeated conditionals.
- Search for counterexamples and sibling failures, not only confirming examples.
- Treat compilation and linting as baseline checks, not final proof.
- Escalate to end-to-end verification when the boundary is user-visible or distributed.

## Resolve explicitly

- What claim would be most damaging if false?
- What input would disprove current confidence?
- Where can the same rule fail in a slightly different shape?
- What must be verified in the real flow?

## Minimum proof

- Targeted automated proof for each material claim
- Manual or end-to-end verification where the real boundary matters
- No important claim left at "should work"
