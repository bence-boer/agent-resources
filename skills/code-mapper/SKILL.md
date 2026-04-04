---
name: code-mapper
description: Build structured YAML code maps that compress a codebase workflow, logic path, or API surface into a readable, information-dense Markdown artifact. Use when an agent needs to understand a workflow, map out how code connects, prepare a code area for later work, or document an API surface without requiring repeated source file access. Covers exploration strategy, node extraction, depth calibration, and output formatting. Do NOT use for writing code, debugging, code review, or architecture decisions.
---

# Code Mapper

## What this skill owns

- Producing self-contained Markdown artifacts whose main payload is a YAML code map
- Exploring a codebase to find the right roots, downstream paths, convergence points, and boundaries for a task
- Calibrating map depth, node granularity, metadata, and edge vocabulary to the task
- Updating an existing map when the existing structure still matches reality

## What this skill does not own

- Implementation, debugging, or review work that happens after the map exists
- Visual diagrams, UML, or non-text artifacts
- Replacing direct source reading when the task requires line-level edits
- Maintaining a continuously current whole-codebase index unless explicitly requested

## Expert vocabulary

**Graph Structure:** node, edge, entry point, call site, dependency chain, data flow, control flow, convergence point, fan-out, fan-in

**Abstraction Levels:** API surface, module boundary, interface contract, public API, internal helper, system boundary, symbol-level granularity

**Depth Calibration:** L0 (system), L1 (module), L2 (symbol), L3 (detail), relevance weighting, selective expansion, inclusion test, depth range

**Code Navigation:** call graph, import graph, symbol resolution, cross-reference, upstream caller, downstream callee, dead code path

**Map Topology:** linear path, diamond convergence, hourglass bottleneck, forest (independent roots), branching fan-out, cross-boundary reference node

## Anti-pattern watchlist

### 1. Copy-paste documentation
**Detection:** Nodes contain raw file contents, multi-line code blocks, or full function bodies instead of extracted structure.
**Resolution:** Extract signatures, responsibilities, and edges. A node's `functionality` is one factual line, not a code dump.

### 2. Flat node lists
**Detection:** All functions listed at the same level with no edges, data flow, or nesting.
**Resolution:** Organize nodes into a tree with edges showing invocation, subscription, or dependency. If there are no edges, the map is just an index.

### 3. Implementation detail leakage
**Detection:** Function bodies, local variables, or algorithm steps appear in nodes meant for L0-L2 depth.
**Resolution:** Use `signature` and `functionality` to summarize. Only include implementation details at L3 when the specific detail is the point of the task.

### 4. Missing edge coverage
**Detection:** Only happy-path flows are mapped. Error handling, fallback flows, and boundary conditions are absent.
**Resolution:** Map error branches, fallback paths, and boundary nodes. Use `condition` metadata to show branching logic.

### 5. Scope creep
**Detection:** The map covers the entire codebase when the task only asks about one workflow or feature.
**Resolution:** Re-read the task. Map only what the task requires. Use `boundary: true` to terminate paths that leave scope.

### 6. Stale depth
**Detection:** Every node uses the same granularity regardless of relevance — either uniformly shallow or uniformly deep.
**Resolution:** Calibrate depth per subtree. Expand critical paths to L2-L3; collapse peripheral paths to L1 summaries.

## Node model and depth selection

Every node represents a code unit at one abstraction level. Use only the levels needed for the task.

| Level       | Represents                                                       | Typical use        |
| ----------- | ---------------------------------------------------------------- | ------------------ |
| L0 - System | Service, application, package, or boundary                       | Broad orientation  |
| L1 - Module | File or logical group of files                                   | Working structure  |
| L2 - Symbol | Function, class, method, type, or constant                       | Working context    |
| L3 - Detail | Branch, condition, config value, annotation, or exact expression | Deep investigation |

Pick the narrowest range that satisfies the task:

- **Broad overview** - `L0-L1`
- **Working context** - `L0-L2`
- **Deep investigation** - `L1-L3`

### Inclusion test

At every candidate node, ask:

- Does this node materially affect the behavior the task cares about?
- Would a later agent need to know this exists to do the work correctly?
- Can this be collapsed into the parent's `functionality` instead of becoming its own node?

Include the node only when the first two answers are yes and the third is no. Otherwise collapse it into the parent or omit it.

## Edge vocabulary

Edges are YAML keys containing child nodes. Use the broadest applicable term.

| Edge key     | Use when                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `invokes`    | Direct invocation: function call, method call, constructor, request, system call, CLI execution |
| `triggers`   | User action, route change, or UI transition triggers the target                                 |
| `subscribes` | Event, observable, callback, stream, or message-driven connection                               |
| `imports`    | Static dependency when the dependency relationship itself matters                               |
| `extends`    | Inheritance, implementation, or mixin relationship                                              |
| `configures` | Configuration, provider registration, or annotation materially shapes behavior                  |

