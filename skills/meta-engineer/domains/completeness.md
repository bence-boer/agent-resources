# Domain — Completeness

## Use when

The task changes a pattern that probably exists elsewhere, or when finishing work feels suspiciously easy.

## Route next

- [correctness.md](correctness.md) — to prove all relevant paths were exercised
- [testing.md](testing.md) — to verify the paths you might have missed
- [../finish/self-review.md](../finish/self-review.md) — to pressure-test whether anything meaningful still remains open

## Questions

- What adjacent work must happen for this change to be truly complete? (e.g., migration, copy update, docs, cleanup, config change)
- What second-order effect will appear after the first fix lands? (e.g., stale cache, missing audit, broken sort, orphaned data)
- Which similar paths or mirrored experiences need the same treatment? (e.g., create and edit, admin and user, API and UI, mobile and desktop)
- What have you not verified because it is inconvenient? (e.g., empty state, rollback, concurrent edit, error recovery, slow network)
- What edge cases would make "done" a lie if left open? (e.g., duplicate submit, interrupted flow, missing validation, boundary input)
