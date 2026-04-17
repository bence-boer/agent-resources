---
name: sdlc
description: >
  Software development lifecycle process guidance — phase execution, artifact
  specification, and quality gate management using ISO/IEC 12207 lifecycle
  processes, V-Model verification/validation, IEEE 830/1016/1028/829 standards,
  Fagan Inspections, OWASP ASVS, Requirements Traceability Matrix, ITIL Service
  Transition, and Change Advisory Board governance. Covers all seven phases from
  project initiation through release management with three-tier scaling
  (lightweight to formal). Use when executing any SDLC phase, identifying where
  a project stands, defining requirements, planning architecture, conducting
  formal reviews, managing releases, or when someone asks "what do I do next?"
  "are we ready for the next phase?" "what artifacts do I need?" or "how formal
  should this be?" Also triggers for phase gate reviews, traceability questions,
  process assessment, and lifecycle oversight. Do NOT use for agent orchestration,
  tool/platform configuration, code-level patterns, or agile ceremony design.
---

# Software Development Lifecycle

Prescribe, assess, and coordinate software development lifecycle processes — from project initiation through release management — at any scale of formality.

## Expert vocabulary

**Lifecycle Governance & Standards:** ISO/IEC 12207 (software lifecycle processes), V-Model (verification-left/validation-right), phase gate (Cooper), earned value management (EVM), Software Project Management Plan (SPMP)

**Requirements & Traceability:** IEEE 830 Software Requirements Specification (SRS), Requirements Traceability Matrix (RTM), one-hundred-percent rule (WBS), Human-Centered Design (ISO 9241-210), functional vs non-functional requirements, acceptance criteria

**Architecture & Security Design:** IEEE 1016 Software Design Description (SDD), OWASP ASVS Level 3, threat modeling (STRIDE/Shostack), Documented Security Decisions (DSDs), Security Requirements Driven Development (SRDD)

**Inspection & Quality Assurance:** Fagan Inspection (6 operations: planning/overview/preparation/inspection/rework/follow-up), IEEE 829 Test Plan, SAST/DAST, system verification vs system validation, Plan-Do-Check-Act (PDCA/Deming), User Acceptance Testing (UAT)

**Review & Release Governance:** IEEE 1028 (reviews and audits), Change Advisory Board (CAB/ITIL), Service Validation and Testing (SVT), Configuration Management Database (CMDB), deployment strategy (canary/blue-green/phased rollout), rollback plan, post-implementation review

## Anti-pattern watchlist

**Documentation and specification failures**

### 1. Requirements Amnesia
**Detection:** Development begins before requirements are documented. Requirements exist as verbal agreements, chat messages, or scattered tickets without a unified specification. No RTM exists. Developers ask "what should this do?" during implementation.
**Resolution:** Complete requirements specification before architecture begins. Every requirement must be atomic, unambiguous, and testable. Initialize the RTM immediately — every requirement gets a unique ID that traces forward through design, implementation, and test. Requirements rework cost grows exponentially with each downstream phase it crosses.

### 2. Traceability Gap
**Detection:** Test cases cannot be linked to specific requirements. Features exist without corresponding RTM entries. The RTM was created once and never updated. Coverage is measured by lines of code, not by requirement coverage.
**Resolution:** The RTM is a living artifact — update it in every phase. Forward-trace: every requirement maps to a design element, implementation component, and test case. Backward-trace: every test case maps to the requirement it validates. If an artifact cannot be traced, it is either unauthorized scope or an orphaned requirement.

### 3. Change-Log Documentation
**Detection:** Documentation files accumulate entries describing what changed, what was fixed, what was found, or what was attempted. "Previous state" or "original approach" sections exist. Outdated plans, resolved issues, superseded decisions, or already-addressed known problems remain in the documentation folder. Agents reading the docs receive a mixture of current and obsolete information with no reliable way to distinguish them.
**Resolution:** Documentation must describe the current state of the system as if it were always true — not the history of changes or the sequence of problems encountered. The moment any artifact, plan, issue, or decision is superseded or resolved, update or remove it immediately. A docs folder containing outdated plans is an active liability: it misleads agents and reviewers with false information. Working notes and active plans belong in a designated working directory (e.g., `docs/plans`), which applies the same removal discipline — entries are removed as soon as the work is complete.

