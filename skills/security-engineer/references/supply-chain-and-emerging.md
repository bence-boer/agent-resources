# Supply Chain Security and Emerging Threats

Deep reference for software supply chain resilience, AI-specific security concerns, and forward-looking threat landscape. Load when evaluating dependencies, reviewing CI/CD security, assessing AI system security, or performing forward-looking risk assessment.

## Software Supply Chain Security

Third-party dependencies, open-source libraries, and external CI/CD toolchains expand the attack surface far beyond the proprietary codebase. A vulnerability in an inherited logging library or transitive dependency exposes the entire ecosystem.

### NIST SSDF (SP 800-218)

The Secure Software Development Framework formalizes practices to secure the development environment itself. Three core imperatives:

1. **Protect the Software (PS):** Safeguard all software components from tampering and unauthorized access during the build process. Sign build artifacts. Control access to build infrastructure. Verify integrity of build tools.
2. **Produce Well-Secured Software (PW):** Enforce secure coding standards. Run automated security testing (SAST, DAST, SCA) before release. Review security-relevant code changes.
3. **Respond to Vulnerabilities (RV):** Establish protocols to identify, analyze, and patch vulnerabilities in production. Maintain communication channels for vulnerability disclosure. Track remediation timelines.

### Software Bill of Materials (SBOM)

An SBOM enumerates every component in a software artifact — direct dependencies, transitive dependencies, build tools, and embedded libraries. It is the foundation for supply chain visibility.

**SBOM requirements:**
- Generate SBOM for every release artifact (SPDX or CycloneDX format)
- Include transitive dependencies — not just direct imports
- Continuously monitor SBOM against vulnerability databases (NVD, OSV, GitHub Advisory Database)
- Automate alerting when a known vulnerability affects any component in the SBOM
- Maintain SBOM provenance — record when it was generated, from what source, by what tool

### Provenance and Attestation

Provenance answers: where did this artifact come from, who built it, and was it tampered with?

**SLSA framework levels** (Supply-chain Levels for Software Artifacts):
- Level 1: Documentation of the build process
- Level 2: Tamper resistance of the build service (hosted build, generated provenance)
- Level 3: Hardened builds with non-falsifiable provenance (isolated, ephemeral build environments)

**Practical controls:**
1. Sign all build artifacts with verifiable keys
2. Use reproducible builds where feasible — same source should produce bit-identical output
3. Verify signatures and provenance of all consumed dependencies
4. Pin dependency versions to exact hashes, not version ranges
5. Run dependency updates through automated security scanning before merging

### Supply Chain Attack Vectors

| Attack Vector | Mechanism | Defense |
| --- | --- | --- |
| **Dependency confusion** | Attacker publishes a malicious package with the same name as an internal package to a public registry. Build system resolves from public instead of private. | Configure package managers to use private registries for internal packages. Scope internal packages with org prefixes. Pin exact versions. |
| **Typosquatting** | Malicious packages with names similar to popular packages (`lodassh` instead of `lodash`). | Use lockfiles with integrity hashes. Review new dependency additions. Use automated tools to flag suspicious package names. |
| **Compromised maintainer** | Legitimate maintainer account is compromised, and malicious code is injected into an update. | Pin to specific versions. Review changelogs for unexpected changes. Monitor for maintainer account changes on critical dependencies. |
| **Build pipeline compromise** | Attacker gains access to CI/CD infrastructure and injects malicious steps into the build process. | Restrict CI/CD credential scope. Use ephemeral build environments. Require approval for pipeline definition changes. Audit build logs. |
| **Malicious pull request** | Attacker submits a PR with subtle malicious code disguised as a legitimate contribution. | Require code review from trusted maintainers. Run automated security analysis on PRs. Be especially vigilant with large or obfuscated changes. |

### Dependency Management Rules

1. Audit every new dependency before adoption — check maintenance status, known vulnerabilities, license, and download trends
2. Minimize dependency count — every dependency is attack surface
3. Use lockfiles with integrity hashes for reproducible, verifiable builds
4. Run automated SCA (Software Composition Analysis) in CI/CD
5. Set up automated alerts for new CVEs affecting your dependency tree
6. Have a process to rapidly patch or replace compromised dependencies
7. Evaluate whether the dependency is worth the risk — can the functionality be implemented in-house with reasonable effort?

## The AI Threat Landscape

