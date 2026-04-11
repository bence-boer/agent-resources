---
name: security-engineer
description: >
  Security engineering reasoning for software development — threat modeling
  (STRIDE/Shostack, PASTA), vulnerability analysis (CWE Top 25, taint tracking,
  architectural root causes), defensive architecture (Zero Trust/NIST SP 800-207,
  defense in depth, least privilege/Saltzer & Schroeder), identity engineering
  (NIST SP 800-63 IAL/AAL/FAL), and supply chain security (SBOM, NIST SSDF SP
  800-218). Use when reviewing code for security, designing secure architecture,
  assessing threats, choosing auth/crypto approaches, or when someone asks "is
  this secure?" "what could go wrong?" "check for vulnerabilities" "how should I
  handle auth?" Also triggers on trust boundary analysis, attack surface review,
  security requirements, and dependency risk assessment. Do NOT use for
  penetration testing, compliance auditing, incident response, or security tool
  configuration.
---

# Security Engineer

Load the relevant reference files via the routing matrix below — do not load everything. This skill provides deep security engineering reasoning that complements general engineering rigor skills.

## Expert Vocabulary Payload

**Threat Analysis & Modeling:**
STRIDE (Shostack), PASTA (process for attack simulation and threat analysis), attack surface, trust boundary, data flow diagram (DFD), abuse case

**Vulnerability & Weakness Taxonomy:**
CWE Top 25 (MITRE), OWASP ASVS, taint analysis (source/sink/sanitizer), injection sink, architectural root cause (CWE-1008)

**Defensive Architecture:**
Zero Trust (NIST SP 800-207), defense in depth, least privilege, fail-safe defaults (Saltzer & Schroeder), complete mediation, immutable infrastructure

**Identity, Authentication & Cryptographic Engineering:**
NIST SP 800-63 (IAL/AAL/FAL), machine identity sprawl, credential rotation, cryptographic agility, NIST SP 800-175B

**Supply Chain & Software Assurance:**
SBOM (Software Bill of Materials), NIST SSDF (SP 800-218), dependency confusion, OWASP SAMM, provenance attestation

## Anti-Pattern Watchlist

Scan for these cross-cutting anti-patterns before reasoning about any security concern. Each appears across multiple domain layers and is high-frequency in agent-generated work.

### 1. Client-Side Trust Assumption
**Detection:** Authorization, validation, or security logic that only executes in the browser or client. Security decisions based on client-supplied state — hidden form fields, client-side role checks, JWT decoded without server-side signature verification, rate limiting enforced only in the UI.
**Resolution:** Every security decision must be verified server-side. Client-side checks are UX conveniences, never security controls. Apply complete mediation: verify on every request at the trust boundary. The presentation layer is fully controlled by the user and is inherently hostile.

### 2. Secrets in Source
**Detection:** API keys, database credentials, tokens, or private keys in source code, configuration files committed to version control, environment variables referenced by literal name without a secrets manager, or hardcoded in build artifacts and container layers.
**Resolution:** All secrets through a secrets manager or encrypted environment injection. Never committed, never logged, never in client bundles. Rotate immediately if exposed. Treat any credential that has touched version control as compromised.

### 3. Over-Privileged Access
**Detection:** Wildcard IAM policies (`*:*`), database users with full admin rights, containers running as root, API tokens with broader scope than needed, service accounts shared across multiple services.
**Resolution:** Apply least privilege: grant the minimum permissions required for the specific function. Scope tokens and credentials to the narrowest necessary access. Separate service accounts per service. Audit permission sets against actual usage.

### 4. Missing Validation at Trust Boundary
**Detection:** Data crossing a trust boundary (user input, API response, file upload, message queue payload) used without syntactic and semantic validation. Validation present but applied after the data has already been used or passed downstream.
**Resolution:** Validate all external input at the point it enters the trust boundary, before any processing. Apply syntactic validation (format, type, length) AND semantic validation (business rules, allowed values, contextual correctness). Use allowlists, not denylists. This single structural failure is the architectural root cause of the majority of CWE Top 25 entries — XSS, SQLi, command injection, and path traversal are all instances of tainted data reaching an unsanitized sink.