**Security and design failures**

### 4. Security as Afterthought
**Detection:** No threat model produced during architecture. Security review happens only during QA as penetration testing. No Documented Security Decisions exist. Security requirements are absent from the specification.
**Resolution:** Integrate threat modeling during architecture, not testing. Produce DSDs before implementation. Treat security requirements as first-class functional requirements. Addressing vulnerabilities after construction costs 6–30× more than addressing them during design (NIST).

### 5. Architecture Bypass
**Detection:** Construction begins directly from requirements without a design document. Data models, API contracts, and module boundaries emerge organically during implementation. Architectural decisions are made implicitly by whoever writes first.
**Resolution:** Complete the Software Design Description before writing production artifacts. Every architectural decision must be explicit, documented, and ratified. An unwritten architecture is not "agile" — it is an architecture decided by accident.

**Review and quality failures**

### 6. Rubber-Stamp Gate
**Detection:** Phase transitions happen without documented review. Entry/exit criteria are not defined or routinely waived. Reviews consist of "looks good" without structured evaluation. The same person authors and approves the work.
**Resolution:** Define explicit entry and exit criteria for each phase gate before the project begins. Conduct reviews with role segregation — the author cannot lead the review. Document findings and disposition. A gate that never rejects anything is not a gate.

### 7. Informal Inspection
**Detection:** Review is a single approver clicking "approve." No designated roles (reader, reviewer, moderator). No defect log produced. Review comments are suggestions, never blocking findings. Average review time is under 5 minutes for substantial changes.
**Resolution:** Scale formality to risk: full Fagan Inspection for high-risk components (security, financial, safety), structured review with documented findings for standard work. At minimum, every review must produce a written record of what was examined and what was found.

### 8. Symptom-Only Defect Resolution
**Detection:** A defect is closed by patching the observable failure without root-cause investigation. The fix is scoped to "make the test pass," "suppress the error," or "work around the edge case." The root cause is deferred as "out of scope," "too large," or "a separate task." The same failure class recurs in later iterations.
**Resolution:** Every defect fix must begin with root-cause analysis. The scope of the correct fix is whatever the root cause requires: a targeted change, a refactor, a new feature, or an architectural revision. Scope constraints never justify a patch over the correct solution. A fix that does not address the cause has not resolved the defect — it has deferred it and obscured it.

**Construction and delivery failures**

### 9. Big Bang Integration
**Detection:** All modules developed and unit-tested in isolation, then assembled at once near the end of the schedule. Integration defects discovered during system testing or acceptance testing. Interface contracts not verified incrementally.
**Resolution:** Integrate incrementally. Test module interfaces as they connect, not after everything is assembled. Integration testing validates that individually correct components communicate correctly — this is a distinct verification concern that cannot be deferred.

### 10. Deploy-and-Pray
**Detection:** Release plan has no rollback procedure. Deployment strategy assumes success. No pre-deployment validation in a staging environment. CMDB update is not part of the release checklist. No Change Advisory Board review or equivalent governance.
**Resolution:** Every release requires: a tested rollback procedure, pre-deployment validation (SVT), stakeholder authorization (CAB or equivalent), and post-deployment CMDB update. The deployment strategy must be chosen based on risk profile — canary, blue-green, or phased rollout. A release without a rollback plan is an irreversible bet.

## Owned surface and non-goals

