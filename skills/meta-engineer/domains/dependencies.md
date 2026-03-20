# Domain - Dependencies

## Use when

The task adds libraries, services, configuration, interfaces, protocols, or external runtime assumptions.

## Route next

- [architecture.md](architecture.md) to keep the new surface in the right boundary
- [security.md](security.md) if the added surface changes blast radius or secret handling
- [developer-experience.md](developer-experience.md) to keep setup and debugging sane

## Apply

- Add new dependencies reluctantly.
- Prefer existing platform or local code when it solves the problem cleanly.
- Wrap third-party or remote choices behind a local boundary.
- Account for direct, transitive, environmental, and operational dependencies.
- Design for dependency failure, drift, and version change up front.

## Resolve explicitly

- What new burden comes with this dependency?
- What breaks if it slows, changes, or disappears?
- Can the dependency be localized or avoided?
- What secret, config, or runtime assumption does it add?

## Minimum proof

- Bounded integration surface
- Failure-path handling for the dependency exists
- Setup and assumptions are represented in code or config, not only tribal knowledge
