# Design & Construction: Technical Architecture & Implementation

Phases 3–4 of the software development lifecycle. These phases translate requirements into a technical blueprint and then construct the system against that blueprint with formal inspection.

## Phase 3: Technical Architecture and Security Design

### Purpose

Translate abstract requirements into a formalized technical blueprint. Governed by IEEE 1016, the Software Design Description (SDD) maps requirements to modules, defines data models, establishes interfaces, and documents the rationale behind every architectural decision. The design specification must precede implementation entirely — it proactively guides construction rather than retroactively describing a completed build.

### Responsible Roles

| Role | Responsibilities |
|------|-----------------|
| Lead System Architect | Develops overarching system architecture; owns the SDD |
| Security Architect | Conducts threat modeling; produces DSDs; ensures OWASP ASVS compliance |
| Database Administrator | Defines database schemas and data models |
| Lead Engineer | Reviews architectural feasibility; defines API contracts and module boundaries |

### Formal Inputs

- IEEE 830 SRS (from Phase 2)
- Requirements Traceability Matrix (from Phase 2)
- Design Handoff Artifacts (from Phase 2)

### Formal Outputs

| Artifact | Description |
|----------|-------------|
| IEEE 1016 Software Design Description (SDD) | Structural organization mapping requirements to modules, data models, interfaces, and decision rationale |
| Documented Security Decisions (DSDs) | Explicit design intent behind security controls, cryptographic implementations, and authorization mechanisms |
| System Threat Model | Manual threat analysis assuming full access to proposed architecture; identifies attack vectors and business logic flaws |
| API Specifications | Interface contracts for all internal and external APIs |
| Database Schemas | Data model definitions with integrity constraints |

### Key Procedures

**Software Design Description (IEEE 1016):**
- Map every requirement from the SRS to specific modules in the SDD
- Define complex data models and establish internal/external interfaces
- Document the rationale behind every architectural decision — an undocumented decision is a decision made by accident
- The SDD must be complete before construction begins

**Security Architecture (OWASP ASVS):**
- ASVS Level 3 (Advanced Verification) is required for high-stakes applications: architectural resilience, deep threat modeling, defensive design paradigms
- ~30% of ASVS requirements are unique to Level 3, demanding manual verification beyond automated scanning
- Security cannot be deferred to downstream testing — it must be ingrained in the foundational architecture

**Threat Modeling:**
- Conduct manually, assuming full access to proposed architecture
- Anticipate sophisticated attack vectors and complex business logic flaws that automated testing overlooks
- Produce Documented Security Decisions capturing explicit design intent
- Security Requirements Driven Development (SRDD): transform security mandates into standard, testable development requirements

### Gate Criteria (Exit)

- [ ] SDD maps every SRS requirement to a design element
- [ ] Threat model complete — STRIDE analysis against all trust boundaries
- [ ] Documented Security Decisions produced for all security-critical components
- [ ] API contracts and data models defined and ratified
- [ ] RTM updated — every requirement now traces forward to a design element

### Scaling Notes

| Aspect | Lightweight | Standard | Formal |
|--------|------------|----------|--------|
| SDD | Brief design doc; module structure and key decisions | Full SDD with module/data/API specification | IEEE 1016 SDD with complete decision rationale |
| Security | Trust boundary analysis; input validation focus | OWASP ASVS Level 1–2; threat model for high-risk surfaces | OWASP ASVS Level 3; manual threat validation; DSDs for all components |
| Threat Model | Scoped to trust boundaries handling external input | STRIDE analysis on key attack surfaces | Comprehensive manual threat analysis assuming full architectural access |

---

## Phase 4: Implementation Protocols and Formal Inspection

### Purpose

Transform architectural models and specifications into executable artifacts. The hallmark of a rigorous implementation phase is not merely the generation of artifacts, but the formal mechanism by which they are systematically reviewed and validated. Ad-hoc peer reviews are replaced by structured or formal inspections to eliminate authorship bias and single-source reliance.

### Responsible Roles

| Role | Responsibilities |
|------|-----------------|
| Developer (Author) | Translates the SDD into executable artifacts; conducts unit tests |
| Reader | Paraphrases artifact logic during inspection; distinct from the author |
| Reviewer | Analyzes from testing, architectural, and security standpoints |
| Moderator | Controls inspection pacing; ensures process adherence; verifies follow-up |
| Recorder | Logs every identified defect during the inspection meeting |

