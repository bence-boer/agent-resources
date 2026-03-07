# Developer Experience (DX)

When building tools, abstractions, or features that other developers (including yourself in the future) will interact with, you must ask yourself:

- If someone needs to debug this feature, what information will they need, and am I actively providing it? (e.g., structured logging, descriptive error traces, correlation IDs)
- How painful is it to test, run, or modify this code locally? (e.g., simple setup commands, available mock data, fast compilation times)
- Are the abstractions or patterns I'm building actually helpful, or do they just add unnecessary cognitive overhead? (e.g., avoiding premature DRY, clear and predictable interfaces, straightforward behavior)
- Does the tooling catch mistakes immediately before they become a problem? (e.g., strict typing, fast feedback loops, pre-commit hooks)
