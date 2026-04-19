# Planning: Project Initiation & Requirements Engineering

Phases 1–2 of the software development lifecycle. These phases define the project's scope and specify what must be built before any design or construction begins.

## Phase 1: Project Initiation, Agreement, and System Breakdown

### Purpose

Formalize the administrative, financial, and structural constraints within which the entire engineering effort operates. Quantify, document, and approve project boundaries before any technical specification or architectural modeling begins. This phase safeguards against unilateral scope expansion and ensures all subsequent technical activities remain aligned with the overarching strategy and acquisition agreement.

### Responsible Roles

| Role | Responsibilities |
|------|-----------------|
| Project Manager | Owns the SPMP, schedule, and resource allocation; chairs project governance |
| System Acquirer / Sponsor | Defines business needs; ratifies scope and budget; signs the agreement |
| Lead Enterprise Architect | Ensures alignment with enterprise architecture and existing systems |
| Financial Controller | Validates budget baselines and earned value tracking setup |

### Formal Inputs

- Business needs assessment
- Legacy system state documentation
- Enterprise strategies and constraints
- Regulatory and procurement mandates
- Preliminary stakeholder goals

### Formal Outputs

| Artifact | Description |
|----------|-------------|
| Software Project Management Plan (SPMP) | Definitive administrative governing document: organizational structure, engineering environment, schedule, risk management, safety/security management |
| Work Breakdown Structure (WBS) | Product-oriented decomposition of scope into quantifiable deliverables, governed by the one-hundred-percent rule |
| Resource Allocation Matrix | Maps work packages to responsible roles and resource commitments |
| Customer-Supplier Agreement | Formal ratification of scope, deliverables, timeline, and acceptance criteria |

### Key Procedures

**Work Breakdown Structure (WBS):**
- Must encapsulate the entirety of work defined by the project scope (one-hundred-percent rule)
- Any task not explicitly categorized within the WBS is formally out of scope
- Formats: tree diagram (stakeholder presentations), outline (detailed documentation), tabular (resource tracking)
- Enables accurate cost estimation and establishes the baseline for earned value metrics

**SPMP Construction:**
- Documents project organizational structure, required engineering environment, management of safety and security characteristics
- Serves as the administrative governing document for the project's duration
- Must incorporate centralized oversight mechanisms in regulated environments

### Gate Criteria (Exit)

- [ ] WBS satisfies the one-hundred-percent rule — every deliverable accounted for
- [ ] SPMP ratified by all stakeholders
- [ ] Resource allocation matrix complete
- [ ] Customer-supplier agreement signed
- [ ] Risk management protocols defined and documented

### Scaling Notes

| Aspect | Lightweight | Standard | Formal |
|--------|------------|----------|--------|
| WBS | Simple task list with owner assignments | Hierarchical WBS with work packages | Full WBS with earned value tracking baselines |
| SPMP | Project charter / brief plan document | Structured SPMP with risk and resource sections | Full SPMP per IEEE standards with governance protocols |
| Agreement | Written scope statement; email confirmation | Formal statement of work | Legal contract with acceptance criteria and penalties |

---

## Phase 2: Requirements Engineering and Human-Centered Specification

### Purpose

Elicit, analyze, and document system requirements with absolute precision. Governed by IEEE 830, this phase creates the contractual agreement between stakeholders and the engineering team regarding exact functional and non-functional capabilities. Requirements engineering prevents costly downstream redesigns by providing a realistic basis for evaluating risks and generating schedule estimates.

### Responsible Roles

| Role | Responsibilities |
|------|-----------------|
| Requirements Engineer / Business Analyst | Elicits, analyzes, and documents requirements; maintains the SRS |
| UX/UI Designer | Engineers user experience as testable system requirements per ISO 9241-210 |
| Product Owner | Prioritizes requirements; represents stakeholder interests |
| System Architect | Reviews requirements for technical feasibility and architectural implications |
| Security Analyst | Identifies security requirements as first-class functional requirements |

### Formal Inputs

- SPMP (from Phase 1)
- Business needs assessment
- Target user demographics
- Regulatory compliance constraints

### Formal Outputs

| Artifact | Description |
|----------|-------------|
| IEEE 830 Software Requirements Specification (SRS) | Contractual specification of functional and non-functional capabilities; every requirement atomic, unambiguous, testable |
| Requirements Traceability Matrix (RTM) | Maps every requirement to a unique ID; establishes forward-trace baseline through design, implementation, and test |
| UX/UI Interactive Prototypes | End-to-end user flow representations engineered as testable requirements |
| Design Handoff Artifacts | Formalized transition documents: annotations, layout constraints, interactive prototypes, version-controlled design files |

### Key Procedures

**Requirements Specification (IEEE 830):**
- Force detailed, quasi-mathematical analysis of system expectations
- Identify hardware constraints, performance metrics, and interaction protocols with precision
- Every requirement must be: atomic, unambiguous, testable, and immediately mapped to the RTM
- Distinguish functional requirements (what the system does) from non-functional requirements (how well it does it)

**Human-Centered Design (ISO 9241-210):**
- UX/UI design is engineered as fundamental, testable system requirements — not post-hoc aesthetic adjustments
- UX encompasses anticipated perceptions, physical reactions, and emotional responses across three periods: before use, during use, after use
- Differentiate overall user experience from operational usability (effectiveness and efficiency of achieving specified goals)

**Design-to-Engineering Handoff:**
- Establish a single source of truth with version-controlled branching
- Include comprehensive textual and visual annotations, explicit layout constraints, and interactive prototypes
- Engineers must not be tasked with subjectively interpreting design intent

### Gate Criteria (Exit)

- [ ] Every requirement in the SRS is atomic, unambiguous, and testable
- [ ] RTM initialized — every requirement has a unique ID with forward-trace baseline
- [ ] UX/HCD artifacts produced with formal handoff documentation
- [ ] Security requirements identified and documented as first-class requirements
- [ ] Stakeholder sign-off on the SRS (scaled to formality tier)

### Scaling Notes

| Aspect | Lightweight | Standard | Formal |
|--------|------------|----------|--------|
| SRS | Structured requirements document; testable requirements | Full IEEE 830 SRS with stakeholder sign-off | IEEE 830 SRS with legal review and regulatory compliance |
| RTM | Simple table: requirement → test case | RTM with forward/backward trace through design | Full RTM with audit trail and change history |
| UX/HCD | Wireframes or mockups with annotations | Interactive prototypes with user journey maps | Full ISO 9241-210 HCD process with usability testing |
| Handoff | Written notes with visual references | Structured design files with version control | Formal handoff artifacts with acceptance criteria |