**This skill owns:**
- Lifecycle process guidance across all seven phases (initiation through release)
- Phase identification — diagnosing where a project or task sits in the lifecycle
- Phase execution — roles, responsibilities, inputs, outputs, procedures, quality gates
- Cross-phase traceability — maintaining the RTM thread from requirements through release
- Formal verification gates — entry/exit criteria between phases
- Process scaling — adapting formality to context while preserving discipline
- Artifact specification — what each phase must produce before the next begins

**Non-goals:**
- Agent orchestration or multi-agent coordination (how agents work together)
- Specific technology, tool, or platform implementation (environment-agnostic)
- Code-level implementation patterns (how to write code)
- Agile ceremony design (which methodology frames the iterations)
- Domain-specific business requirements (what requirements to write, not how)
- Detailed security testing execution (lifecycle process aspects only; specialized depth belongs to security disciplines)
- Detailed QA test automation (QA strategy and test planning only; specific test framework patterns belong to QA disciplines)

When composed with orchestration disciplines, this skill provides the domain content — orchestration manages how agents coordinate around that content.

## Phase overview matrix

| Phase | Purpose | Key Artifact | Gate Criterion |
|-------|---------|-------------|----------------|
| 1. Initiation | Scope, structure, agreements | SPMP, WBS | WBS satisfies 100% rule; SPMP ratified |
| 2. Requirements | Elicit, specify, trace | SRS, RTM, UX artifacts | Every requirement atomic, testable, traced |
| 3. Architecture | Translate what → how | SDD, threat model, DSDs | SDD maps all requirements; threat model complete |
| 4. Implementation | Construct and inspect | Reviewed artifacts, SAST | Fagan/structured inspection passed; SAST clean |
| 5. QA & Verification | Prove correctness | Test reports, updated RTM | IEEE 829 plan executed; RTM fully forward/backward traced |
| 6. Review | Governance sign-off | IEEE 1028 reports | All anomalies resolved; formal sign-off obtained |
| 7. Release | Deploy and transition | Live system, CMDB update | CAB authorized; SVT passed; rollback tested |

## Routing matrix

| If the task involves... | Load this reference |
|------------------------|---------------------|
| Project initiation, scoping, WBS, SPMP, agreements, requirements engineering, SRS, security requirements, RTM setup, UX/HCD specification, design handoff | [references/planning.md](references/planning.md) |
| Technical architecture, SDD, security design, OWASP ASVS, threat modeling, data modeling, API specification, coding standards, Fagan inspections, SAST, implementation protocols | [references/design-and-construction.md](references/design-and-construction.md) |
| Test planning, IEEE 829, integration/system/acceptance testing, DAST, RTM updates, IEEE 1028 reviews, audits, formal sign-off, release management, CAB, deployment, rollback, CMDB, SVT | [references/verification-and-delivery.md](references/verification-and-delivery.md) |
| Full lifecycle oversight, process assessment, phase identification, scaling decisions | Root only — do not load references |

## Behavioral instructions

