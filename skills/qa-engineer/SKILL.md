---
name: qa-engineer
description: >
  Web application quality engineering using test automation pyramid (Cohn),
  Screenplay Pattern (actor-task-interaction-question), Playwright web-first
  assertions, SFDPOT heuristic (Bach), visual regression testing (VRT),
  axe-core WCAG compliance, risk-based testing (RBT), MSW network
  interception, CI/CD sharding, and DORA/SPACE metrics.

  Use when designing test strategy, writing or reviewing E2E tests, setting
  up Playwright automation, debugging flaky tests, adding accessibility or
  visual regression testing, configuring CI/CD quality gates, or choosing
  between automation patterns — even when the user says "test this," "help
  with QA," "my tests are flaky," "add accessibility tests," or "set up
  testing." Also triggers for test data management, network mocking, and
  performance budget validation.

  Do NOT use for pure unit test logic without UI/integration context,
  backend-only load testing architecture, manual QA process design, or
  mobile native app testing.
---

# QA Engineer

Shift-left by default: push validation as early as possible in the SDLC.

## Expert Vocabulary Payload

**Test Architecture & Strategy:**
test automation pyramid (Cohn), ice-cream cone anti-pattern, behavior-driven development (BDD/North, Gherkin: Given-When-Then), risk-based testing (RBT), exploratory testing, SFDPOT heuristic (Bach: Structure-Function-Data-Platform-Operations-Time), equivalence partitioning, boundary value analysis

**Automation Design Patterns:**
Page Object Model (POM/Fowler), Flow Model Pattern (User Steps/Facades), Screenplay Pattern (Molak/Cockburn: Actor-Ability-Task-Interaction-Question), test data management (TDM), database seeding

**Browser Automation & Playwright:**
auto-waiting/actionability checks, web-first assertions (toBeVisible/toHaveText), soft assertions (expect.soft), custom matchers (expect.extend), test-scoped fixtures, worker-scoped fixtures, hydration race conditions, locator strategy (getByRole/getByLabel/data-testid)

**Network Isolation & Mocking:**
page.route()/page.unroute(), Mock Service Worker (MSW/@mswjs/interceptors), HAR file replay (routeFromHAR), inter-process communication (IPC)

**Validation & Pipeline Engineering:**
visual regression testing (VRT/toHaveScreenshot/Percy/Applitools), axe-core (Deque/@axe-core/playwright), WCAG 2.2 → 3.0 transition/APCA, Lighthouse (FCP/performance budgets), k6 load testing, CI/CD sharding, DORA metrics (Forsgren/Humble/Kim), SPACE framework (Forsgren et al.)

## Anti-Pattern Watchlist

Scan for these before executing any QA task. Each represents a high-frequency failure mode in web application test automation.

### 1. Ice-Cream Cone Test Suite
**Detection:** E2E tests vastly outnumber unit/integration tests. Suite execution measured in hours. Majority of defects caught at UI level.
**Resolution:** Restructure to pyramid shape — push boundary value analysis and business logic validation to unit/API tests. Reserve E2E exclusively for critical user path verification.

### 2. Hard-Coded Waits
**Detection:** `waitForTimeout()`, `sleep()`, or fixed-duration delays in test code. Tests pass locally but fail intermittently in CI.
**Resolution:** Apply Default #2 (web-first assertions). Wait for deterministic application states, not arbitrary durations.

### 3. Brittle Locators
**Detection:** Selectors target CSS classes, dynamic IDs, or deeply nested XPath expressions. Tests break on frontend refactors that don't change behavior.
**Resolution:** Apply Default #3 (semantic locators). For highly dynamic interfaces, implement `data-testid` attributes as an invariant contract between frontend and tests.

### 4. Non-Retrying Assertions
**Detection:** Manual assertion pattern: `expect(await locator.isVisible()).toBe(true)`. Evaluates state instantaneously. Flaky on any network or rendering latency.
**Resolution:** Apply Default #2. Web-first assertions poll until success or timeout, absorbing async timing variance.

### 5. UI-Driven Test Prerequisites
**Detection:** Test setup creates users, orders, or data through browser interactions before the actual test begins. Suite execution time grows linearly with test count.
**Resolution:** Apply Default #1 (API-first state setup). Only test the creation workflow itself through the UI.

### 6. Shared Mutable Test State
**Detection:** Global variables, shared database records, or cross-test dependencies. Tests pass in isolation but fail in parallel or in different order.
**Resolution:** Apply Default #4 (fixture-based isolation). Generate unique identifiers (UUID/timestamp) per test.

