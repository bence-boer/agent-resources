# Maintainability — Will This Code Stay Healthy Over Time?

Every line of code is a liability. Optimize for understanding, not cleverness.

1. How is it enforced that the repository stays understandable and logically structured? (e.g., linting, file line limits, strict compiler options, consistent naming conventions)
2. Can a new team member understand this code without asking the author? (e.g., self-documenting names, clear control flow, minimal indirection)
3. If this file grows, where are the natural seams for extraction? (e.g., separate concerns, clear boundaries, interface points)
4. Am I duplicating logic that already exists elsewhere, or should exist as a shared abstraction? (e.g., validation helpers, error formatters, common UI patterns)
5. Does this code minimize the surface area for future bugs? (e.g., immutable data, exhaustive switches, narrow types, explicit over implicit)
6. Are my abstractions earning their complexity, or am I abstracting prematurely? (e.g., a generic framework for a one-time use case, an interface with one implementation)
7. Does the file and folder structure reflect how a developer would navigate to solve a problem? (e.g., feature-based vs layer-based, discoverable naming, logical grouping)
