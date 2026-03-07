# Performance — Does This Respect Resource Constraints?

Fast enough is a feature. Wasteful is a bug.

1. What is the actual resource profile of this code under realistic conditions? (e.g., memory allocation, CPU usage, network calls, database queries per request)
2. Are there operations that scale with input size, and are they bounded? (e.g., unbounded loops, loading entire tables, concatenating large strings)
3. Am I making unnecessary round trips to external systems? (e.g., N+1 queries, redundant API calls, repeated file reads)
4. Does this code do work eagerly that could be deferred, or repeatedly that could be cached? (e.g., computing derived values on every render, parsing config on every request)
5. What is the worst-case scenario for this code path, and is it acceptable? (e.g., timeout under load, memory spike, blocking the event loop)
6. Am I introducing polling, retries, or timers — and do they have upper bounds and cleanup? (e.g., intervals without clearInterval, retry without backoff, uncapped polling frequency)
