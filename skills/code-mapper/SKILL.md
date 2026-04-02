---
name: code-mapper
description: Build structured YAML code maps that compress a codebase workflow, logic path, or API surface into a readable, information-dense Markdown artifact. Use when an agent needs to understand, document, or prepare a code area for later work without requiring repeated source file access. Covers exploration strategy, node extraction, depth calibration, and output formatting.
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
| `Mapss`      | User action, route change, or UI transition triggers the target                                 |
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

## Output contract

Every delivered map must follow this contract.

### Map header

```yaml
map:
    describes: '<scope sentence>' # Concise statement of the workflow, logic path, or API surface being mapped.
    depth: 'L0-L2' # One of `L0-L1`, `L0-L2`, or `L1-L3`.
    generated: 'YYYY-MM-DD' # Date in `YYYY-MM-DD` format.
    files_covered: # Complete list of repo-relative internal files represented in the map. List each file once.
        - 'path/to/file'
    roots: # Ordered list of entry points at the same conceptual level.
        - node: 'unique-kebab-case-root'
```

### Node contract

Use this property order on every defined node:

```yaml
- node: 'unique-kebab-case-name' # Required on every defined node. The value must be unique within the map, descriptive, and written in kebab-case. `reference:` must target this exact value.
  functionality: "States the node's observable responsibility in one factual line." # Required on every defined node. Use one factual line describing what the node does from the workflow's perspective.
  file: 'path/to/file' # Repo-relative path for nodes backed by code. Omit only for L0 aggregates without a single backing file or for terminal boundary nodes.
  line: '123-129' # Exact line number or inclusive range in `123` or `123-129` format. Never guess. Omit only when no exact line is meaningful at the chosen depth.
  signature: 'function doThing(arg: Type): Result' # Include for callable or type-level nodes when it materially helps the reader.
  mechanism: 'optional-extra-metadata' # Additional metadata keys - Allowed only when they are self-explanatory and materially useful to the task, such as `condition`, `mechanism`, `returns`, or `annotation`.
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

## Operating defaults

- **Artifact form** - Produce one Markdown artifact containing one YAML code block. The YAML tree is the map.
- **Default depth** - Start at `L0-L2`. Use `L0-L1` only for broad orientation. Use `L1-L3` only when exact conditions, config values, or expressions materially affect the task.
- **Default edge set** - Use the smallest vocabulary that explains the workflow. Most maps need only `invokes` and `Mapss`.
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

- For a new map, open exactly one depth template in `assets/templates/`:
    - `L0-L1.md` - one minimal graph at system/module depth
    - `L0-L2.md` - one minimal graph with symbol-level working context
    - `L1-L3.md` - one minimal graph with detail nodes for deep investigation
- Each depth template shows one simple graph that includes the common subgraph patterns in context.
- For updating an existing map after code changes, use `references/updating-maps.md`.

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