If the exact mechanism matters, keep the broad edge key and add clarifying metadata to the child node instead of inventing a new edge key.

## Supported graph patterns

These are recurring subgraph shapes, not mutually exclusive template choices. A single map can contain several of them at once.

- **Linear** - a local stretch where one node leads through a single main sequence
- **Forest** - multiple roots or branches stay independent instead of converging
- **Diamond** - multiple upstream paths converge on one shared downstream node
- **Hourglass** - several inputs funnel through one bottleneck and then fan out again
- **Branching** - one node splits into multiple downstream paths
- **Cross-boundary** - part of the graph reaches an external or intentionally out-of-scope boundary

## Operating defaults

- **Artifact form** - Produce one Markdown artifact containing one YAML code block. The YAML tree is the map.
- **Default depth** - Start at `L0-L2`. Use `L0-L1` only for broad orientation. Use `L1-L3` only when exact conditions, config values, or expressions materially affect the task.
- **Default edge set** - Use the smallest vocabulary that explains the workflow. Most maps need only `invokes` and `triggers`.
- **Default structure** - Build one coherent graph. Let common subgraph patterns appear naturally inside it instead of forcing the map into a single named shape.
- **Boundaries** - Stop at third-party internals, external systems, and out-of-scope areas unless the task explicitly requires mapping inside them. Represent the boundary explicitly; do not silently stop.
- **Compression target** - Include enough detail that another agent can reason about the mapped area and decide whether source reading is still needed. Exclude implementation bodies and incidental syntax unless a specific detail is itself the point.

## Exploration workflow

1. **Find certain code first.** Start from code that is clearly in scope for the task.
2. **Trace backward to true roots.** Use callers, routes, event sources, registrations, or exports to find the earliest meaningful entry point.
3. **Choose depth first.** Set the narrowest depth range that satisfies the task.
4. **Open the matching depth template.** Use the template file for the selected depth as a structural starting point.
5. **Expand forward.** Follow relevant edges from each root through the workflow.
6. **Let subgraph patterns emerge.** Use linear, forest, diamond, hourglass, branching, and cross-boundary as local descriptions inside one graph, not as exclusive top-level modes.
7. **Handle convergence immediately.** When branches meet, replace repeated subtrees with `reference:`.
8. **Stop at boundaries.** Represent external or out-of-scope terminals explicitly with `boundary: true` unless the task requires deeper mapping.
9. **Fill metadata from source.** Read the code to get exact paths, line values, signatures, and functionality summaries.
10. **Review top-to-bottom.** The final map must read as a coherent narrative without jumping or hidden assumptions.

## Routing to secondary files

- For a new map, open exactly one depth template from the `assets/templates` folder:
    - [L0-L1.md](assets/templates/L0-L1.md) - one minimal graph at system/module depth
    - [L0-L2.md](assets/templates/L0-L2.md) - one minimal graph with symbol-level working context
    - [L1-L3.md](assets/templates/L1-L3.md) - one minimal graph with detail nodes for deep investigation
- Each depth template shows one simple graph that includes the common subgraph patterns in context.
- For updating an existing map after code changes, use [updating-maps.md](references/updating-maps.md).

## Output contract

Every delivered map must follow this contract.

### Map header

```yaml
map:
    describes: '<scope sentence>'
    depth: 'L0-L2'
    generated: 'YYYY-MM-DD'
    files_covered:
        - 'path/to/file'
    roots:
        - node: 'unique-kebab-case-root'
```

### Node contract

Use this property order on every defined node:

```yaml
- node: 'unique-kebab-case-name'
  functionality: "States the node's observable responsibility in one factual line."
  file: 'path/to/file'
  line: '123-129'
  signature: 'function doThing(arg: Type): Result'
  mechanism: 'optional-extra-metadata'
  invokes:
      - node: 'downstream-node'
```

### Boundary nodes

Use a terminal boundary node when the path reaches an external or intentionally out-of-scope area.

```yaml
- node: 'external-auth-service'
  functionality: 'Authenticates credentials and returns a session token.'
  boundary: true
```

- Use `boundary: true` only on terminal nodes.
- Do not attach guessed internals to a boundary node.
- If the task explicitly requires mapping inside the external system, stop treating it as a boundary and keep mapping.

### Convergence and references

When multiple branches lead to the same node, define the node fully on first occurrence and reference it elsewhere.

```yaml
invokes:
    - reference: 'shared-request-builder'
```

