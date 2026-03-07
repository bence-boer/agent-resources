# Implementation — While Writing Code

Write code with intention, not momentum. Pause regularly to evaluate.

1. Am I following the existing patterns in this codebase, or am I introducing inconsistency? (e.g., naming conventions, file structure, error handling style, import patterns)
2. Is each function, component, or module doing exactly one thing, and is that thing obvious from its name? (e.g., a function called `processData` that also validates and logs)
3. Am I handling every error path explicitly, or am I assuming the happy path? (e.g., null returns, network failures, invalid input, empty collections)
4. Could I delete any of this code and the feature would still work? (e.g., dead code, redundant checks, over-abstraction, unused imports)
5. Am I building the right thing right now, or have I drifted into yak-shaving? (e.g., refactoring unrelated code, building generic utilities, premature optimization)
6. Is every piece of state I'm introducing necessary, and is it owned in exactly one place? (e.g., duplicated state between server and client, redundant caches, derived values stored as state)
7. If I stopped right now, would the codebase be in a worse state than when I started? (e.g., incomplete migrations, broken imports, half-implemented features)