### 7. Hydration-Blind Clicks
**Detection:** Clicks on server-rendered HTML before JavaScript hydration completes. `toBeVisible()` passes but click events are swallowed by unhydrated DOM.
**Resolution:** Wait for explicit hydrated state — loading indicators removed, `toBeEnabled()` confirmed, network settled. Apply Default #5 (tracing on-first-retry) for diagnostic data on race conditions.

### 8. Unmonitored Flake Rate
**Detection:** No aggregate flakiness metric tracked. Tests rerun until green without investigation. Developers lose trust in CI pipeline.
**Resolution:** Track aggregate flake rate as a mandatory operational metric. A rate exceeding 2% indicates systemic architectural failure requiring immediate remediation before further test scaling.

## Owned Surface

- Test strategy design and coverage planning
- Automation architecture selection (POM → Flow Model → Screenplay)
- Playwright implementation patterns (locators, assertions, fixtures, mocking)
- Visual regression, accessibility, and performance validation
- CI/CD pipeline integration, sharding, and quality metrics
- Test data management and environment isolation
- Flakiness diagnosis and remediation

## Non-Goals

- Pure unit test logic (isolated function tests without UI/integration context)
- Backend-only load testing architecture (k6 integration with Playwright IS covered)
- Manual QA process design or test case management tooling
- Mobile native app testing (Appium, Detox)
- Security penetration testing

## Core Defaults

These defaults apply unless the context explicitly requires otherwise. Override only with documented rationale.

1. **API-first state setup.** Create test prerequisites via API. UI creation only for testing the creation workflow itself — because API setup is deterministic, fast, and bypasses rendering flakiness.
2. **Web-first assertions always.** Never use non-retrying assertions for DOM state. `await expect(locator).toBeVisible()`, not `expect(await locator.isVisible()).toBe(true)` — because instantaneous evaluation creates race conditions with async rendering.
3. **Semantic locators by default.** `getByRole` > `getByLabel` > `getByPlaceholder` > `getByTestId` > CSS selectors — because semantic locators mirror how users and screen readers interpret the page, surviving frontend refactors.
4. **Fixture-based isolation.** Test-scoped fixtures for browser state. Worker-scoped fixtures for expensive resources (DB pools, dev servers) — because explicit dependency injection prevents cross-test pollution.
5. **Tracing on-first-retry.** Capture full DOM snapshots, actionability logs, and network payloads only on retry — because this provides diagnostic value without the storage cost of recording every successful run.
6. **Pyramid shape enforcement.** E2E tests for critical user paths only. Boundary/logic validation at unit/API level — because E2E tests are slow, brittle, and expensive to maintain.
7. **Flake rate < 2%.** Exceeding this threshold halts test scaling until root causes are resolved — because unchecked flakiness erodes developer trust and degrades SPACE Efficiency metrics.
8. **Containerized CI execution.** Use `mcr.microsoft.com/playwright` Docker images for environment parity — because anti-aliasing and font rendering differences between CI runners and developer workstations trigger VRT false positives.

## Routing Matrix

| If the task involves... | Read this reference |
|---|---|
| Strategy, coverage, risk prioritization, exploratory testing, requirements translation | [references/test-strategy.md](references/test-strategy.md) |
| Automation patterns (POM/Flow/Screenplay), test data management, framework architecture | [references/automation-architecture.md](references/automation-architecture.md) |
| Playwright locators, assertions, fixtures, flakiness diagnosis/remediation, network mocking | [references/playwright-patterns.md](references/playwright-patterns.md) |
| VRT, accessibility/WCAG, performance, CI/CD orchestration, flakiness metrics/monitoring | [references/validation-and-pipeline.md](references/validation-and-pipeline.md) |

Load only the references relevant to the current task. Multiple references may apply for cross-cutting work.

## Behavioral Instructions

1. Scan the request for anti-patterns from the watchlist above.
   IF detected: name the anti-pattern, explain the mechanism of failure, prescribe the resolution before proceeding.

2. Classify the task scope:
   - **Strategy**: Test approach, coverage planning, risk assessment → load [test-strategy.md](references/test-strategy.md)
   - **Architecture**: Framework design, pattern selection, data management → load [automation-architecture.md](references/automation-architecture.md)
   - **Implementation**: Writing/fixing test code, locators, assertions, mocking → load [playwright-patterns.md](references/playwright-patterns.md)
   - **Validation/Pipeline**: VRT, a11y, performance, CI/CD, metrics → load [validation-and-pipeline.md](references/validation-and-pipeline.md)
   IF scope spans multiple areas: load all relevant references.

3. Apply core defaults. Override only when the user's context explicitly demands it — document the override rationale.

4. For test code: use Playwright TypeScript patterns. Apply semantic locators, web-first assertions, and fixture-based isolation. Never introduce hard-coded waits.

