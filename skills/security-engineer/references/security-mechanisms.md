# Security Mechanisms

Deep reference for identity engineering, authentication, authorization, cryptographic engineering, input validation, and output encoding. Load when making auth/identity decisions, choosing cryptographic approaches, or designing validation layers.

### OWASP ASVS (Application Security Verification Standard)

ASVS provides a repeatable baseline for benchmarking web and API application security across three levels:

| Level | Assurance | Use When |
| --- | --- | --- |
| **Level 1** | Opportunistic — automated verification | All applications as minimum baseline |
| **Level 2** | Standard — covers most applications | Applications handling sensitive data, business-critical functions |
| **Level 3** | Advanced — full verification | High-value targets: financial, medical, critical infrastructure |

ASVS categories map to architectural concerns: authentication, session management, access control, validation, cryptography, error handling, data protection, communications, and configuration. Use ASVS as a verification checklist when reviewing an application's security posture against a defined assurance target.

## Identity-First Security

In boundaryless networks, identity is the security perimeter. IAM is the foundation, not a supporting control.

### NIST SP 800-63 Digital Identity Guidelines

Three assurance dimensions govern digital trust. Select the level appropriate to the risk of the transaction.

| Dimension | Level 1 | Level 2 | Level 3 |
| --- | --- | --- | --- |
| **Identity Assurance (IAL)** | No requirement to link to real-life identity | Remote or in-person proofing with evidence verification | In-person or supervised remote proofing with strong evidence |
| **Authenticator Assurance (AAL)** | Single-factor authentication | Two-factor authentication (something you know + have/are) | Hardware-based cryptographic authenticator with verifier impersonation resistance |
| **Federation Assurance (FAL)** | Bearer assertions allowed | Signed assertions with audience restriction | Holder-of-key assertions with cryptographic proof of possession |

**Selection guidance:**
- AAL1 for low-risk read-only operations
- AAL2 minimum for any state-changing operation or access to PII
- AAL3 for financial transactions, privileged administrative access, or operations with high blast radius
- IF unsure: default to AAL2 — the cost of over-protecting is far lower than the cost of under-protecting

### Machine Identity Sprawl

Machine identities — TLS certificates, SSH keys, code signing certificates, API secrets — outnumber human identities at a ratio of approximately 82:1 in modern cloud environments. When these identities are mismanaged, hardcoded, or left unrotated after expiration, attackers exploit them for invisible, machine-speed data exfiltration.

**Controls for machine identity:**
1. Automate credential lifecycle — eliminate manual rotation entirely
2. Use short-lived credentials (hours, not months). SPIFFE/SPIRE provides universal short-lived identity for distributed microservices
3. Monitor certificate expiration with automated alerting and pre-emptive renewal
4. Audit machine identity inventory continuously — every credential must have an owner, a rotation policy, and an expiration
5. Revoke immediately on compromise — have a tested rapid-revocation process

### Authentication Architecture Patterns

| Pattern | Use When | Security Properties |
| --- | --- | --- |
| **Session-based (server-side)** | Traditional web apps, server-rendered pages | Server controls session lifetime; revocation is immediate; no client-side token exposure |
| **JWT (stateless)** | API-to-API, microservice auth, mobile clients | No server-side state needed; but revocation is difficult until expiry. Always verify signature server-side. |
| **BFF + HttpOnly cookies** | SPAs needing OAuth | Tokens never reach browser JavaScript; confidential client handles token negotiation |
| **Mutual TLS (mTLS)** | Service-to-service in zero trust | Both parties authenticate; strongest for internal service mesh |
| **API keys** | Third-party integrations, limited scope | Weakest — no identity context, no expiry by default. Scope narrowly, rotate frequently, monitor for abuse. |

IF choosing between JWT and session-based: prefer session-based when the server can maintain state (immediate revocation, no token leakage). Use JWT only when statelessness is a genuine architectural requirement, and implement short expiry + refresh token rotation.

## Authorization Models

| Model | Strengths | Use When |
| --- | --- | --- |
| **RBAC** (Role-Based Access Control) | Simple, auditable, well-understood | Role boundaries are stable and map cleanly to business functions |
| **ABAC** (Attribute-Based Access Control) | Fine-grained, context-aware, dynamic | Authorization depends on context — time, location, resource properties, relationship |
| **ReBAC** (Relationship-Based Access Control) | Models complex ownership and sharing hierarchies | Social/collaborative apps where access derives from object relationships (Google Zanzibar model) |
| **Policy-as-Code** (OPA/Cedar) | Decoupled from application code, testable, versionable | Policy changes frequently, must be audited independently, or spans multiple services |

**Enforcement rules:**
1. Authorization must be checked on every request at the API/service layer — never cached across requests without explicit invalidation
2. Always check against the specific resource ID being accessed, not just the endpoint pattern
3. Deny by default — if no explicit policy grants access, access is denied
4. Separate authentication (who are you?) from authorization (what can you do?) — they are independent concerns with different failure modes

