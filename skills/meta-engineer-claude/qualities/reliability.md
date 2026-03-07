# Reliability — Does This Handle Failure Gracefully?

Every external call can fail. Every state transition can be interrupted. Plan for it.

1. For every external call, what happens when it fails, times out, or returns unexpected data? (e.g., database errors, API timeouts, malformed responses)
2. If the process crashes or restarts mid-operation, what state is left behind and how is it reconciled? (e.g., orphaned processes, partial writes, stale caches, interrupted migrations)
3. Are state transitions guarded against invalid or concurrent mutations? (e.g., optimistic locking, state machine guards, idempotent operations)
4. Does every resource acquisition have a guaranteed release path? (e.g., file handles in finally blocks, connection pool returns, lock releases, process cleanup)
5. What is the blast radius if this code fails? (e.g., isolated to one request, cascading to other features, bringing down the system)
6. Am I distinguishing between transient failures worth retrying and permanent failures to abort on? (e.g., network blip vs invalid credentials, timeout vs schema mismatch)