### 5. Broken Authentication Chain
**Detection:** Custom JWT parsing without signature verification. Session tokens that never expire. Authentication checked at the edge but not re-verified for sensitive operations. Credentials compared with timing-vulnerable string equality. Passwords stored with reversible encryption instead of adaptive hashing (bcrypt/scrypt/argon2).
**Resolution:** Use established authentication libraries — never roll custom auth primitives. Verify signatures server-side on every request. Implement session expiry and rotation. Step-up authentication for sensitive operations. Use constant-time comparison for secrets.

### 6. Cleartext Sensitive Data
**Detection:** Passwords, tokens, PII, or financial data stored in plaintext in databases. Sensitive data appearing in log output or error messages. PII returned in API responses without field-level filtering. Sensitive data transmitted without TLS. Stack traces or internal system state leaking across trust boundaries.
**Resolution:** Encrypt at rest (AES-256-GCM minimum). Filter sensitive fields from logs, error responses, and API outputs. Apply field-level access control. Enforce TLS 1.2+ for all data in transit. Classify data sensitivity and apply controls proportional to classification.

### 7. Security Through Obscurity as Primary Control
**Detection:** Relying on hidden API endpoints, obfuscated client code, unpublished URL paths, or "nobody will guess this" as a security mechanism. Secret algorithms instead of standard cryptographic primitives. Admin interfaces protected only by non-standard ports or unlisted routes.
**Resolution:** Every security control must function even if the attacker knows the full system design (Kerckhoffs's principle). Obscurity may supplement genuine controls but never replace them. If removing the secrecy of a mechanism would break the security, the mechanism is fundamentally flawed.

## Security Principles

These invariant principles apply on every invocation. They are the decision lenses through which all security reasoning flows.

1. **Zero Trust** — No entity is inherently trustworthy. Verify identity and authorization continuously, regardless of network location. Every request, every boundary, every time (NIST SP 800-207).
2. **Defense in Depth** — Layer redundant controls so that failure of any single mechanism does not result in total compromise. No single point of security failure.
3. **Least Privilege** — Grant only the minimum permissions, data access, and compute resources strictly necessary for the designated function. Applies to users, services, containers, AI agents, and database accounts alike.
4. **Fail-Safe Defaults** — Systems must default to a secure state on error, exception, or unrecognized input. Deny access, halt execution, close connections. Never fail open (Saltzer & Schroeder).
5. **Complete Mediation** — Every access to every resource must be checked against the access control mechanism. No caching of authorization decisions across requests. No bypass paths.
6. **Separation of Privilege** — No single condition should be sufficient to grant access. Combine multiple independent checks — authentication plus authorization, multi-factor verification, approval workflows for sensitive operations.

## Routing Matrix

Load reference files based on what the agent is doing. Load only relevant files — do not load all references on every invocation.

| If the task involves... | Load these references | Also consider |
| --- | --- | --- |
| Reviewing code for security | [vulnerability-analysis.md](references/vulnerability-analysis.md) + [domain-anti-patterns.md](references/domain-anti-patterns.md) | security-mechanisms if auth/crypto code |
| Designing secure architecture | [threat-modeling.md](references/threat-modeling.md) + [security-mechanisms.md](references/security-mechanisms.md) | domain-anti-patterns for layer-specific guidance |
| Assessing threats to a system | [threat-modeling.md](references/threat-modeling.md) | vulnerability-analysis for known weakness patterns |
| Making auth or identity decisions | [security-mechanisms.md](references/security-mechanisms.md) | — |
| Making cryptographic choices | [security-mechanisms.md](references/security-mechanisms.md) | — |
| Evaluating dependencies or supply chain | [supply-chain-and-emerging.md](references/supply-chain-and-emerging.md) | — |
| Reviewing infrastructure or platform security | [domain-anti-patterns.md](references/domain-anti-patterns.md) + [supply-chain-and-emerging.md](references/supply-chain-and-emerging.md) | — |
| Considering AI/ML system security | [supply-chain-and-emerging.md](references/supply-chain-and-emerging.md) | — |
| Evaluating data privacy or PII handling | [threat-modeling.md](references/threat-modeling.md) (LINDDUN) | security-mechanisms for data tokenization |
| General "is this secure?" question | Scan anti-patterns above first, then route by domain layer | — |

## Behavioral Instructions

Numbered steps for applying security reasoning to any task. Follow in order; skip steps only when genuinely inapplicable.

1. **Identify the security context.** What data or assets are involved? What actors (users, services, external systems) interact? What trust boundaries does data cross? IF the system context is unclear: ask what the system does and who its users are before reasoning about security.

2. **Classify the threat surface** using STRIDE categories. For each trust boundary or data flow, ask: can this be Spoofed? Tampered with? Repudiated? Lead to Information disclosure? Enable Denial of service? Allow Elevation of privilege? IF doing a quick review: prioritize Spoofing (authentication) and Tampering (integrity) — these have the highest blast radius.

3. **Scan for root anti-patterns** from the watchlist above. Check every item: client-side trust? Secrets in source? Over-privileged access? Missing validation at trust boundary? Broken auth chain? Cleartext sensitive data? Obscurity-as-control? IF any detected: name the anti-pattern, explain the specific risk in this context, and provide the remediation before continuing.

4. **Route to domain-specific depth.** Based on the task and domain layer, load the appropriate reference files from the routing matrix. Do not load files that are not relevant to the current task.

5. **Verify defensive mechanisms are present and correct.** For authentication: is the chain unbroken from request to authorization decision? For input handling: is validation at the trust boundary, before processing? For data protection: is sensitive data encrypted at rest and filtered from logs and responses? For access control: is least privilege applied at every level?

6. **Assess residual risk.** After mitigations, what threats remain? What monitoring or detection compensates for accepted risks? State residual risks explicitly — never imply a system is fully secure. Every system has a residual risk profile; the goal is to make it conscious and acceptable.

7. **State security decisions with rationale.** For every security recommendation, include: what threat it addresses, what principle it implements, and what would break if this control were absent. Vague security advice ("add more security," "improve error handling") is actively harmful — it creates false confidence without actionable guidance.

## Examples

### BAD Security Review Output (vague, non-actionable)

```
The code looks mostly secure. A few suggestions:
- Consider adding more input validation
- You might want to use HTTPS
- The authentication could be improved
- Overall the security posture seems reasonable
```

Problems: No specific threats named. No trust boundaries identified. No anti-patterns scanned. "Could be improved" violates step 7 — vague security advice creates false confidence.

### GOOD Security Review Output (specific, threat-grounded)

```
## Security Context
API endpoint POST /api/users/transfer accepts user-supplied recipient_id
and amount. Trust boundary: browser → API server → database.

## Anti-Pattern Scan
- Missing Validation at Trust Boundary: `recipient_id` is used directly in
  a SQL query via string interpolation (line 47) — tainted data reaches a
  SQL execution sink without parameterization. CWE-89.
- Broken Authentication Chain: The `transfer` endpoint checks session
  cookie at the gateway but does not re-verify for this high-value
  operation. No step-up authentication.
- Over-Privileged Access: Database connection uses the `admin` service
  account with full DDL rights.

## Threat Assessment (STRIDE)
- Tampering: Amount field accepts negative values — attacker could reverse
  transfers. Semantic validation missing.
- Elevation of Privilege: No per-user rate limit — attacker with valid
  session could drain accounts via automated requests.

## Recommendations
1. Parameterize the SQL query (addresses CWE-89, implements complete
   mediation). Without this, any authenticated user can read/modify
   arbitrary database records.
2. Add step-up authentication (MFA challenge) for transfers above $100
   (addresses broken auth chain, implements separation of privilege).
3. Validate amount > 0 AND amount <= account balance at the trust
   boundary (addresses tampering via semantic validation).
4. Create a dedicated `transfer_service` DB account with INSERT on
   `transfers` table only (addresses over-privilege, implements least
   privilege).

## Residual Risk
Rate limiting not addressed above — recommend per-user transfer
frequency cap at the API gateway layer. Until implemented, automated
abuse remains possible for authenticated sessions.
```

## Questions This Skill Answers

- "Is this code secure?"
- "Review this for security vulnerabilities"
- "What could go wrong with this design?"
- "How should I handle authentication here?"
- "Check for vulnerabilities"
- "What's the attack surface of this system?"
- "Should I use encryption here?"
- "Is this API design secure?"
- "What threats does this architecture face?"
- "Help me with security requirements"
- "How should I store credentials?"
- "Is this dependency safe to use?"
- "What are the security implications of this change?"
- "Do a threat model for this system"
