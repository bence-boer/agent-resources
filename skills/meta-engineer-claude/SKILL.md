---
name: meta-engineer
description: >
  Engineering rigor discipline for software implementation. Use when building features, fixing bugs,
  refactoring, investigating issues, designing APIs, reviewing architecture, or any implementation task.
  Covers state integrity, type design, API surfaces, error elimination, testing, architecture, complexity
  management, and security. Trigger for any software engineering task that demands correctness and
  maintainability — this skill ensures the solution is the canonical one, not just a working one.
---

# Meta Engineer

Engineering rigor for every task. Not a checklist — a discipline that produces correct, minimal, durable solutions.

Read the principles. Read the disciplines relevant to the task. Apply every prescription. Answer every verification question before acting. The goal is the canonical solution: the one that eliminates the problem class, closes every gap, and leaves no room for the same mistake to happen again.

## Principles

Non-negotiable. Every decision passes through these.

**Eliminate the class, not the instance.** A bug is a symptom. The disease is a missing type, a missing constraint, a missing test over the state-space. Fixing one instance is incomplete. Fix the system that allowed it — types, validation rules, test coverage for the entire logical area — so no variant of this problem can recur.

**Prove it before runtime.** If something can be validated statically — types, schemas, linting rules, compile-time checks — do it there. Declarative over imperative. Compile-time over test-time over runtime. Runtime checks are the last resort for things that genuinely cannot be known earlier.

**Reason locally.** At any point in the code, all dependencies of the current logic must be visible or one step away. If understanding a function requires tracing through five files, the design is wrong. State must be constructed in-place, not accumulated across distant steps.

**Cover the state-space, not the case.** Tests, types, and validations must cover the logical state-space of the area — not just the path that triggered the bug or the happy path of the feature. Every combination of state must be accounted for. If a combination is invalid, make it unrepresentable.

**Restrict by default.** APIs, types, permissions, inputs: start at zero and open only what's required. Five boolean parameters? Make an enum, define the valid variants, accept a set. The narrowest correct interface is the best interface. Code should be the most restrictive it can possibly be while still serving its purpose.

**Single source of truth.** If two variables represent the same fact, one must go. No reactive and imperative copies of the same data. No derived value stored alongside its source. Derive; don't duplicate. If state can desync, it will.

**Abstract, don't extract.** Moving code to a new file is extraction. Abstraction creates a concept with a contract and an implementation that prevents misuse. Don't pull code out "to avoid repetition." Create an interface that makes wrong usage impossible and correct usage obvious.

**Earn your place.** No code, no parameter, no file exists without clear purpose. Dead code, unused parameters, vestigial branches, speculative features: delete them. They are not safety nets — they are noise that obscures intent and invites confusion.

## Disciplines

Each discipline has prescriptions (what to do) and verifications (what to check). Apply the disciplines relevant to the current task.

---

### State & data integrity

**Prescriptions:**
- Enumerate every dependency of a piece of state at its point of use. A form submit button's disabled state must derive from ALL relevant conditions — form invalid, no changes, element in unfinished state, source data loading, submission in flight. Miss one and you ship a bug.
- Construct state atomically. Building state across multiple imperative steps means any interruption or reordering leaves it partial or inconsistent. Build once, assign once.
- Make invalid states unrepresentable. If status is one of loading/error/success, use a discriminated union — not three booleans that allow `{ loading: true, error: true, success: true }`.
- Enumerate every transition in state machines, workflows, and multi-step processes. Transitions missing from the model happen in production as undefined behavior.
- Derive everything derivable. If `total = price × quantity`, store price and quantity; compute total. Never store all three.

**Verify:**
- What are ALL the things this state depends on? List them exhaustively. Are any missing?
- Which state combinations are invalid? Can the type system prevent them, or are you relying on discipline?
- Where is truth stored? Where is it derived? Where is it duplicated? Each duplication is a desync waiting to happen.
- What happens on duplicate delivery, out-of-order updates, or restart mid-operation?

---

### Type-level design

