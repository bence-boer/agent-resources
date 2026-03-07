# Architecture & Design

When adding new modules, integrating systems, or making structural changes, you must ask yourself:

- Does this implementation strictly respect the existing architectural boundaries and intended data flow? (e.g., separation of concerns, unidirectional data flow, proper layer isolation)
- Is this component or module tightly coupled to things it has no business knowing about? (e.g., the UI knowing about the database schema, global state pollution, hard dependencies on external services)
- How easily can this specific part of the system be ripped out, replaced, or upgraded in the future? (e.g., interface segregation, dependency injection, high cohesion and low coupling)
- What happens to the system if the load or data volume on this new feature increases by 100x? (e.g., database locks, memory bloat, N+1 query problems, missing pagination)