AI introduces both new attack surfaces and new adversarial capabilities.

### Agentic AI Threats

Agentic AI — autonomous AI entities capable of executing full multi-stage attack chains — represents a structural shift in adversarial capability. Current threat intelligence indicates:

- Autonomous reconnaissance, vulnerability scanning, exploitation, lateral movement, and data exfiltration without human intervention
- Exponentially reduced time-to-exploit — machine-speed attack execution across the full kill chain
- Adaptive attack strategies that modify tactics based on defensive responses
- Scale multiplication — a single adversary can deploy many simultaneous autonomous attack agents

**Defensive implications:**
1. Assume machine-speed attacks — controls that depend on human detection and response speed are insufficient
2. Deploy AI-driven continuous threat exposure management with deep behavioral baselines
3. Automate anomaly detection across network telemetry at machine speed
4. Design security controls that remain effective against automated, adaptive adversaries

### Shadow AI Risks

Shadow AI — unauthorized, unmonitored use of generative models by employees — creates internal exposure:

- Employees pasting proprietary code, customer data, or internal documents into public AI services
- AI-generated code introduced without security review, potentially containing vulnerabilities or insecure patterns
- No audit trail for AI-assisted decisions or code generation
- Model outputs treated as trusted input without validation

**Controls:**
1. Establish an AI usage policy with clear boundaries for what data can be shared with external AI services
2. Provide sanctioned AI tools with data loss prevention controls
3. Treat all AI-generated code as untrusted — require the same review and testing as human-written code
4. Monitor for unauthorized AI service usage through network traffic analysis and endpoint controls

### AI Application Security

Organizations deploying internal AI applications face unique architectural security challenges:

| Threat | Mechanism | Defense |
| --- | --- | --- |
| **Prompt injection** | Attacker crafts input that causes the AI to execute unintended instructions, bypass safety controls, or exfiltrate data | Input sanitization for AI-processed content. Separate system instructions from user input. Implement output filtering. |
| **Data poisoning** | Training data or fine-tuning data is manipulated to introduce backdoors or biases | Validate training data provenance. Monitor model behavior for drift. Use adversarial testing. |
| **Model exfiltration** | Proprietary model weights or training data extracted through API queries or side channels | Rate limit API access. Monitor for systematic probing patterns. Apply differential privacy to training. |
| **Excessive agency** | AI agent granted permissions beyond what its task requires, enabling unintended actions | Apply least privilege to AI agents. Implement approval workflows for high-impact actions. Maintain human-in-the-loop for irreversible operations. |

## Emerging Considerations

### Post-Quantum Cryptography (Q-Day)

Quantum computing threatens current asymmetric cryptographic algorithms. Prepare for transition:

1. **Inventory cryptographic usage** — catalog all algorithms, key sizes, and protocols in use
2. **Implement cryptographic agility** — design systems so algorithms can be rotated without architectural changes
3. **Monitor NIST PQC standardization** — ML-KEM (Kyber), ML-DSA (Dilithium), SLH-DSA (SPHINCS+) are the leading candidates
4. **Start hybrid deployments** — use classical + post-quantum algorithms in parallel during transition
5. **Assess harvest-now-decrypt-later risk** — data encrypted today may be decrypted by future quantum computers. If data has long-term sensitivity (>10 years), evaluate PQC adoption urgency.

### Hardware-Level Trust Boundaries

Software-centric security analysis should acknowledge hardware trust assumptions:

- **Trusted Execution Environments (TEEs)** — Intel SGX, ARM TrustZone provide hardware-isolated enclaves for sensitive computation
- **Secure hardware enclaves** — protect cryptographic keys and operations from software-level compromise
- **Cryptographic co-processors** — hardware-accelerated crypto with tamper-resistant key storage

IF processing highly classified, sovereign, or proprietary data: evaluate hardware-backed security in addition to software controls.

### Machine Identity Lifecycle Automation

The 82:1 machine-to-human identity ratio demands full automation:

1. Eliminate manual credential rotation — automate with SPIFFE/SPIRE or cloud-native identity services
2. Use short-lived credentials — certificates valid for hours, not years
3. Implement automatic certificate renewal before expiration
4. Maintain a complete machine identity inventory with ownership and rotation metadata
5. Test rapid revocation procedures regularly — a compromised machine identity must be revocable in minutes, not days
