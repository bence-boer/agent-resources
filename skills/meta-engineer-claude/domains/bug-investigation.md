# Bug Investigation — Finding and Fixing Root Causes

A bug is a gift: it reveals a gap in your understanding. Fix the gap, not just the symptom.

→ Also read: [reliability](../qualities/reliability.md), [observability](../qualities/observability.md)

1. Can I reliably reproduce this bug, and do I understand the exact sequence of events that triggers it? (e.g., specific inputs, timing, state prerequisites, environment conditions)
2. Is this the root cause, or a symptom of a deeper issue? (e.g., the failing line vs the wrong assumption three layers up)
3. Where else could this same class of bug exist in the codebase? (e.g., similar patterns, shared code paths, copy-pasted logic)
4. What prevented this bug from being caught earlier? (e.g., missing test case, insufficient validation, unclear contract, silent failure)
5. After fixing, what test or guard ensures this exact bug cannot recur? (e.g., regression test, type constraint, runtime validation, compiler error)
6. Does my fix address only this bug, or does it also address the systemic weakness that allowed it? (e.g., adding one test vs adding a type constraint, fixing one instance vs fixing the pattern)