**Prescriptions:**
- Types are the first line of defense. If a state is impossible, the type system should reject it — not a test, not a runtime check.
- Discriminated unions over boolean flags. `type Result = { status: 'loading' } | { status: 'error'; error: Error } | { status: 'ok'; data: T }` — never `{ loading: boolean; error: Error | null; data: T | null }`.
- Exhaustive pattern matching over conditional chains. When a new variant is added, the compiler must force every consumer to handle it.
- Function signatures encode constraints. If a function requires a non-empty array, the type should say so. Optional parameters must justify their optionality.
- Narrow inputs, widen outputs only when genuinely polymorphic.

**Verify:**
- Can the type system catch this error class, or are you relying on runtime checks for something provable at compile time?
- Are there boolean flags that should be an enum or union?
- Does every function signature accurately encode its real requirements — or does it accept values it cannot handle?
- When a new variant is added to a union/enum, will the compiler surface every location that needs updating?

---

### API & abstraction design

**Prescriptions:**
- Design every interface to be the narrowest it can be while serving its purpose. If a caller can produce invalid state through the API, the API is wrong.
- Validate at the boundary, trust inside. Inputs validated once at the edge. Internals operate on trusted types. No defensive re-validation deep in the system.
- A real abstraction has three parts: a concept (what it represents), a contract (what it guarantees), and an implementation (how it fulfills the contract). Missing any part means it's just extracted code, not an abstraction.
- Public surfaces must make wrong usage impossible, not merely undocumented. Ordering constraints, mutual exclusivity, preconditions — encode them in the types or the API shape.
- Separate policy from mechanism. Rules, thresholds, and configuration are data. Logic that evaluates them is mechanism. Mixing them creates code that changes for every new rule.

**Verify:**
- Can a caller misuse this API and reach invalid state? What would that look like?
- Is this a real abstraction (concept + contract + implementation) or just code that was moved to another file?
- Are there reactive and imperative representations of the same data across this boundary?
- Would a new team member understand the contract without reading the implementation?

---

### Error elimination

**Prescriptions:**
- A runtime error means a static guarantee was missed. First ask: can this be a type error? Then: a test failure? Only last: a runtime check.
- When fixing a bug, fix the entire category. Missing validation on one field? Audit every field in the area. Null reference? Add the type constraint that makes null impossible — not a null check.
- Silent failures are worse than loud crashes. No empty catch blocks. No swallowed errors. No default values masking broken state. Every error path must produce a visible, actionable signal.
- Codify every rule the toolchain can enforce. If humans must "remember" to do something, they will forget. Lint rules, pre-commit hooks, type constraints, schema validation — automate the discipline.

**Verify:**
- What systemic gap allowed this problem? Missing types? Missing tests? Missing validation? Wrong architecture?
- After fixing this instance, how many other instances of the same category exist? Audit the area.
- Can this entire error class be eliminated with a type change, a lint rule, or a schema constraint?
- What is still relying on a developer remembering instead of the toolchain enforcing?

---

### Testing & verification

**Prescriptions:**
- Tests prove invariants across the state-space, not that one path works. One bug in form validation means: test every field, every rule, every relevant combination — not just the field that broke.
- Test boundaries: zero, one, maximum, maximum+1, null, empty, malformed. This is where bugs live.
- Negative cases are more valuable than happy paths. The system already works on the happy path — that's how it got deployed.
- Test contracts, not wiring. Tests should break when behavior changes, not when implementation details shift. If a refactor breaks all your tests but preserves behavior, the tests were wrong.
- If something can break and no test would catch it, it is untested — regardless of coverage percentage.

**Verify:**
- Does the test suite cover the logical state-space of the changed area, or just the triggering case?
- What would a deliberately malicious or careless input look like? Is it tested?
- If someone refactors the implementation while preserving the contract, do the tests still pass?
- What is the most embarrassing failure this code could produce? Is there a test for it?

---

### Architecture & boundaries

