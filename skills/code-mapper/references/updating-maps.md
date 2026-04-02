# Updating Existing Maps

Guidance for updating a code map after the underlying source has changed.

## When to update vs regenerate

- **Update** when the change is localized: a function was renamed, moved, or had its signature changed; a node was added or removed from an existing path; line numbers shifted.
- **Regenerate** when the change is structural: the workflow was fundamentally reorganized, entry points changed, or the map's scope no longer matches the task.

If unsure, check whether the existing map's `roots` structure still reflects reality. If it does, update. If it does not, regenerate.

## Update procedure

1. Identify which source files in `files_covered` have changed.
2. For each changed file, locate the affected nodes in the map.
3. Verify and correct: `file`, `line`, `signature`, `functionality` for each affected node.
4. If a node was removed from the source, remove it from the map.
5. If a new node was added to the source and it passes the inclusion test, add it at the correct position in the tree.
6. If a relationship changed (e.g., A no longer invokes B, now invokes C), update the edge.
7. Check that `reference:` references still resolve to valid nodes.
8. Update the `generated` date in the map header.
9. Update `files_covered` if files were added or removed.
10. Walk the map top-to-bottom to verify it still reads coherently.

## Partial updates

If only part of the map is affected and the rest is known to be current, the agent may update only the affected subtree.

## When the map is a living artifact

If the map is maintained as part of the codebase (not a one-shot investigation), the agent should:

- Update the map as part of any PR that changes the mapped code paths
- Keep the map in the same directory as the code it describes, or in a dedicated docs directory
- Note staleness risks: if the map has not been updated in a long time, flag this to the user before relying on it