### Formal Inputs

- IEEE 1016 SDD (from Phase 3)
- OWASP ASVS Documented Security Decisions (from Phase 3)
- Design Handoff Artifacts (from Phase 2)
- Coding Standards documentation

### Formal Outputs

| Artifact | Description |
|----------|-------------|
| Reviewed Source Artifacts | Implementation artifacts that have passed formal inspection |
| Fagan Inspection Defect Logs | Structured record of all defects identified during inspection |
| Unit Test Results | Automated verification of individual component correctness |
| SAST Reports | Static Application Security Testing results identifying vulnerabilities in source artifacts |

### Key Procedures

**Fagan Inspection (6 Operations):**
1. **Planning:** Prepare materials and assign roles
2. **Overview:** Educate participants on the specific modules under review
3. **Preparation:** Participants independently review the item, cross-referencing the SDD to note potential defects
4. **Inspection Meeting:** Synchronized session — the Reader paraphrases logic, Reviewers analyze from testing/architectural/security standpoints, the Moderator controls pacing, the Recorder logs defects. The Author is forbidden from leading the meeting
5. **Rework:** Author resolves the logged defects
6. **Follow-up:** Moderator verifies corrections satisfy exit criteria without introducing regressions

**Static Application Security Testing (SAST):**
- Automated analysis of source artifacts for known vulnerability patterns
- Complements (does not replace) manual inspection
- Results feed into the defect tracking system

**Implementation Discipline:**
- Write tests or test specifications before implementing each component — not after
- At no point during implementation should the system be in a non-passing state for previously completed components. New work may introduce failing tests for new requirements, but must not break existing passing tests
- A component without passing tests is a draft, not a delivered implementation. "Tests are blocked pending the feature" and "tests will be added in the next pass" are not valid intermediate states
- Test coverage must trace to requirements via the RTM — tests that do not correspond to a documented requirement are either orphaned or indicate an undocumented requirement that must be added
- The self-correction loop (implement → test → fix → test) runs at the component level before any integration step
- Construction is tightly bound by the SDD — deviations require formal change requests
- Every architectural decision from the SDD governs construction choices
- Unit tests verify individual component correctness before integration

**Commit Discipline:**
- Each commit represents one complete logical unit: a coherent, independently meaningful change with a clear, information-dense description. A commit is not a save point or a progress marker
- Fix commits must be consolidated with the parent commit they repair before integration (via interactive rebase, fixup, or equivalent). A change followed by a chain of "fix", "tweak", or "retry" commits is not a clean commit history and must be rewritten before the branch integrates
- Commit messages describe the change, not the process: "Add input validation for authentication endpoint" not "More auth work" or "Fix auth again". Messages must pass the repository commit-message convention without exception
- After every commit, push to the remote immediately. In multi-author or parallel-track environments, unpushed commits create invisible state that causes conflicts when the next work stream begins
- Commit operations are unconditionally sequential regardless of how many implementation tracks are active — any approach that produces concurrent commits creates ordering conflicts, rebase hazards, and history fragmentation

### Gate Criteria (Exit)

- [ ] All implementation artifacts have passed structured or formal inspection
- [ ] Fagan inspection defect logs show all identified defects resolved
- [ ] Unit tests pass for all completed components
- [ ] All new components have passing tests written before or alongside implementation — no test-debt deferred
- [ ] No previously passing tests broken by new commits
- [ ] SAST reports reviewed — no unaddressed critical or high-severity findings
- [ ] Commit history is clean: each commit is a complete logical unit, fix chains consolidated
- [ ] All commits pushed to remote; no local-only commit state
- [ ] RTM updated — every design element now traces forward to an implementation artifact

### Scaling Notes

| Aspect | Lightweight | Standard | Formal |
|--------|------------|----------|--------|
| Inspection | Structured review; documented findings; author cannot self-approve | Defined reviewer roles; defect log; entry/exit criteria | Full Fagan Inspection with all 6 operations and role segregation |
| SAST | Basic automated scan on critical components | Automated scan on full codebase with triaged results | SAST integrated into build pipeline; manual review of all findings |
| Unit Testing | Critical path coverage; tests for key business logic | Comprehensive unit tests; branch coverage targets | Full unit test suite with coverage thresholds enforced |
