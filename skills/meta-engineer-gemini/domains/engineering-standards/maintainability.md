# Maintainability

When structuring code, writing logic, or modifying existing systems, you must ask yourself:

- How is it, or how should it be enforced that the repository stays understandable and logically structured? (e.g., automated linting, strict file line limits, aggressive TypeScript compiler options)
- If another developer reads this code in 6 months, will the intent be instantly and unmistakably obvious? (e.g., descriptive naming, elimination of magic numbers, concise comments explaining the 'why')
- Am I leaving the surrounding code slightly better than I found it? (e.g., the boy scout rule, removing unused imports, fixing nearby typos, deleting dead code)
- Are there any "temporary solutions" or "hacks" I am introducing, and if so, how can I eliminate them right now? (e.g., proper abstractions, complete implementations, avoiding hardcoded values)
- Is the complexity of this solution justified by the problem it solves? (e.g., simple functions, avoiding deep nesting, preferring readability over cleverness)
