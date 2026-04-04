# Architecture Review

Use this guide when auditing or restructuring an existing Svelte 5 + SvelteKit application. Focus on system shape, ownership, and long-term maintainability. Do not drift into line-by-line refactoring advice here.

## 1. Route and layout structure

Check whether the current route tree expresses real shell boundaries.

Questions to answer:

- Are route groups organized by shell, navigation, or access control?
- Are layouts shallow and purposeful, or deeply nested because features were added ad hoc?
- Would a new major feature have an obvious place to live?
- Are auth, marketing, and product surfaces clearly separated?

Strong signal of a problem:

- route groups are mirroring product taxonomy rather than shell boundaries
- many pages depend on a layout that exists only to share one small widget

## 2. State and data ownership

Inventory every state pattern in use, then collapse duplicates.

Look for:

- page data moved into global state without a real cross-route need
- multiple patterns solving the same scope problem
- client-side data orchestration compensating for a missing server boundary
- Context used as a substitute for application architecture

Apply the state scope hierarchy from the root skill. If the codebase skips several levels routinely, investigate why.

## 3. Component system boundaries

Audit whether the UI layers are still clean.

Ask:

- Are primitives still primitive, or have they absorbed feature logic?
- Are feature components cohesive, or are they stitched together from route-level hacks?
- Is there a clear distinction between reusable UI vocabulary and domain-specific composition?
- Is there a generic `shared/` area hiding ownership problems?

Common failure modes:

- primitives importing business services
- pages acting as permanent dumping grounds for logic
- feature code split across unrelated shared folders

## 4. UX completeness

Apply the UX completeness checklist from the root skill to every critical journey under review. A codebase can look structurally tidy and still be architecturally weak if these states are bolted on inconsistently.

## 5. Dependency and stack discipline

Review the dependency surface, not just the folder structure.

Check whether:

- there is one clear styling strategy
- there is one clear validation strategy
- frontend/backend typing uses one primary pattern
- headless behavior and styled wrappers are separated cleanly
- new libraries were added to compensate for unclear architecture rather than real product needs

Architectural smell:

- different features standardize on different libraries for the same concern

## 6. Extensibility and team scaling

Pressure-test the structure by asking:

- Can a new developer place a feature without tribal knowledge?
- Can two engineers work in parallel without colliding in shared files constantly?
- Can a feature be removed without touching half the codebase?
- Is it obvious where a new primitive, feature component, server boundary, or route belongs?

If the answer is no, the architecture is not scaling even if the app still works.

## 7. Review output

When reporting findings, always include:

1. **Current-state summary**
2. **Primary structural problems**
3. **Concrete target architecture**
4. **Priority order** (`now`, `next`, `later`)
5. **Migration sequencing**
6. **Implementation handoff constraints**

Make explicit recommendations. Avoid ending with only open-ended questions.