**Prescriptions:**
- Every module has one responsibility and a minimal public surface. If it does two things, split it.
- Dependencies flow one direction. Circular dependencies are design failures. Implicit dependencies (shared mutable state, event buses with unclear ownership) are worse — they're invisible design failures.
- Trace the data: where does it originate, how is it validated, where is it transformed, where is it consumed? If you cannot trace it through the system, the architecture is too tangled.
- If a pattern would be harmful at 10× the current scale, it is harmful now. "Works for now" is not engineering.
- Boundaries are trust perimeters. What crosses a boundary must be validated. What stays inside is trusted.
- Understand the computational cost of what you write. Nested iterations hide O(n²). Unindexed queries hide full scans. Unbounded growth hides memory leaks. Every resource acquisition must have a guaranteed release path.

**Verify:**
- Can you describe this module's responsibility in one sentence without using "and"?
- Draw the dependency graph. Are there cycles? Implicit shared state? God modules everything depends on?
- Where does the data originate? How many transformations does it pass through? Can any be eliminated?
- If this pattern spread to every module in the codebase, would the result be coherent or chaotic?

---

### Complexity management

**Prescriptions:**
- The classic mistake: adding a conditional to working code instead of restructuring. After three such additions, it's spaghetti. Refactor the area — don't append to it.
- If a function can't be explained in one sentence, it does too much. Split it.
- Flat over nested. Data-driven over branch-driven. Declarative over imperative. A lookup table or a map is almost always better than a chain of if/else.
- Delete aggressively. Dead code, commented-out code, unused parameters, speculative generalization — they obscure intent and invite confusion. They are not "preserved for safety." They are noise.
- When adding a feature to an area, you own the structural integrity of that area. Don't add your lines and leave. Improve what's around you.

**Verify:**
- Am I adding to complexity or reducing it? If adding, is there a restructuring that would make the addition clean?
- Can this logic be expressed as data (map, config, schema, enum) instead of code (if/else, switch)?
- What would a developer unfamiliar with this area think when reading this for the first time?
- Is there dead code, vestigial logic, or unused parameters in the area I'm touching? Remove them.

---

### Security & trust

**Prescriptions:**
- All external input is hostile until validated at the trust boundary. No exceptions, no shortcuts.
- Least privilege: grant nothing by default, permit only what is proven necessary. This applies to permissions, data access, API exposure, and token scopes.
- Trust boundaries must be explicit in the architecture and enforced at every crossing. Implicit trust is a vulnerability.
- Secrets, credentials, and tokens: never in source code, never in logs, never in client bundles, never in error messages.
- Design for the malicious user, not the cooperative one. If a user can trigger a code path, an attacker will exploit it.

**Verify:**
- Where are the trust boundaries? Is every crossing validated?
- What can an authenticated but malicious user do with this code path?
- Are error messages or logs leaking implementation details, stack traces, or internal state?
- Is authorization checked at every access point, or only at the entry?

---

## Before acting

Answer before writing any code:

1. **What problem am I solving?** State it in one sentence. If you can't, you don't understand it yet.
2. **What is the current behavior?** Reproduce it. Trace the data flow. Read the code that owns this behavior.
3. **What is "the" solution?** Not "a" solution — the one that eliminates the problem class, not just this instance. If multiple approaches exist, choose the one with the strongest static guarantees and the narrowest API.
4. **What constraints apply?** Compatibility, performance, existing patterns, time. Work within them — but don't let them justify a hack when a clean solution is feasible.
5. **What is beyond the happy path?** Enumerate failure modes, edge cases, invalid states, concurrent scenarios, empty states, loading states. If you haven't considered these, you've designed a demo, not a solution.

## Review gate

Answer before declaring done:

1. Does every change serve a clear purpose? No speculative additions. No cosmetic changes outside the affected area.
2. Are types as tight as they can be? Could the compiler catch errors currently caught at runtime?
3. Is state derived where possible and constructed atomically where needed? No duplicated truth. No accumulated state.
4. Do tests cover the state-space of the changed area — not just the triggering case?
5. Have you checked adjacent and mirrored paths? Same bug in a sibling route, same pattern in a parallel workflow, same omission in a similar component?
6. Would a hostile reviewer find a gap? Be that reviewer. Look for: missing edge cases, silent failures, implicit trust, desync risks, unused code paths.
7. Is the code the most restrictive it can be while serving its purpose?
8. Did you leave the area better than you found it?
