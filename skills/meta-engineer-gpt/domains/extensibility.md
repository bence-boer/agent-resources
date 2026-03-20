# Domain - Extensibility

## Use when

The task might soon gain more roles, states, variants, channels, regions, or product options.

## Route next

- [maintainability.md](maintainability.md) to keep the extension path readable instead of clever
- [architecture.md](architecture.md) to place the extension seam in the right boundary
- [state-and-data.md](state-and-data.md) to ensure new variants do not violate core rules

## Apply

- Generalize only along axes that are plausible and already visible: role, state, provider, channel, version.
- Prefer sealed extension points and explicit variants over boolean option sprawl.
- Replace clusters of booleans with a better domain model when they encode hidden modes or states.
- Keep policy in one place.
- Do not pre-build abstraction for imagined futures.

## Resolve explicitly

- Which next variation is legitimate enough to support now?
- What assumption blocks that variation today?
- What generalization would be premature?
- Would one new variant touch one boundary or many conditionals?

## Minimum proof

- A plausible next variant has an obvious extension seam
- The current design stays simple while supporting the next real need
- No broad optionality was added without a concrete justification
