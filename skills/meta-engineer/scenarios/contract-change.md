# Scenario - Contract change

## Use when

The task changes what one part of the system expects from another or what stored data now means.

## Route next

- [../domains/invariants.md](../domains/invariants.md) to define the contract precisely
- [../domains/state-and-data.md](../domains/state-and-data.md) to restate truth, transitions, and stored meaning
- [../domains/correctness.md](../domains/correctness.md) and [../domains/completeness.md](../domains/completeness.md) to verify both producers and consumers
- [../domains/observability.md](../domains/observability.md) to watch rollout and drift
- [../domains/dependencies.md](../domains/dependencies.md) to identify all consumers

## Default posture

- Restate the contract in precise terms before changing code.
- Update producers, consumers, stored data, and migration strategy together.
- Prefer versioned or staged rollout when compatibility is uncertain.
- Make old and new meaning explicit during transition.

## Resolve explicitly

- Who reads and writes this contract today?
- What must stay compatible, and for how long?
- What existing data must be migrated or interpreted differently?
- How is rollback achieved if the change goes badly?

## Minimum proof

- Migration or compatibility validation
- Consumer review across affected surfaces
- Observability for drift, old clients, or mixed-version behavior
