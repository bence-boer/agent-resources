# Playwright Implementation Patterns

> Reference for the QA Engineer skill. Load when the task involves Playwright locators, assertions, fixtures, flakiness diagnosis, or network interception/mocking.

---

## Locator Strategy and Hierarchy

Locators determine test resilience. The hierarchy reflects stability and semantic meaning:

1. **`getByRole()`** — mirrors how users and assistive technology interpret the page. Most resilient.
2. **`getByLabel()`** — targets form elements by their associated label text.
3. **`getByPlaceholder()`** — targets inputs by placeholder attribute.
4. **`getByText()`** — matches visible text content.
5. **`getByTestId()`** — targets `data-testid` attributes. Use when semantic elements are insufficient for highly dynamic, auto-generated interfaces.
6. **CSS/XPath selectors** — last resort. Tied to DOM structure, breaks on refactors.

**Rationale:** Semantic locators focus on user-visible behavior, ignoring hidden implementation details. They survive stylesheet refactors, DOM restructuring, and component library changes. `data-testid` provides a hardcoded invariant contract between frontend code and the test suite, immunizing tests against cosmetic changes.

## Auto-Waiting Mechanism

Before executing any interaction (click, keystroke, fill), Playwright automatically performs actionability checks:

1. Element is **attached** to the DOM
2. Element is **visible** (not hidden by CSS, not zero-size)
3. Element is **stable** (not animating or undergoing CSS transitions)
4. Element can **receive events** (not obscured by another element)
5. Element is **enabled** (not disabled)

This continuous polling eliminates the need for `waitForTimeout()`. Hard-coded waits slow suites when systems are fast and still fail non-deterministically when systems experience unexpected latency.

## Assertion Paradigms

| Paradigm | Mechanism | Use When |
|---|---|---|
| **Web-First (Retrying)** | Polls DOM asynchronously until success or timeout. `await expect(locator).toHaveText()` | Validating dynamic DOM elements that depend on network data hydration |
| **Non-Retrying** | Evaluates condition instantaneously once. `expect(value).toEqual()` | Checking static variables, API JSON response bodies, mathematical states |
| **Soft Assertions** | Logs failure but continues execution. `expect.soft(locator).toHaveText()` | Form validation where multiple independent error states must be captured simultaneously |

**Critical rule:** Never use non-retrying assertions for DOM state. `expect(await locator.isVisible()).toBe(true)` evaluates instantaneously and creates flaky tests on any network or rendering latency. Always use `await expect(locator).toBeVisible()`.

## Custom TypeScript Matchers

Extend Playwright's assertion library with domain-specific matchers via `expect.extend()`:

```typescript
expect.extend({
  async toHaveAmount(locator: Locator, expected: number) {
    const text = await locator.textContent();
    const actual = parseFloat(text?.replace(/[^0-9.]/g, '') ?? '0');
    return {
      pass: actual === expected,
      message: () => `Expected amount ${expected}, received ${actual}`,
    };
  },
});
```

**Benefits:** Strong compile-time type safety, encapsulated validation logic, clear diagnostic output via `matcherHint` utilities. Custom matchers improve domain-specific readability (e.g., `toHaveAmount(4)`, `toBeValidCurrency()`).

## Fixture Management and Isolation

Fixtures prevent cross-test pollution by replacing global variables with explicit dependency injection.

### Test-Scoped Fixtures

Created fresh for every single test execution. Provide an immaculate browser context, isolated local storage, and independent cookie jars. Zero data leakage between parallel runs.

### Worker-Scoped Fixtures

Instantiated once per worker process, reused across multiple test files assigned to that worker. Use for expensive operations: database connection pools, local dev server startup.

### Advanced Fixture Features

- **Override built-in fixtures** — extend the default `page` fixture to inject custom prerequisite behaviors (authentication, feature flags)
- **`{ box: true }`** — hide utility fixture execution steps from final reporting logs, reducing diagnostic noise
- **Fixture-specific timeouts** — prevent lengthy setup from falsely triggering primary test execution timeouts
- **`{ auto: true }`** — automatic fixtures run without explicit injection, ensuring critical prerequisite infrastructure initializes before the test queue begins

## Combating Hydration Race Conditions

In React/Vue/Svelte applications, HTML may be rendered and visible (passing `toBeVisible()`) while JavaScript event listeners are not yet attached (hydration). Clicking during this window: the click is swallowed by unhydrated DOM, the expected state never materializes.

**Mitigation strategy:**

1. Wait for explicit, deterministic application states:
   - Loading skeleton has detached
   - Network requests have settled
   - Interactive elements report `toBeEnabled()`
2. Never evaluate text eagerly with `textContent()` — use retrying `toHaveText()` assertion
3. Configure automatic retries: `retries: 2` in Playwright config to absorb transient infrastructure anomalies
4. Set tracing to `on-first-retry` — captures full DOM snapshots, actionability logs, and network payloads without storage costs on successful runs (see [validation-and-pipeline.md](validation-and-pipeline.md) for CI artifact retention strategy)

## Network Interception: Native Playwright Routing

`page.route()` and `page.unroute()` intercept HTTP/HTTPS traffic using glob patterns or regex:

- **Abort** — block heavy tracking scripts, analytics, third-party ads to accelerate execution
- **Modify** — inject specific headers, alter request parameters
- **Fulfill** — respond with static JSON mock data, bypassing live backend entirely

```typescript
await page.route('**/api/users', route =>
  route.fulfill({ json: { id: 1, name: 'Test User' } })
);
```

Playwright also supports HTTP Authentication at the context level for bypassing basic access authentication in pre-production.

## Mock Service Worker (MSW) Integration

For application-wide mock schemas, MSW provides centralized routing architecture superior to per-test `page.route()` calls.

**Architecture:** Modern MSW integration (`@mswjs/interceptors`) uses native class extensions (extending `http.ClientRequest`) rather than fragile monkey-patching. This approach natively utilizes the Node.js event loop and internal request validation logic, ensuring behavior that accurately mirrors production environments. MSW intercepts at the network level, normalizing all requests into standard Fetch API Request objects regardless of whether the app uses `axios`, `fetch`, or `XMLHttpRequest`.

**The IPC challenge:** Playwright executes in Node.js; MSW runs in a Service Worker thread inside Chromium. Dynamic per-test mock changes require crossing this process boundary.

**Solutions:**
1. **`window.mockData` pattern** — expose configuration via `page.evaluate()`, MSW handlers read from `window` object
2. **Admin REST endpoint** — engineer a dedicated endpoint within MSW that Playwright invokes to update mock state dynamically

Both approaches enable per-test mock customization (e.g., admin user for one test, standard user for the next).

## HAR File Traffic Replay

For complex legacy systems or dynamic APIs where manual mock creation is prohibitive:

1. **Record** — Playwright captures all network traffic during a baseline walkthrough, saving as HAR file
2. **Replay** — `page.routeFromHAR()` intercepts network calls and replays exact recorded responses

**Advantages:** Absolute fidelity to historical production traffic. Complete backend decoupling. Automated creation without hand-crafting mocks.

**Best for:** Legacy system integration tests, APIs with complex response structures, and establishing stable baselines quickly.
