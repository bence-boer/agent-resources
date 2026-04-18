# Automation Architecture and Test Data Management

> Reference for the QA Engineer skill. Load when the task involves choosing automation patterns, designing framework architecture, or managing test data.

---

## The Page Object Model (POM)

POM encapsulates UI elements and interaction logic into dedicated page classes. When a test requires UI interaction, it calls methods exposed by the page object. This enforces DRY: if a DOM selector changes, update one centralized location.

**Strengths:** Clear structure, single point of maintenance for selectors, industry-standard starting point.

**Limitations at scale:**
- Page objects bloat with repetitive logic as applications grow
- Duplicate code and fragile inheritance trees across related pages
- Tight coupling to physical UI structure — struggles to model cross-page workflows
- Difficult to share interaction logic across disparate application sections

POM remains viable for small-to-medium applications with stable UI structures. For large, component-driven architectures, augment or replace with Flow Model or Screenplay Pattern.

## The Flow Model Pattern

The Flow Model introduces a **workflow abstraction layer** (User Steps / Facades) between test scripts and page objects. This separates the "what" (business goal) from the "how" (technical interaction).

**Architecture:**
```
Test Script → User Step (Facade) → Page Object(s) → Application
```

**Benefits:**
- Page objects remain clean and focused on mapping physical elements
- Business workflows are centralized and reusable
- Test scripts read as business operations, not DOM interactions
- Multiple page objects compose into a single workflow step

**When to adopt:** When page objects start accumulating workflow logic that spans multiple pages. The Flow Model is the natural evolution from POM for most growing applications.

Coupled with the Flow Model is the **API-Based Model** — a distinct architectural pattern where test state setup bypasses the UI entirely, using REST/GraphQL endpoints for data creation. UI interaction is reserved exclusively for verifying frontend rendering and event binding. The API-Based Model and Flow Model complement each other: Flow Model organizes the test structure; API-Based Model accelerates the data layer.

## The Screenplay Pattern

For highly complex systems and large teams, Screenplay shifts from page-centric to **actor-centric** architecture. Tests model user behavior and domain logic rather than physical UI layout.

**Component decomposition:**

| Component | Role |
|---|---|
| **Actor** | Entity interacting with the system (e.g., "Customer," "Admin") |
| **Ability** | Technical interface the actor can use (browser via Playwright, REST API) |
| **Task** | High-level business workflow composed of smaller actions |
| **Interaction** | Low-level interface maneuver (click button, fill field) |
| **Question** | State extraction for validation (check page title, verify element text) |

**Advantages:**
- Tests read like natural language business requirements — high traceability
- Interactions are written once and reused — resists copy-paste errors
- Same actor seamlessly interacts with both UI and API layers in a single test
- Decoupling actor intent from implementation provides resilience to UI changes

**Trade-off:** Requires advanced programming proficiency and more initial architecture investment.

## Pattern Comparison Matrix

| Pattern | Primary Focus | Scalability | Maintenance | Team Skill Requirement |
|---|---|---|---|---|
| **POM** | Physical page structure; elements grouped by URL/view | Moderate | Moderate — susceptible to class bloat | Standard |
| **Flow Model** | Business workflows; abstracts multi-page interactions | High | Low — clean separation of concerns | Standard+ |
| **Screenplay** | Actor intent and domain behavior | Very High | Low — highly modular, resilient to UI shifts | Advanced |

**Selection guidance:**
- Start with POM for new projects or small applications
- Adopt Flow Model when cross-page workflow reuse becomes a maintenance burden
- Adopt Screenplay when the team has multiple actors, complex permissions, or mixed UI/API test flows

## Test Data Management (TDM)

E2E automation is heavily dependent on the quality and isolation of test data. A well-architected test will fail against polluted, missing, or concurrently shared data.

### Three-Stage TDM Strategy

1. **Understand** — Profile data schemas, map entity relationships, detect sensitive information (PII)
2. **Generate** — Create synthetic datasets via subsetting, masking, and virtualization for realistic coverage without PII exposure
3. **Deliver** — On-demand provisioning into testing environments

### Data Setup Strategies

#### API Shortcuts (Preferred)

Use backend REST/GraphQL APIs to provision test entities (users, orders, tokens). Data passes through application business logic and validation layers.

**Advantages:** Orders of magnitude faster than UI creation, highly deterministic, exact state configuration without browser rendering overhead.

**This is the default strategy.** Override only when testing the creation workflow itself.

#### Database Seeding

Execute direct SQL/NoSQL statements to construct test data prior to execution. Exceptionally fast, completely bypasses application logic.

**Risk:** Bypassing the application layer can create malformed records that skip business logic validations, leading to false positives or unpredictable application crashes. Use only when API shortcuts are unavailable AND the data integrity risk is understood and accepted.

#### UI Data Creation

Create prerequisites through the browser exactly as a user would. Slowest and most brittle method.

**Restriction:** Use exclusively for tests that explicitly validate the creation workflow. Never use UI creation as setup for unrelated tests — this exponentially increases suite execution time and rendering-based flakiness.

### Test Isolation Principles

- Each test executes self-contained setup and teardown
- Dynamically generate unique identifiers (UUID/timestamp appended to entity names) to prevent collisions during parallel execution
- Reliably clean up database post-execution to preserve environment stability
- Never rely on data created by other tests or left from previous runs
- Use Playwright fixtures for explicit state injection — never global variables
