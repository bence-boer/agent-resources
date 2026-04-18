# Test Strategy and Coverage Planning

> Reference for the QA Engineer skill. Load when the task involves test strategy design, coverage planning, risk prioritization, exploratory testing, or requirements translation.

---

## The Test Automation Pyramid

The pyramid dictates that the vast majority of tests should be low-level unit and integration tests — fast, deterministic, and highly isolated. E2E UI tests sit at the apex: highest fidelity to user behavior but slowest and most brittle.

**Layer distribution:**

| Layer | Proportion | Speed | Fidelity | Brittleness |
|---|---|---|---|---|
| Unit tests | ~70% | Milliseconds | Low (isolated logic) | Very low |
| Integration/API tests | ~20% | Seconds | Medium (service contracts) | Low |
| E2E UI tests | ~10% | Minutes | High (full user path) | High |

**The ice-cream cone anti-pattern** (see SKILL.md Anti-Pattern #1) inverts this distribution — heavy E2E, light unit. Symptoms: massive execution bottlenecks, high maintenance overhead, most defects caught at the slowest layer. The root cause is typically organizational: teams write E2E tests because they're easier to reason about than isolated units, creating a self-reinforcing cycle where the test suite grows slower as the application grows larger.

## Behavior-Driven Development (BDD)

BDD bridges business requirements and technical implementation using ubiquitous natural-language syntax. The standard format is Gherkin: **Given** (preconditions), **When** (action), **Then** (expected outcome).

**Purpose:** Ensures automated tests validate user-centric behaviors rather than internal technical implementations. Aligns product owners, developers, and testers on a shared definition of quality.

**When to use BDD:** When acceptance criteria need explicit, stakeholder-readable validation. Not for low-level unit tests or implementation details.

## Risk-Based Testing (RBT)

RBT quantifies the likelihood of failure against business severity, ensuring automation resources target the highest-risk exposure. Essential in high-velocity release cycles where exhaustive regression is temporally impossible.

**Execution process:**

1. **Identify risk vectors** — assumption analysis, historical defect data, system architecture reviews
2. **Evaluate severity** — categorize into high/medium/low tiers based on business impact
3. **Plan coverage** — target critical user paths (authentication flows, checkout, financial transactions) with rigorous automation
4. **Monitor continuously** — adapt risk assessments based on production telemetry and defect trends

**High-risk paths** receive: targeted fault injection, boundary value analysis, and stress testing. This maximizes defect detection efficiency while minimizing CI/CD pipeline execution time.

## Exploratory Testing and the SFDPOT Heuristic

Automated pipelines suffer from inattentional blindness — they validate only what they are explicitly programmed to check. Exploratory testing leverages human intuition to uncover edge cases, usability flaws, and unexpected state permutations. Unlike scripted test execution, exploratory testing is unscripted and adaptive — testers navigate the application as real users, dynamically adjusting focus based on real-time observations.

To prevent exploratory testing from degrading into aimless interaction, apply the **SFDPOT** (San Francisco Depot) heuristic (Bach) for systematic edge-case discovery across six dimensions:

| Dimension | Evaluative Focus |
|---|---|
| **Structure** | Architectural components, microservice integrations, physical deployment |
| **Function** | Business logic algorithms, expected outputs, capabilities |
| **Data** | Inputs, outputs, state mutations — boundary conditions, invalid formats, data scale |
| **Platform** | Cross-browser variances, OS quirks, network throttling behaviors |
| **Operations** | Real-world usage patterns, overlapping workflows, concurrent sessions |
| **Time** | Session timeouts, async race conditions, timezone handling anomalies |

SFDPOT ensures exploratory tours are comprehensive, uncovering defects in non-obvious integration points that regression scripts bypass.

## Deriving Edge Cases from Production Telemetry

The ultimate oracle for test coverage is actual user behavior. Production telemetry creates a closed-loop quality lifecycle:

1. **Capture** — session recording tools collect DOM mutations, network request payloads, and console errors (developer-centric data beyond heatmaps)
2. **Analyze** — session replays and backend tracing logs reveal unexpected workflow permutations and state data dependencies (e.g., expired idempotency keys) unanticipated during initial test design
3. **Prioritize** — production error logs reveal which theoretical edge cases actually occur, allowing priority based on empirical data rather than speculation
4. **Script** — production-verified edge cases are systematically scripted back into the automation framework

This feedback loop continuously adapts the test suite to real-world application usage.

## Equivalence Partitioning and Boundary Value Analysis

Two complementary techniques for converting acceptance criteria into exhaustive scenarios with minimum execution redundancy.

**Equivalence partitioning** divides input data into partitions where all values trigger the same execution path. Test one representative value per partition to reduce total cases without sacrificing coverage logic.

**Boundary value analysis** targets the extreme edges of partitions, where defects disproportionately cluster. Examples: exact maximum character limit of a form field, exact millisecond a session expires.

**Architectural placement rule:** E2E tests focus strictly on critical user paths. Exhaustive boundary testing involving complex business logic or raw data validation is pushed to API and unit tests. Attempting to cover every boundary case via the UI leads to bloated, slow, and flaky suites.

## Automated Traceability Matrices in CI/CD

The traditional Requirement Traceability Matrix (RTM) — a static spreadsheet mapping tests to requirements — is replaced in modern CI/CD by dynamic, fully automated traceability.

**Implementation pattern (Playwright + Jira Xray):**

1. Test management systems integrate natively with issue trackers
2. Bi-directional mapping: forward (requirement → validating tests) and backward (test failure → impacted business goal)
3. Mapped entities include commits, pull requests, automated test execution results, and requirement tickets
4. Test APIs submit JUnit XML or JSON reports upon pipeline completion
5. Developers open a Jira story and instantly view linked automation execution status
6. On test failure, the framework automatically generates a defect ticket with attached trace files and network logs

This provides a continuous audit trail for compliance and accelerates root-cause analysis.