1. **Identify the lifecycle context:** Which phase is the task in, or is this a cross-phase oversight question? If ambiguous, ask what artifacts exist — the presence or absence of SRS, SDD, test plan, etc. determines the current phase.
2. **Scan for anti-patterns** from the watchlist above. Flag any detected anti-patterns with their name and resolution before proceeding.
3. **Assess the formality tier** (see Scaling Guide below): Is this lightweight, standard, or formal context? Adjust ceremony expectations accordingly, but never compromise the scaling invariants.
4. **Apply documentation discipline (Anti-Pattern #3):** All artifacts must describe current state as of now — supersede immediately, never append corrections or 'as of' notes. See [references/planning.md](references/planning.md) for the full documentation discipline protocol including the rolling documentation rules, working directory convention, and documentation manifest requirements.
5. **IF single-phase task:** Load the matching reference file from the routing matrix and follow its procedures. Verify prior phase outputs are complete before starting the current phase.
6. **IF cross-phase or oversight:** Use the phase overview matrix. Identify the current phase, verify all prior phase outputs are complete, diagnose gaps, and prescribe next steps with priority ordering.
7. **Produce actionable output:** Every response must include specific artifact requirements, gate criteria, and recommended actions — not general advice.

## Scaling guide

The seven phases are invariant — every project moves through all of them. What scales is the formality of each phase, not whether it exists.

| Aspect | Lightweight | Standard | Formal |
|--------|------------|----------|--------|
| Requirements | Structured document; testable requirements | Full SRS; stakeholder sign-off | IEEE 830 SRS; legal review |
| Traceability | Simple table: requirement → test | RTM with forward/backward trace | Full RTM with audit trail |
| Architecture | Brief design doc; key decisions documented | SDD with module/data/API specification | IEEE 1016 SDD; threat model; DSDs |
| Security | Trust boundary analysis; input validation focus | OWASP ASVS Level 1–2; threat model | OWASP ASVS Level 3; manual threat validation |
| Inspection | Structured review; documented findings; no self-approval | Defined reviewer roles; defect log; entry/exit criteria | Full Fagan Inspection with 6 operations |
| Testing | Test plan; critical path coverage; RTM update | IEEE 829 Test Plan; integration + system + acceptance | Full IEEE 829; independent verification; UAT sign-off |
| Review | Peer technical review; documented disposition | Technical + management review | IEEE 1028 formal review with auditors |
| Release | Rollback plan; staging validation | CAB-equivalent review; deployment strategy selection | Full CAB; SVT; CMDB update; post-implementation review |

**Scaling invariants — what never scales down to zero:**
1. **Testable requirements** — Requirements must exist in written form and be testable, at every scale
2. **Traceability** — Every test must trace to a requirement, at every scale
3. **Test-first verification** — Implementation proceeds test-first at every scale: tests are written or specified before the components they validate are implemented, and the system remains in a passing state for all completed components throughout development. A component without passing tests is a draft, not a deliverable. "Tests will be added later" is not a valid intermediate state at any scale.
4. **Documented architecture decisions** — The design document can be abbreviated, but key decisions cannot be skipped
5. **Author-separate review** — The person who created the work cannot be the sole reviewer, at every scale
6. **Root-cause defect resolution** — Defects are resolved at the cause, not the symptom. A patch that makes a test pass without addressing the underlying issue is not a resolution at any scale. When a defect is found, the correct fix is the one that eliminates the cause — regardless of the scope that requires.
7. **Rollback capability** — Every deployment must have a defined reversion path, at every scale
8. **Gate criteria** — Every phase transition must have defined completion criteria, at every scale

The phases scale in formality. The discipline is constant.

## Examples

### Pair 1 — Phase transition without artifact verification

**BAD:**
```
The stakeholder described what they want. Start implementing the features
they mentioned. We'll figure out the database schema as we go and add
security checks during testing.
```
Problems: No SRS produced. No SDD or architecture phase. Security deferred to testing (Anti-Pattern #4). No RTM initialized (Anti-Pattern #2). Architecture decided by accident (Anti-Pattern #5).

**GOOD:**
```
The stakeholder input has been captured. Before implementation can begin:

Phase 2 gate check:
- [ ] SRS complete: all requirements are atomic, unambiguous, testable
- [ ] RTM initialized: every requirement has a unique ID
- [ ] UX/HCD artifacts: design handoff documents produced

Phase 3 gate check (must complete before Phase 4):
- [ ] SDD produced: architecture maps requirements to modules
- [ ] Threat model complete: STRIDE analysis against all trust boundaries
- [ ] Documented Security Decisions: security controls specified per component
- [ ] API contracts and data models: defined and ratified

Current status: Phase 2 incomplete. Next action: complete the SRS from
stakeholder input, then initialize RTM before proceeding to architecture.
```

### Pair 2 — Scaling formality to context

**BAD:**
```
This is a small internal tool for the team. Follow full IEEE 830 SRS
format, conduct formal Fagan Inspections with 6 designated roles,
establish a Change Advisory Board, and produce IEEE 1028 review reports
before deploying.
```
Problems: Full formal ceremony applied to lightweight context. Six Fagan roles require more people than the team has. CAB governance for an internal tool adds disproportionate overhead.

**GOOD:**
```
Context: Small internal tool, 3-person team, low risk profile.
Scaling tier: Lightweight.

Phase 2 (Requirements): Structured requirements document — not full IEEE 830,
but every requirement must still be testable and traced. RTM as a simple
table mapping requirements to test cases.

Phase 3 (Architecture): Brief design document covering module structure,
data model, and key decisions. Threat model scoped to trust boundaries
that handle user input.

Phase 4 (Implementation): Structured review with documented findings —
not full Fagan, but author cannot self-approve and review must produce a
written record.

Phase 5 (QA): Test plan identifying what is tested, what is excluded, and
pass/fail criteria. RTM updated with test results.

Phase 6 (Review): Peer technical review confirming the release candidate
meets stated requirements.

Phase 7 (Release): Rollback procedure documented. Deployment to staging
first. Update tracking of what is in production.

What scales: ceremony, documentation volume, role segregation.
What doesn't scale: traceability, documented decisions, testable
requirements, rollback capability, review before release.
```

### Pair 3 — Lifecycle oversight with phase diagnosis

**BAD:**
```
The project seems to be going okay. Some code has been written and there
are a few tests. I think we should keep going and do a review when it
feels ready.
```
Problems: No phase identification. No artifact verification. "Feels ready" is not a gate criterion. No traceability assessment. Rubber-stamp review anticipated (Anti-Pattern #6).

**GOOD:**
```
## Lifecycle Assessment

### Artifact Inventory
- SRS: Exists (23 requirements documented, all with unique IDs)
- RTM: Exists but stale (last updated during Phase 2, 8 requirements lack
  forward-trace to design elements)
- SDD: Partial (module structure defined, API contracts incomplete, no
  threat model)
- Implementation: ~60% of modules have artifacts, ~40% have unit tests
- Test Plan: Does not exist
- Review reports: None

### Phase Diagnosis
Current state: Mid-Phase 4 (Implementation) with incomplete Phase 3
outputs. The SDD is partial — API contracts and threat model are missing,
meaning implementation is proceeding against an incomplete architecture
(Anti-Pattern #5: Architecture Bypass).

### Traceability Status
8 of 23 requirements lack forward-trace to design elements (Anti-Pattern
#2: Traceability Gap). These must be resolved before Phase 5 testing can
meaningfully validate requirement coverage.

### Recommended Actions (priority order)
1. Complete the SDD: finalize API contracts and produce threat model.
   Implementation of dependent modules should pause until architecture
   is ratified.
2. Update the RTM: trace all 23 requirements forward through SDD elements
   and existing implementation.
3. Produce IEEE 829 Test Plan before any system-level testing begins.
4. Schedule formal review (Phase 6) only after Phase 5 testing is complete
   and RTM shows full forward/backward coverage.
```

## Questions this skill answers

- What phase is my project in right now?
- Are we ready to move to the next phase?
- What artifacts do I need before proceeding?
- How formal should this project's process be?
- What does a proper requirements specification include?
- How do I set up a Requirements Traceability Matrix?
- What goes into the Software Design Description?
- When and how should threat modeling happen?
- What is a Fagan Inspection and when do I need one?
- How do I write an IEEE 829 Test Plan?
- What are the entry/exit criteria for each phase?
- How do I conduct an IEEE 1028 formal review?
- What does the Change Advisory Board process look like?
- How do I plan a release with proper rollback capability?
- What can I scale down for a small team without losing discipline?
- How do I assess a project's lifecycle health?
- What are the most common process failures in software development?
- How do I ensure traceability from requirements through testing?
- What security artifacts are needed during architecture?
