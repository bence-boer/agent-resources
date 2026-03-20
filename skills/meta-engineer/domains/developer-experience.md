# Domain - Developer experience

## Use when

The change affects how engineers discover, modify, verify, or reason about the system.

## Route next

- [maintainability.md](maintainability.md) to turn local clarity into lasting structure
- [dependencies.md](dependencies.md) to remove unnecessary moving parts
- [../finish/handoff.md](../finish/handoff.md) to capture knowledge the next person would otherwise rediscover

## Apply

- Make the correct usage path the easiest one.
- Use restrictive types, defaults, builders, helpers, or module boundaries to prevent misuse.
- Keep setup, debugging, and extension discoverable.
- Put non-obvious rules near the code or tests that enforce them.
- Remove friction that would push the next engineer toward copy-paste or local hacks.

## Resolve explicitly

- What future mistake is most likely here?
- What API or file layout invites misuse?
- What knowledge is still trapped in your head?
- What would make debugging slower than necessary?

## Minimum proof

- Boundary or API is easier to use correctly than incorrectly
- Naming and file layout support local reasoning
- Important rules are captured in code, tests, or focused docs
