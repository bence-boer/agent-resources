# Verification & Delivery: QA, Review, and Release Management

Phases 5–7 of the software development lifecycle. These phases ascend the right side of the V-Model — proving correctness, obtaining governance sign-off, and transitioning to production.

## Phase 5: Quality Assurance and Test-Driven Validation

### Purpose

Prove that integrated components function as a cohesive system and satisfy the constraints defined in the original requirements specification. Governed by IEEE 829, this phase requires an exhaustive Test Plan prior to testing. Testing ascends through layers of complexity: integration, system verification, and system validation.

### Responsible Roles

| Role | Responsibilities |
|------|-----------------|
| QA Engineer | Develops and executes test cases; maintains test documentation |
| Test Manager | Owns the IEEE 829 Test Plan; coordinates testing strategy and resources |
| Security Tester | Executes DAST vulnerability scans; validates security controls |
| End-User Representatives | Participate in User Acceptance Testing (UAT) |

### Formal Inputs

- Compiled/built artifacts (from Phase 4)
- IEEE 830 SRS (from Phase 2)
- IEEE 1016 SDD (from Phase 3)
- IEEE 829 Test Plan (produced at the start of this phase)
- Requirements Traceability Matrix (from Phase 2, updated through Phases 3–4)

### Formal Outputs

| Artifact | Description |
|----------|-------------|
| Completed Test Reports | Results for integration, system, and acceptance testing |
| Updated RTM | Every test case mapped to its originating requirement; full forward/backward trace |
| UAT Sign-off Documents | Formal end-user confirmation that the system meets operational needs |
| Defect Tracking Logs | All identified defects logged, categorized, and dispositioned |
| Verified Release Candidate | Build that has passed all testing tiers |

### Key Procedures

**IEEE 829 Test Plan:**
- Identifies items to be tested, approach, environmental needs, features excluded, and absolute pass/fail criteria
- Specifies execution conditions and predicted results — no subjective interpretation of outcomes
- Must be produced before testing begins

**Testing Tiers (ascending complexity):**

1. **Integration Testing:** Validates that unit-tested modules communicate correctly across interfaces and shared data structures. Exposes interface discrepancies and architectural friction.

2. **System Verification:** Evaluates the complete, integrated system against technical specifications from the SDD and SRS. Answers: *"Are you building it right?"* Includes functional testing, load testing, and Dynamic Application Security Testing (DAST) to probe for runtime vulnerabilities.

3. **System Validation (UAT):** Evaluates performance against real-world end-user needs in a production-simulating environment. Answers: *"Are you building the right thing?"* Assesses whether specified UX workflows translate to practical operational efficiency and user satisfaction.

**Traceability Maintenance:**
- RTM continuously updated throughout testing — every successful test case mapped back to an original requirement
- A test failure mandates a logged defect, routing the component back for rework (closed-loop V-Model verification)
- Plan-Do-Check-Act (PDCA/Deming) cycle ensures continuous quality evaluation

### Gate Criteria (Exit)

- [ ] IEEE 829 Test Plan executed — all planned tests run
- [ ] Integration testing: all module interfaces verified
- [ ] System verification: functional, load, and DAST testing complete
- [ ] System validation (UAT): end-user sign-off obtained
- [ ] RTM shows full forward/backward traceability — every requirement has a linked test result
- [ ] All critical and high-severity defects resolved; remaining defects dispositioned

### Scaling Notes

| Aspect | Lightweight | Standard | Formal |
|--------|------------|----------|--------|
| Test Plan | Documented plan: what is tested, what is excluded, pass/fail criteria | IEEE 829 Test Plan with detailed test cases | Full IEEE 829 with independent verification team |
| Integration Testing | Interface tests for critical module boundaries | Integration test suite covering all internal APIs | Comprehensive integration with automated regression |
| DAST | Automated scan on external-facing surfaces | DAST on all network-accessible interfaces | DAST + manual runtime vulnerability assessment |
| UAT | Informal stakeholder walkthrough | Structured UAT with acceptance criteria and sign-off | Formal UAT with independent user panel and documented results |

---

## Phase 6: Formal Review and Verification Gates

### Purpose

Guarantee that the system was built according to all organizational, legal, and compliance standards, and that all project management objectives from Phase 1 have been satisfied. Governed by IEEE 1028, this phase provides the governance firewall before operational deployment.

### Responsible Roles

| Role | Responsibilities |
|------|-----------------|
| Decision Maker | Has authority to approve or reject the review outcome; signs formal disposition |
| Review Leader | Plans and leads the review; ensures all participants are prepared |
| Technical Reviewers | Evaluate conformance to SDD, SRS, and architectural constraints |
| Auditors | Verify process compliance — was the defined lifecycle actually followed? |
| Recorder | Documents all findings, anomalies, and disposition decisions |

### Formal Inputs

- Verified Release Candidate (from Phase 5)
- Test Reports (from Phase 5)
- IEEE 1016 SDD (from Phase 3)
- IEEE 830 SRS (from Phase 2)
- Fagan Inspection Reports (from Phase 4)
- Risk Management Plans (from Phase 1)

### Formal Outputs

