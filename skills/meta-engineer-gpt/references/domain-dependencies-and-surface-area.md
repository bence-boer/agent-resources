# Domain - Dependencies and surface area

## Use when

Use when the task adds libraries, services, configuration, interfaces, protocols, or external runtime assumptions.

## Route next

- [domain-architecture-fit.md](domain-architecture-fit.md) - to keep the new surface in the right boundary
- [domain-risk-and-safety.md](domain-risk-and-safety.md) - if the added surface changes blast radius or secret handling
- [domain-developer-experience.md](domain-developer-experience.md) - to keep setup and debugging sane

## Questions

- What new dependency, interface, or moving part are you introducing? Examples: library, service, env var, queue
- What maintenance or failure burden comes with it? Examples: updates, outages, secrets, version drift
- Can you solve the problem with less surface area? Examples: reuse existing tool, smaller helper, no new protocol
- What boundary keeps the rest of the system insulated from this choice? Examples: wrapper, adapter, stable contract
