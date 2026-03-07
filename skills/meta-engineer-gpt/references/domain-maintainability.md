# Domain - Maintainability

## Use when

Use when the task changes file boundaries, abstraction choices, naming, code shape, or repeated patterns.

## Route next

- [domain-extensibility.md](domain-extensibility.md) - to keep the next legitimate requirement cheap
- [domain-developer-experience.md](domain-developer-experience.md) - to make the correct maintenance path obvious
- [finish-self-review.md](finish-self-review.md) - to check whether the final structure will still look wise later

## Questions

- How is the repository kept understandable and logically structured after this change? Examples: smaller files, clearer boundaries, strict checks
- What name, module split, or abstraction choice will age best here? Examples: task-based folders, explicit helpers, shallow APIs
- What repetition should be removed now before it becomes policy by accident? Examples: copied validation, duplicated branching, parallel state
- What future maintainer question can you answer in the code shape itself? Examples: where to extend, what owns state, why this path exists
