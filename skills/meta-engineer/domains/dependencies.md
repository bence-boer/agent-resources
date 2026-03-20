# Domain — Dependencies

## Use when

The task adds libraries, services, configuration, interfaces, protocols, or external runtime assumptions.

## Route next

- [architecture.md](architecture.md) — to keep the new surface in the right boundary
- [security.md](security.md) — if the added surface changes blast radius or secret handling
- [developer-experience.md](developer-experience.md) — to keep setup and debugging sane

## Questions

- What new dependency, interface, or moving part are you introducing? (e.g., library, service, env var, queue, API, build tool)
- What maintenance or failure burden comes with it? (e.g., updates, outages, secrets, version drift, license risk)
- Can you solve the problem with less surface area? (e.g., reuse existing tool, smaller helper, no new protocol, standard library)
- What boundary keeps the rest of the system insulated from this choice? (e.g., wrapper, adapter, stable contract, abstraction layer)
