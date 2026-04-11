# Domain-Specific Anti-Patterns

Layer-specific anti-patterns providing deeper analysis of concerns surfaced in the root anti-pattern watchlist, plus additional domain-specific patterns. Load the relevant section when reviewing code or architecture for a specific domain. Each anti-pattern includes the security implication and the remediation pattern.

## Frontend Architecture

The browser is a hostile environment. The user controls the entire presentation layer. Security controls that exist only in the client are cosmetic.

### Trust in Client-Side Logic
**Implication:** Business logic, validation, authorization, or rate limiting executed only in the browser can be trivially bypassed by intercepting HTTP requests or modifying DOM variables. Client-side checks create a false sense of security.
**Remediation:** Shift all critical validation, authorization, and logic execution to the backend API layer. Treat all incoming frontend data as strictly untrusted and tainted. Client-side validation is for UX responsiveness, not security enforcement.

### Insecure Token Storage in the Browser
**Implication:** JWTs or session tokens in `localStorage` or `sessionStorage` are accessible to any JavaScript on the page. A single XSS vulnerability grants the attacker full session hijacking capability.
**Remediation:** Use the **Backend-for-Frontend (BFF) pattern**. The BFF handles OAuth token negotiation as a confidential client and stores tokens server-side, issuing only `HttpOnly`, `Secure`, `SameSite=Strict` cookies to the frontend. Tokens never touch browser-accessible JavaScript storage.

### Distributed Components Without True Decoupling
**Implication:** Micro-frontends deployed without well-defined domain boundaries result in entangled application states and shared domain knowledge. A vulnerability in one component compromises the broader container application. Shared state pollution defeats isolation.
**Remediation:** Enforce strict context boundaries for micro-frontends. Each team operates independently with strict data isolation. Communication between micro-frontends goes through well-defined event contracts, not shared global state.

### CORS Misconfiguration
**Implication:** Wildcard `Access-Control-Allow-Origin: *` with credentials, overly permissive origin allowlists, or reflecting the `Origin` header without validation enables cross-origin data theft.
**Remediation:** Allowlist specific trusted origins. Never reflect arbitrary origins. Never combine wildcard origin with `Access-Control-Allow-Credentials: true`. Validate the `Origin` header against an explicit allowlist on every CORS-preflight and actual request.

## Backend and API Architecture

The backend is the primary enforcement point for business logic, data validation, and authorization.

### Mass Assignment (API6:2019)
**Implication:** Frameworks that bind client JSON payloads directly to internal models allow attackers to inject unexpected parameters — `{"username": "user", "isAdmin": true}` — achieving privilege escalation or arbitrary data modification.
**Remediation:** Implement strict Data Transfer Objects (DTOs) with explicit allow-listing for incoming fields. Never bind raw input directly to internal database entities. Define separate input models for each endpoint that accept only the fields the endpoint should receive.

### Broken Function Level Authorization
**Implication:** Complex endpoint hierarchies without explicit per-request authorization checks enable horizontal and vertical privilege escalation. Attackers manipulate URIs, swap resource IDs, or access admin endpoints through predictable URL patterns.
**Remediation:** Enforce centralized, policy-based authorization middleware that intercepts all API requests and verifies contextual permissions before invoking business logic. Authorization checks must reference the specific resource ID being accessed, not just the endpoint pattern.

### API Sprawl and Shadow APIs
**Implication:** Uncontrolled microservice deployment without documentation (OpenAPI specs), monitoring, or lifecycle management leaves deprecated, unauthenticated endpoints exposed. Shadow APIs bypass enterprise WAFs and Zero Trust gateways entirely.
**Remediation:** Implement centralized API gateways with mandatory service registration. Maintain living OpenAPI specifications for every endpoint. Deploy automated API discovery protocols. Continuously audit and aggressively decommission unused endpoints. Version all APIs and enforce deprecation timelines.

### Missing Rate Limiting and Abuse Controls
**Implication:** Business logic endpoints without rate limits, transaction caps, or behavioral analysis enable automated abuse — credential stuffing, scraping, resource exhaustion, and business logic exploitation at scale.
**Remediation:** Apply rate limiting at both the infrastructure level (API gateway) and the application level (per-user, per-resource). Implement behavioral abuse detection for business-critical workflows. Set transaction limits that reflect legitimate usage patterns.

