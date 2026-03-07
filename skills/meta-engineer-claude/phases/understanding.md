# Understanding — Before Touching Any Code

Before writing a single line, ensure you deeply understand what exists and why.

1. What is the actual current behavior, and have I verified it myself rather than assuming from code reading? (e.g., run the app, hit the endpoint, reproduce the bug)
2. What existing patterns, conventions, and abstractions does this codebase already use for similar problems? (e.g., service layers, component patterns, naming conventions, error handling approaches)
3. Where else in the codebase does the pattern I'm about to change or extend exist? (e.g., similar routes, components, migrations, shared utilities)
4. What are the explicit and implicit constraints of the system I'm working in? (e.g., resource limits, deployment model, single-tenancy, disabled SSR, no auto-scaling)
5. What is the full lifecycle of data I'm touching — from creation to deletion? (e.g., user input → validation → storage → display → archival)
6. Who are the stakeholders affected by this change, and what do they actually need? (e.g., end users, other developers, ops, future maintainers)
7. What has been tried before for this problem, and why did it succeed or fail? (e.g., git history, related issues, prior discussions, reverted commits)
