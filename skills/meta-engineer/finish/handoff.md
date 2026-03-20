# Finish — Handoff

## Use when

The work needs review notes, rollout notes, follow-up context, or a clear extension starting point.

## Route next

- [self-review.md](self-review.md) — if the handoff reveals a weak point you still need to tighten

## Questions

- What must the next engineer know without rediscovering it? (e.g., invariant, rollout step, hidden dependency, non-obvious constraint)
- What decision did you make that deserves a short trace of why? (e.g., chose adapter, kept compat path, delayed cleanup, picked this approach over that)
- What follow-up would be irresponsible to leave implicit? (e.g., backfill removal, metric watch, docs sync, deprecation timeline)
- If someone else extends this next week, where should they start? (e.g., owning module, contract file, verification script, test suite)
