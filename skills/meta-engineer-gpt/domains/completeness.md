# Domain - Completeness

## Use when

The task changes a pattern that probably exists elsewhere, or when finishing the work feels suspiciously easy.

## Route next

- [correctness.md](correctness.md) to prove all relevant paths were exercised
- [testing.md](testing.md) to verify the paths that are easiest to skip
- [../finish/self-review.md](../finish/self-review.md) to pressure-test whether anything meaningful remains open

## Apply

- Enumerate coupled surfaces before editing: symmetric flows, mirrored endpoints, create and edit, read and write, loading and error, rollout and rollback.
- Update docs, config, tests, contracts, and cleanup work when behavior changes.
- Search for sibling implementations of the same rule or bug class.
- Check the inconvenient cases: empty input, duplicates, retries, stale data, interruption.
- Remove dead branches or obsolete paths that would preserve the old failure class.

## Resolve explicitly

- What other path should change for this to be honest?
- What second-order effect appears after the first fix lands?
- What inconvenient case has not been verified yet?
- What can now be deleted?

## Minimum proof

- Mirrored paths were actually reviewed
- Coupled surfaces updated or explicitly ruled out
- Edge cases covered rather than deferred by default