## Database Architecture

The persistence layer contains the most critical assets. Vulnerabilities here result in catastrophic data breaches.

### Excessive Connectivity and Flat Networks
**Implication:** Databases on flat internal networks or accepting direct TCP connections from thick clients are exposed to rapid lateral movement after any adjacent workstation compromise.
**Remediation:** Isolate databases in restricted network segments. Disable public IP routing. Require access via local socket files or strict host-based firewall rules allowing only backend application server IPs. Use network policies in container orchestration to limit pod-to-database connectivity.

### Administrative Over-Privilege and Shared Accounts
**Implication:** Using shared service accounts (`root`, `sa`, `SYS`) for application database access violates least privilege. An SQL injection vulnerability through an over-privileged account grants the attacker total DBMS control, including OS-level command execution via `xp_cmdshell`, `COPY PROGRAM`, or UDF creation.
**Remediation:** Provision unique accounts per application with strict per-table `SELECT`, `INSERT`, `UPDATE`, `DELETE` rights. Use SQL views to abstract underlying schema. Separate read and write accounts. Never grant DDL or admin privileges to application service accounts.

### Cleartext Traffic and Unencrypted Storage
**Implication:** Queries and results over unencrypted connections are visible to network sniffers. Sensitive data stored without encryption is exposed by physical theft, backup compromise, or unauthorized filesystem access.
**Remediation:** Mandate TLS 1.2+ with modern ciphers (AES-GCM) for all database connections, including internal ones. Implement encryption at rest using native DBMS features or volume-level encryption. For highly sensitive data, use **data tokenization** — replace sensitive values with non-exploitable surrogate tokens to eliminate exploitable value even on full breach.

### Missing Row-Level Security
**Implication:** Multi-tenant databases without row-level isolation allow any application-layer authorization bypass to access data belonging to other tenants. A single broken access control vulnerability becomes a full cross-tenant data breach.
**Remediation:** Implement row-level security (RLS) policies at the database layer as a defense-in-depth control. RLS enforces tenant isolation even when application-layer authorization fails. Use the database session context to carry tenant identity and filter all queries automatically.

## Platform, Container Orchestration, and Infrastructure

The infrastructure plane relies on automation, introducing systemic risks at scale.

### Checked-In Secrets and Hardcoded Credentials
**Implication:** API keys, database passwords, or certificates in source code, IaC templates, or CI/CD scripts are exposed to anyone with repository access and enable supply chain attacks. Secrets in Docker layers persist even when "removed" in later layers.
**Remediation:** Use centralized secrets management vaults (HashiCorp Vault, AWS Secrets Manager, etc.). Inject secrets dynamically at runtime into ephemeral memory spaces. Never commit secrets. Use multi-stage Docker builds and verify no secrets leak into final images. Scan repositories with automated secret detection tools.

### Insecure Container Orchestration
**Implication:** Orchestration platforms (Kubernetes, Nomad) without network micro-segmentation or RBAC allow compromised pods to deploy rogue workloads, access the control plane API, or escalate to host-node privileges.
**Remediation:** Implement network policies to isolate pod-to-pod communication. Secure the orchestrator control plane API behind strong authentication and private networking. Run containers as non-root with read-only filesystems. Drop all unnecessary Linux capabilities. Use Pod Security Standards (restricted profile) or equivalent.

### Bypassing IaC Security Linters
**Implication:** Infrastructure as Code changes pushed without automated security review allow insecure configurations — open S3 buckets, permissive security groups, unencrypted volumes — to reach production.
**Remediation:** Integrate IaC linters (tfsec, checkov, cfn-lint) into CI/CD pipelines as mandatory gates. Block merges that violate security policies. Treat IaC security violations with the same severity as failing tests.

### Volatile Container Tags
**Implication:** Using mutable tags like `latest` in container deployments destroys operational traceability. The same tag can resolve to different images over time, breaking reproducibility and making security audits impossible. An attacker who compromises the registry can replace the image behind a volatile tag.
**Remediation:** Pin container images to immutable digests (`sha256:...`) or immutable version tags. Record the exact digest deployed in every environment. Enforce digest-based deployment policies in the orchestrator.
