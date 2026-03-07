# Verification — After Writing Code

Prove that your code works. Compilation is not verification.

1. Have I tested the actual behavior, not just that it compiles and lints? (e.g., manually exercising the flow, running integration tests, checking rendered output)
2. What inputs could break this, and have I tested them? (e.g., empty strings, null, extreme values, special characters, concurrent requests)
3. Have I verified every path through the code, including error and edge cases? (e.g., unauthorized access, missing records, timeout scenarios, empty collections)
4. Does the change work in the full system context, not just in isolation? (e.g., with other features running, under realistic data, through the actual deploy pipeline)
5. If I search the entire codebase for the pattern I just changed, are there other instances that need the same fix? (e.g., similar routes, duplicated logic, copy-pasted code)
6. Have I checked that I haven't broken any existing behavior? (e.g., type checks pass, tests pass, existing features still work, no regressions)
7. Am I confident enough to deploy this without being available to fix it immediately?
