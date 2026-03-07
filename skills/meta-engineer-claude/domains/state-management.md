# State Management — State Flow and Synchronization

State is the root of most bugs. Minimize it, centralize it, make it explicit.

→ Also read: [reliability](../qualities/reliability.md), [user-experience](../qualities/user-experience.md)

1. Where is the single source of truth for each piece of state, and does everything else derive from it? (e.g., database as truth, derived computed values, no duplicated state)
2. When state updates, does every dependent view, cache, or computation update correctly and completely? (e.g., stale UI, inconsistent caches, derived values not recomputed)
3. What happens when state updates arrive out of order or concurrently? (e.g., last-write-wins, conflict resolution, version vectors, sequence numbers)
4. Is polling or synchronization bounded, cleaned up, and resilient to failure? (e.g., interval cleanup, error handling in poll loops, backoff on failure)
5. Am I reconciling state updates or replacing state wholesale? (e.g., preserve object identity, merge by key, avoid destroying in-flight interactions)
6. Can I trace, at any point, exactly why the state has its current value? (e.g., clear update paths, no hidden mutations, logged transitions)
