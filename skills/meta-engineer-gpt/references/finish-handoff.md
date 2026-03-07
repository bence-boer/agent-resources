# Finish - Handoff

## Use when

Use when the work needs review notes, rollout notes, follow-up context, or a clear extension starting point.

## Route next

- [foundation-quality-gates.md](foundation-quality-gates.md) - if the handoff reveals missing evidence or unfinished validation
- [finish-self-review.md](finish-self-review.md) - if the handoff exposes a weak point you still need to tighten yourself

## Questions

- What must the next engineer know without rediscovering it? Examples: invariant, rollout step, hidden dependency
- What decision did you make that deserves a short trace of why? Examples: chose adapter, kept compat path, delayed cleanup
- What follow-up would be irresponsible to leave implicit? Examples: backfill removal, metric watch, docs sync
- If someone else extends this next week, where should they start? Examples: owning module, contract file, verification script
