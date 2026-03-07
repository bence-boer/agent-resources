# Domain — Maintainability

## Use when

The task changes file boundaries, abstraction choices, naming, code shape, or repeated patterns.

## Route next

- [extensibility.md](extensibility.md) — to keep the next legitimate requirement cheap
- [developer-experience.md](developer-experience.md) — to make the correct maintenance path obvious
- [../finish/self-review.md](../finish/self-review.md) — to check whether the final structure will still look wise later

## Questions

- How is the repository kept understandable and logically structured after this change? (e.g., smaller files, clearer boundaries, strict linting, enforced limits)
- What name, module split, or abstraction choice will age best here? (e.g., task-based folders, explicit helpers, shallow APIs, domain naming)
- What repetition should be removed now before it becomes policy by accident? (e.g., copied validation, duplicated branching, parallel state, repeated error handling)
- If another developer reads this code in 6 months, will the intent be instantly obvious? (e.g., descriptive naming, no magic numbers, comments explaining the 'why', clear data flow)
- Am I leaving the surrounding code better than I found it? (e.g., removing unused imports, fixing nearby issues, deleting dead code, simplifying adjacent logic)
- Is the complexity of this solution justified by the problem it solves? (e.g., simple functions over deep nesting, readability over cleverness, flat over nested)
