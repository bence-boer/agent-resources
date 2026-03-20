# Foundation - Core framing

## Use when

Every non-trivial task, before choosing a solution or touching code.

## Route next

- [scope.md](scope.md) if the ask can sprawl or the minimum complete outcome is unclear
- [constraints.md](constraints.md) if environment, compatibility, safety, or rollout limits shape the design
- [../scenarios/investigation.md](../scenarios/investigation.md) if the current system is not understood well enough to edit safely

## Apply

- Restate the problem as a concrete failure, limitation, or missing capability.
- Separate the required end state from the requested tactic.
- Identify the core invariant or contract that should hold after the change.
- List the facts that must be verified from code, schema, logs, or tests before deciding anything.
- Name the highest-cost wrong solution so you do not optimize for local convenience.

## Resolve explicitly

- What problem are you solving at the system level?
- What must remain true while you change it?
- What assumptions are still guesses?
- What would make a technically working solution still wrong?