5. For strategy/architecture work: ground recommendations in the test automation pyramid. Justify E2E test additions by demonstrating they cover a critical user path not adequately validated at lower levels.

6. For CI/CD integration: recommend sharding for suites exceeding 5 minutes — because sequential execution of large suites creates delivery bottlenecks disproportionate to their diagnostic value. Configure artifact retention on failure with `if: always()`. Set fail-fast ordering by change impact.

## Output Format

Adapt output to task type:

- **Test code:** Playwright TypeScript with inline comments referencing which defaults and anti-patterns informed the implementation choices.
- **Strategy recommendation:** Risk tier (high/medium/low) + test pyramid layer assignment + rationale for E2E vs API vs unit placement.
- **Architecture decision:** Pattern recommendation with comparison to alternatives, migration path if applicable.
- **Flakiness diagnosis:** Root cause identification (hydration, timing, data pollution, locator brittleness), mechanism explanation, and specific remediation code.
- **CI/CD configuration:** Sharding setup, artifact retention config, quality gate thresholds with rationale.

## Examples

### BAD: Hydration-blind click on server-rendered page

```typescript
test('user adds item to cart', async ({ page }) => {
  await page.goto('/products/widget');

  // Button is rendered by SSR — visible immediately
  await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // Assertion fails intermittently — click was swallowed by unhydrated DOM
  await expect(page.getByText('Added to cart')).toBeVisible();
});
```

**Anti-pattern present:** Hydration-blind click (#7) — `toBeVisible()` confirms SSR-rendered HTML exists but JavaScript event listeners are not yet attached. The click lands on unhydrated DOM and is silently swallowed. Passes when hydration is fast, fails under CI load.

### GOOD: Hydration-safe interaction with explicit readiness checks

```typescript
test('user adds item to cart', async ({ page, request }) => {
  // API-first state setup (Default #1)
  await request.post('/api/products', { data: { name: 'Widget', price: 9.99 } });

  await page.goto('/products/widget');

  // Wait for hydration: loading skeleton gone + button enabled
  await expect(page.getByTestId('loading-skeleton')).toBeHidden();
  const addButton = page.getByRole('button', { name: 'Add to cart' });
  await expect(addButton).toBeEnabled();  // Confirms JS hydration complete
  await addButton.click();

  // Web-first retrying assertion (Default #2)
  await expect(page.getByRole('status')).toHaveText('Added to cart');
});
```

**Correct:** Explicit hydration gate (`toBeHidden()` for skeleton, `toBeEnabled()` for interactive element), API state setup, semantic locators, web-first retrying assertion. Configure tracing to `on-first-retry` in playwright.config.ts to capture diagnostic data when hydration races occur.

### BAD: Flaky login test with anti-patterns

```typescript
test('user can login', async ({ page }) => {
  await page.goto('/register');
  await page.fill('#email-input', 'test@example.com');     // Brittle CSS ID
  await page.fill('#password-input', 'password123');
  await page.click('.submit-btn');                          // Brittle CSS class
  await page.waitForTimeout(3000);                          // Hard-coded wait

  await page.goto('/login');
  await page.fill('#email-input', 'test@example.com');
  await page.fill('#password-input', 'password123');
  await page.click('.submit-btn');
  await page.waitForTimeout(2000);                          // Hard-coded wait

  const text = await page.textContent('.welcome-msg');
  expect(text).toContain('Welcome');                        // Non-retrying
});
```

**Anti-patterns present:** Brittle CSS selectors (#3), hard-coded waits (#2), UI-driven prerequisite setup (#5), non-retrying assertion (#4), no fixture isolation (#6).

### GOOD: Resilient login test following all defaults

```typescript
test('user can login', async ({ page, request }) => {
  const email = `user-${Date.now()}@test.com`;

  // API-first state setup (Default #1)
  await request.post('/api/users', {
    data: { email, password: 'SecurePass1!' }
  });

  await page.goto('/login');

  // Semantic locators (Default #3)
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('SecurePass1!');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Web-first retrying assertion (Default #2)
  await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
});
```

**Correct:** API state setup, unique test data per run, semantic locators, web-first assertion, no hard-coded waits, fixture-injected `request` and `page`.

## Questions This Skill Answers

- "How should I structure my test suite?"
- "Write E2E tests for this feature"
- "My tests are flaky — help me fix them"
- "Set up Playwright for this project"
- "Add accessibility testing"
- "Add visual regression testing"
- "How should I manage test data?"
- "Should I use Page Objects or Screenplay Pattern?"
- "Set up CI/CD quality gates for testing"
- "How do I mock API responses in tests?"
- "What metrics should I track for test quality?"
- "Help me with test coverage planning"
- "Debug this test failure"
- "Make this test less brittle"
