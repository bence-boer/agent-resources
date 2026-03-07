# Error Handling

When writing code that interacts with external systems, user input, or unpredictable state, you must ask yourself:

- When this code inevitably fails, how exactly does it fail, and is that failure graceful? (e.g., fallback UI components, explicit error boundaries, safe and limited retries)
- Am I swallowing errors silently, or bubbling them up correctly to be handled, monitored, and logged? (e.g., avoiding empty catch blocks, preserving original stack traces, returning structured and typed errors)
- Does the end-user receive an actionable, polite, and safe message when an error occurs? (e.g., "Please try again later," clear steps to resolve the issue, no technical jargon or stack traces leaking in the UI)
- Does the system recover automatically from transient failures? (e.g., circuit breakers, exponential backoff, state reconciliation)
