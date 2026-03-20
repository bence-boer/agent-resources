# Finish - Self-review

## Use when

After implementation and verification, before declaring the task complete.

## Route next

- [handoff.md](handoff.md) if another person or agent must review, deploy, or extend the change

## Required checks

- State the main claim of the change in one sentence.
- List the proofs you actually have: types, tests, manual flow, logs or metrics, rollout checks.
- Re-scan mirrored paths, boundary inputs, and failure paths.
- Check whether types, schemas, or API shape could make the remaining runtime checks unnecessary.
- Remove any success-shaped fallback, duplicated truth, or hand-wavy state that remains.
- Confirm the chosen abstraction reduces misuse opportunities instead of relocating them.
- Confirm the changed area is better structured than when you found it.

## Do not stop if

- the root cause can still occur through a sibling path
- invalid state is still representable without a strong reason
- tests only cover the triggering case rather than the relevant state space
- proof is missing for the highest-risk claim
- release, recovery, or rollback behavior is still unclear
- the code only works because callers are "expected" to behave
- duplicated truth or mode sprawl remains without an explicit justification
