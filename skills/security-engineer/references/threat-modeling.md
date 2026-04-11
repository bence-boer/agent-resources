# Threat Modeling

Deep reference for structured threat analysis. Load when designing secure architecture, assessing threats to a system, or performing trust boundary analysis.

## Framework Selection

| Framework | Use When | Limitations |
| --- | --- | --- |
| **STRIDE (Shostack)** | Systematic threat enumeration against DFD elements. Best for engineering teams analyzing specific data flows. | Technology-centric; lacks business impact context. Must be supplemented with risk scoring. |
| **PASTA** (7-stage) | Complex enterprise systems requiring alignment of technical risk with business impact. Attacker-centric. | Heavy process overhead; requires threat intelligence inputs and iterative refinement. |
| **DREAD** | Quantitative risk scoring to prioritize mitigations from a STRIDE analysis. | Subjective scoring without calibration leads to inconsistent results across teams. |
| **LINDDUN** | Privacy-centric threat analysis — Linkability, Identifiability, Non-repudiation, Detectability, Disclosure, Unawareness, Non-compliance. | Narrow scope; does not address availability, integrity, or traditional security threats. |
| **OCTAVE** | Organizational risk assessment focused on assets and strategic business impact. | Low technical granularity; insufficient for implementation-level threat discovery. |

IF unsure which framework to use: default to STRIDE for technical analysis. Add PASTA stages 1 (business alignment) and 7 (risk/impact) for business context.

## STRIDE Threat Categories

Apply each category to every element in the data flow diagram. A trust boundary crossing triggers analysis for all six categories.

| Category | Question to Ask | What It Targets | Common Controls |
| --- | --- | --- | --- |
| **Spoofing** | Can an attacker impersonate a legitimate entity? | Identity, authentication | MFA, certificate pinning, mutual TLS, signed tokens |
| **Tampering** | Can data be modified in transit or at rest without detection? | Integrity | HMAC, digital signatures, checksums, immutable storage |
| **Repudiation** | Can an actor deny performing an action? | Accountability | Audit logs, signed timestamps, non-repudiation tokens |
| **Information Disclosure** | Can sensitive data leak to unauthorized parties? | Confidentiality | Encryption (TLS, AES-GCM), field-level filtering, data classification |
| **Denial of Service** | Can the system be made unavailable? | Availability | Rate limiting, circuit breakers, autoscaling, request size limits |
| **Elevation of Privilege** | Can an attacker gain higher permissions than authorized? | Authorization | RBAC/ABAC enforcement, input validation, sandboxing, least privilege |

## PASTA Methodology: Seven-Stage Lifecycle

1. **Define Objectives (DO):** Align security with business priorities. Identify critical business functions, compliance requirements, and risk tolerance. Output: business impact analysis and security objectives.
2. **Define Technical Scope:** Catalog the technology environment — infrastructure, dependencies, third-party integrations, network boundaries. Output: system boundary definition.
3. **Decompose the Application:** Map internal architecture — use cases, user roles, privilege levels, data stores, processing nodes, trust boundaries. Output: detailed architectural diagrams and DFDs.
4. **Analyze Threats:** Correlate threat agents, motives, and attack vectors using incident logs, SIEM data, and external threat intelligence. Output: attack scenario landscape.
5. **Vulnerability Analysis:** Assess structural weaknesses and logic flaws mapped to the nodes identified in stage 3. Output: vulnerability-to-node mapping.
6. **Attack Modeling:** Simulate specific attack paths exploiting identified vulnerabilities. Prove viability of threats against the application's attack surface. Output: validated attack trees.
7. **Risk and Impact Analysis:** Identify gaps in existing controls, calculate residual risk, formulate mitigation roadmap. Output: risk profile and prioritized countermeasures.

## Data Flow Diagrams and Trust Boundaries

A DFD maps how data moves through a system. Every trust boundary crossing is a mandatory security analysis point.

### DFD Elements

| Element | Symbol | Security Significance |
| --- | --- | --- |
| **Process** | Circle/rounded rectangle | Computational task that modifies or routes data. Validate inputs, enforce authorization. |
| **Data Store** | Parallel lines | Where data rests. Does not modify data. Requires access control, encryption at rest. |
| **External Entity** | Rectangle | Actor outside system control (user, external API). Source of untrusted input. |
| **Data Flow** | Arrow | Vector of data movement. Requires integrity protection, confidentiality controls. |
| **Trust Boundary** | Dashed line | Point where trust level fundamentally changes. Mandatory enforcement point. |

### Trust Boundary Identification Rules

1. Every point where data passes from a more trusted to a less trusted environment (or vice versa) is a trust boundary.
2. Common trust boundaries: browser ↔ server, server ↔ database, internal service ↔ external API, container ↔ host, user input ↔ application logic.
3. IF a trust boundary is not fortified with authentication, validation, or encryption controls: it is an exploitable gap. Adversaries target implicit trust — internal services parsing external vendor XML, thick clients writing directly to backend databases, microservices accepting unvalidated inter-service calls.
4. Advanced methodology: use dynamic instrumentation to generate object trace logs describing contexts where securable objects are defined and used. These logs reveal privilege elevation paths invisible to static DFD analysis.

## Threat Model Output Format

A threat model deliverable should contain:

```
## System Overview
[Brief description, key assets, actors]

## Trust Boundaries
[Numbered list of identified boundaries with elements on each side]

## Threat Table
| ID | STRIDE Category | Component | Threat Description | Likelihood | Impact | Risk | Mitigation |
|----|----------------|-----------|-------------------|------------|--------|------|------------|

## Residual Risks
[Threats accepted or partially mitigated, with monitoring strategy]

## Assumptions
[Trust assumptions that, if violated, invalidate the model]
```