## Cryptographic Engineering

Guided by NIST SP 800-175B. The goal is correct application of established primitives, not cryptographic innovation.

### Algorithm Selection

| Purpose | Recommended | Avoid |
| --- | --- | --- |
| Symmetric encryption | AES-256-GCM | DES, 3DES, AES-ECB (no integrity), RC4 |
| Asymmetric encryption | RSA-OAEP (≥3072 bit), ECDH (P-256+) | RSA-PKCS1v1.5, RSA <2048 bit |
| Digital signatures | Ed25519, ECDSA (P-256+), RSA-PSS (≥3072 bit) | RSA-PKCS1v1.5 signatures, DSA |
| Hashing | SHA-256, SHA-3, BLAKE3 | MD5, SHA-1 (both broken for collision resistance) |
| Password hashing | Argon2id, bcrypt (cost ≥12), scrypt | SHA-256/512 (not designed for password hashing — too fast), MD5, plaintext |
| Key derivation | HKDF, PBKDF2 (≥310,000 iterations for SHA-256) | Single-pass hashing of passwords |
| TLS | TLS 1.3 (preferred), TLS 1.2 with modern ciphers | TLS 1.0, TLS 1.1, SSL (all deprecated) |

### Cryptographic Principles

1. **Never roll your own crypto.** Use established, audited libraries (libsodium, OpenSSL, BoringSSL, platform-native crypto APIs).
2. **Cryptographic agility:** Design systems so algorithms can be rotated without architectural changes. Store algorithm identifiers with encrypted data. This is essential for post-quantum transition readiness.
3. **Key management:** Generate keys with cryptographic-quality random number generators. Separate key generation, storage, and usage. Use key wrapping for keys-at-rest. Rotate encryption keys on a defined schedule and on suspected compromise.
4. **Unique nonces/IVs:** Never reuse a nonce or IV with the same key. AES-GCM with a repeated nonce is catastrophically broken — it leaks the authentication key.
5. **Encrypt then MAC** (or use AEAD): Always authenticate ciphertext. Unauthenticated encryption (AES-CBC without HMAC) is vulnerable to padding oracle attacks.

## Input Validation

Input validation is the first line of defense against injection attacks. It must be applied at the trust boundary, before any processing.

### Two-Tier Validation

1. **Syntactic validation:** Enforces correct structure. Does this field match the expected format? Regex for patterns (email, phone, date), type checks, length limits, character set restrictions. Applied first.
2. **Semantic validation:** Enforces contextual correctness within business logic. Does the end date follow the start date? Does the transaction amount not exceed the account balance? Is the referenced resource ID one the requesting user has access to? Applied after syntactic validation passes.

### Validation Rules

- Validate at the trust boundary — the point where external data enters the system
- Validate before any processing, storage, or forwarding
- Use allowlists (define what is permitted), not denylists (define what is blocked). Denylists always have gaps.
- Validate both structure and semantics — correct format does not guarantee correct meaning
- Normalize input before validation (Unicode normalization, path canonicalization) to prevent encoding bypass attacks
- Reject invalid input by default — fail closed, not open

## Output Encoding

Output encoding neutralizes data before it is rendered in a browser or passed to a downstream interpreter. It ensures malicious payloads are treated as display text, not executable code.

### Context-Specific Encoding

| Output Context | Encoding Required | Example |
| --- | --- | --- |
| HTML body | HTML entity encoding | `<script>` → `&lt;script&gt;` |
| HTML attribute | HTML attribute encoding + quote wrapping | `" onmouseover="alert(1)` → `&quot; onmouseover=&quot;alert(1)` |
| JavaScript string | JavaScript hex encoding | `'; alert(1);//` → `\x27\x3B\x20alert\x281\x29\x3B\x2F\x2F` |
| CSS value | CSS hex encoding | Prevents expression injection |
| URL parameter | URL/percent encoding | Special characters → `%XX` |

### Encoding Rules

1. Encode output as late as possible — immediately before rendering in the target context
2. Match the encoding to the output context — HTML encoding does not protect against JavaScript injection in a `<script>` block
3. Use established encoding libraries, not manual character replacement
4. Apply encoding even to data that was previously validated — defense in depth against second-order injection

## Data Tokenization

For highly sensitive environments, replace sensitive data with non-exploitable surrogate tokens. Tokenization eliminates the exploitable value of data even on total breach, reduces compliance scope (tokenized data is not PII/PCI-scoped), and minimizes processing overhead for sensitive operations.

IF handling PII, financial data, or health records: evaluate tokenization as a complement to encryption. Tokenization is particularly effective for data that must be referenced across systems but does not need to be readable in every context.