| Artifact | Description |
|----------|-------------|
| Formal Technical Review Report | Documented evidence that the product conforms to specifications and is suitable for intended use |
| Management Review Report | Evaluation of management effectiveness: risk plans, resource allocation, contingency strategies |
| Anomaly Summaries | All identified issues with resolution status and formal disposition |
| Audit Reports | Process compliance verification — was each phase executed per defined procedures? |

### Key Procedures

**Technical Reviews (IEEE 1028):**
- Evaluate the system against SDD and SRS constraints
- Verify that changes during defect resolution affected only identified areas without architectural degradation
- Confirm no undocumented features were introduced
- Provide management with documented evidence of product suitability

**Management Reviews (IEEE 1028):**
- Evaluate effectiveness of management approaches used during the lifecycle
- Verify status of risk management plans, resource allocations, contingency strategies
- Confirm alignment with business objectives from the SPMP
- Assess fitness for purpose

**Exit Criteria:**
- Process is complete only when all identified issues are addressed, all anomalies resolved, and formal Review Reports generated and signed by the Decision Maker
- This step is an absolute firewall — no system with unresolved process deviations, undocumented logic, or unresolved security vulnerabilities may proceed to deployment

### Gate Criteria (Exit)

- [ ] Technical review completed — product conforms to SDD and SRS
- [ ] Management review completed — project objectives satisfied
- [ ] All anomalies resolved with documented disposition
- [ ] Formal Review Reports signed by Decision Maker
- [ ] No unresolved security vulnerabilities or process deviations

### Scaling Notes

| Aspect | Lightweight | Standard | Formal |
|--------|------------|----------|--------|
| Technical Review | Peer review confirming requirements met; documented findings | Technical review with designated roles and structured evaluation | IEEE 1028 formal review with independent reviewers and auditors |
| Management Review | Brief project health check against original objectives | Structured management review with risk and resource assessment | Full management review with audit trail and formal sign-off |
| Audit | Self-attestation of process adherence | Process spot-check by independent team member | Formal audit verifying every phase was executed per defined procedures |

---

## Phase 7: Release Management and Service Transition

### Purpose

Transition the finalized product from the development domain into the live operational environment. Governed by ITIL and ISO/IEC 20000, the objective is systematic deployment ensuring maximum stability while delivering value without unforeseen service interruptions.

### Responsible Roles

| Role | Responsibilities |
|------|-----------------|
| Release Manager | Orchestrates the transition; coordinates all release activities |
| Change Manager | Manages the CAB process; evaluates change impact and risk |
| Deployment Manager | Executes the release using planned distribution strategies |
| Change Advisory Board (CAB) | Cross-functional body evaluating business risk, technical readiness, and operational impact |

### Formal Inputs

- Approved Release Candidate (from Phase 6)
- IEEE 1028 Review Reports (from Phase 6)
- Deployment Readiness Test Results
- Rollback Plan

### Formal Outputs

| Artifact | Description |
|----------|-------------|
| Live Production System | Successfully deployed and validated system |
| Updated CMDB | Configuration Management Database reflecting the new production state |
| Post-Implementation Review | Documented assessment of the release process and outcomes |
| Transition Documentation | Handover to operational support and maintenance teams |

### Key Procedures

**Change Advisory Board (CAB):**
- Cross-functional governance body evaluating business risk, technical readiness, and operational impact
- Reviews all accumulated lifecycle artifacts: review reports, security clearance, UAT sign-offs
- Provides explicit authorization for deployment
- In the strict linear lifecycle, the CAB functions as a formal governance gate (not merely advisory)

**Service Validation and Testing (SVT):**
- Confirms the release package will not disrupt existing operational services
- Executed after CAB authorization, before production deployment

**Deployment Strategies (selected by risk profile):**
- **Canary release:** Deploy to a small user subset first; monitor for issues before expanding
- **Blue-green deployment:** Maintain two identical environments; switch traffic after validation
- **Phased rollout:** Incremental deployment across user segments or regions

**Rollback Procedures:**
- Explicit definition of how to instantly revert to the previous state
- Must be tested before production deployment, not merely documented
- Mitigates impact of catastrophic deployment failures

**Post-Deployment:**
- CMDB updated to reflect the new production state
- Project formally closed
- System enters operation and maintenance phases (ISO/IEC 12207)
- Post-implementation review documents lessons learned

### Gate Criteria (Exit)

- [ ] CAB authorization obtained (or equivalent governance approval)
- [ ] SVT confirms no disruption to existing services
- [ ] Deployment executed per planned strategy
- [ ] Rollback procedure tested and documented
- [ ] CMDB updated to reflect production state
- [ ] Post-implementation review completed and documented

### Scaling Notes

| Aspect | Lightweight | Standard | Formal |
|--------|------------|----------|--------|
| Governance | Written approval from project lead/stakeholder | CAB-equivalent review with documented risk assessment | Full CAB with cross-functional evaluation and formal authorization |
| SVT | Smoke test in staging environment | SVT validating no service disruption | Comprehensive SVT with independent validation team |
| Deployment | Direct deployment with rollback plan | Deployment strategy selected by risk; staging first | Full deployment orchestration with canary/blue-green/phased rollout |
| Post-Release | Brief retrospective; update tracking system | Post-implementation review; CMDB update | Formal PIR; CMDB audit; lessons learned documented and distributed |
