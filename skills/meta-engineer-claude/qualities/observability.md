# Observability — Can Problems Be Diagnosed in Production?

If you can't see it, you can't fix it. Instrument for the questions you'll ask at 2am.

1. When this code fails in production, what information is available to diagnose the root cause? (e.g., structured logs, error context, request tracing, state snapshots)
2. Can I distinguish between "working correctly" and "silently failing" from outside the system? (e.g., health checks, metrics, alerts, audit logs)
3. Are logs structured and contextual enough to filter, search, and correlate? (e.g., request IDs, user context, operation names, timing information)
4. Am I logging at the right level — enough to diagnose, not so much that signal is lost in noise? (e.g., errors always, warnings for degradation, debug for development only)
5. If a user reports "it's broken," can I reconstruct what happened from the available data? (e.g., request logs, state transitions, event sequences, timestamps)