- Every `reference` value must match an already-defined unique `node` value.
- If two candidate nodes would share the same name, rename them before mapping rather than relying on file context.
- Duplicate subtrees are invalid when `reference:` would represent the shared path.

### Multiple roots

- Put all entry points under `map.roots`.
- Keep roots at the same conceptual level adjacent.
- Produce one unified graph, not several disconnected mini-maps.

### Output style

- Use dry, factual, information-dense language.
- Keep `describes`, `functionality`, and any metadata fields concise and scannable.
- Describe the current structure only. Do not narrate how the map was produced or updated.
- Example comments in this skill explain the schema only. Delivered maps should not include instructional comments, change notes, or explanatory prose inside the artifact.
- Do not include comments, legends, changelog notes, or labels such as `new`, `updated`, `renamed`, or `removed` inside the map.
- When updating a map, apply the edits directly so the delivered artifact contains only the current state.
- If the user wants separate explanation, keep it outside the artifact rather than embedding it in the map.

## Validation checklist

Before delivering the map:

1. Every defined node has both `node` and `functionality`.
2. Every `node` value is unique, descriptive, and kebab-case.
3. Every `reference` resolves to an already-defined node.
4. Every internal `file` path resolves.
5. Every `line` value is exact rather than inferred.
6. Depth is consistent with the stated `depth` range.
7. No duplicate subtrees remain where `reference:` would represent the shared path.
8. Boundaries are represented explicitly instead of being silently truncated.
9. `files_covered` is complete for all internal files represented in the map.
10. The map is self-contained enough that a consuming agent can understand the structure without re-reading source just to learn the workflow.

## Examples

### BAD: flat function list with no relationships

```yaml
map:
  describes: "auth module"
  depth: "L0-L2"
  roots:
    - node: "login"
      functionality: "Handles login."
      file: "src/auth/login.ts"
    - node: "logout"
      functionality: "Handles logout."
      file: "src/auth/logout.ts"
    - node: "validate-token"
      functionality: "Validates tokens."
      file: "src/auth/token.ts"
    - node: "refresh-token"
      functionality: "Refreshes tokens."
      file: "src/auth/token.ts"
    - node: "hash-password"
      functionality: "Hashes passwords."
      file: "src/auth/password.ts"
```

No edges, no data flow, no signatures. Every node is a disconnected item at the same level. A reader learns nothing about how authentication actually works.

### GOOD: structured graph with entry points, data flow, and dependencies

```yaml
map:
  describes: "JWT authentication flow from login request through token lifecycle"
  depth: "L0-L2"
  generated: "2025-01-15"
  files_covered:
    - "src/auth/login.ts"
    - "src/auth/token.ts"
    - "src/auth/password.ts"
  roots:
    - node: "handle-login-request"
      functionality: "Validates credentials and issues a JWT token pair."
      file: "src/auth/login.ts"
      line: "14-38"
      signature: "async function handleLogin(req: LoginRequest): Promise<TokenPair>"
      invokes:
        - node: "verify-password"
          functionality: "Compares the submitted password against the stored bcrypt hash."
          file: "src/auth/password.ts"
          line: "8-15"
          signature: "async function verifyPassword(plain: string, hash: string): Promise<boolean>"
        - node: "issue-token-pair"
          functionality: "Signs and returns an access token and refresh token."
          file: "src/auth/token.ts"
          line: "20-34"
          signature: "function issueTokenPair(userId: string): TokenPair"
          invokes:
            - node: "external-jwt-signer"
              functionality: "Signs tokens using the configured secret."
              boundary: true
```

Entry points, signatures, edges, and boundary nodes. A reader knows how login works without opening the source files.

### BAD: verbose code dump instead of compressed node

```yaml
- node: "normalize-input"
  functionality: |
    Takes the raw input object, checks if it has a 'data' property,
    then iterates over each item using Array.map(), converts dates
    using new Date(item.timestamp), filters out nulls with .filter(Boolean),
    sorts by the converted date, and wraps the result in { normalized: true, items: [...] }.
  file: "src/transform.ts"
  line: "45-78"
```

### GOOD: compressed signature + responsibility + edges

```yaml
- node: "normalize-input"
  functionality: "Parses, deduplicates, and sorts raw input records by timestamp."
  file: "src/transform.ts"
  line: "45-78"
  signature: "function normalizeInput(raw: RawInput): NormalizedRecord[]"
  invokes:
    - node: "validate-records"
```

One factual line for functionality. Signature gives the contract. Edges show where the flow continues. Implementation stays in the source.

## Questions this skill answers

- "Map this codebase area"
- "How does this workflow work?"
- "Create a code map for this feature"
- "Document the data flow through these files"
- "What does this code path do?"
- "Help me understand this part of the codebase"
