# Code Quality, Testing, and Git Practices

## Linting

### Configuration

ESLint with `@stylistic/eslint-plugin` (replaces Prettier). Key rules:

| Rule | Setting | Impact |
|------|---------|--------|
| `max-lines` | 200 (skip blanks/comments) | Forces file decomposition |
| `naming-convention` | `snake_case` default, `PascalCase` types | Enforces project conventions |
| Semicolons | Required | Consistent style |
| Quotes | Single | Consistent style |
| Indentation | 4 spaces | Consistent style |
| Trailing commas | Forbidden | Consistent style |
| Max line length | 160 chars | Readability |

### No Escape Hatches

- All `eslint-disable` comments are banned
- `--no-inline-config` flag prevents inline overrides
- If a rule needs to be disabled often, fix the rule — don't add exceptions

### Enforcement

```bash
bun run lint         # Check (must pass before commit)
bun run lint:fix     # Auto-fix (run by pre-commit hook)
```

The pre-commit hook runs `lint:fix` → re-stages fixed files → type-checks both packages.

## Testing

### Backend Test Structure

Tests use Hono's `app.request()` — no HTTP server needed:

```typescript
function setup() {
    const { app, store, client } = create_test_app(seed?);
    app.route('/api/X', X_routes);
    return { app, store };
}
```

Auth is injected via `auth_headers()` returning a valid session cookie. A mock Supabase client
operates on an in-memory store.

### What to Test

Every route should test:
1. **401 without auth** — every authenticated route
2. **400 for invalid UUID** — every parameterized route
3. **404 for non-existent entities** — CRUD endpoints
4. **Input validation** — Zod schema rejections
5. **Happy path** — correct response shape and status code

**Negative cases are more valuable than happy paths.** 401s, 400s, and 404s are what break in
production.

### Mock Supabase

The test infrastructure uses `MockSupabaseClient` with `MockQueryBuilder` that simulates
Supabase's chained query API against an in-memory store. Tests validate both route logic and
query construction without database infrastructure.

## Git Practices

### Commit Format

```
[verb] [feature/action] [context]
```

- Imperative present tense: "Add", "Fix", "Implement", "Refactor"
- Single line, under 50 characters, no trailing period
- Examples:
  - `Add system health diagnostics to dashboard`
  - `Fix hamburger menu overlapping navigation`
  - `Resolve all stabilization review items`

### Commit Strategy

- Only commit after E2E verification (type check + lint + manual test)
- One logical change per commit (backend + frontend + migration together if related)
- If fixing a flaw in a recent commit on the current branch:
  - `git commit --amend --no-edit` (for the last commit)
  - `git commit --fixup=<sha>` + `git rebase -i --autosquash <sha>^` (for older commits)

### Branch Strategy

- Branch names: `kebab-case`, prefixed with `release/`, `feature/`, or `bugfix/`
- Merge with `git merge --no-ff` (never fast-forward)
- Rebase branch onto target before merging
- `git push --force-with-lease` (never `--force` without `--lease`)

## Pre-Commit Hook

The hook (`scripts/pre-commit`) runs in order:
1. `bun run lint:fix` — auto-fix lint issues
2. Re-stage auto-fixed files
3. `cd server && bun run --bun tsc --noEmit` — type check backend
4. `cd web && bun run check` — type check frontend
5. `bun run gen-types` — regenerate database types (if local DB is running)

## CI/CD Verification

After pushing:

```bash
# Poll for CI completion
gh run list --limit 1 --json status,conclusion

# On failure, get logs
gh run view --log-failed
```

### Self-Hosted Runner Notes

The GitHub Actions runner runs on the Raspberry Pi. Key requirements:
- Explicit `safe.directory` configuration for git
- PATH must include Bun, fnm, and local bin directories
- Runner runs as a specific user — file ownership matters after `git reset --hard`
- If you see permission errors, file ownership change from root is likely the cause

### Post-Deploy Verification

```bash
curl -sf https://agents.benceboer.com/health
```

If the health check fails after deploy:
- Check `journalctl -u ralph-api -n 50` for server startup errors
- Common causes: syntax error, missing import, port conflict, missing env var

## Development Lifecycle

The project follows a natural iteration cycle:

```
Scaffold → Build Features → Deploy → Bug Fix → Stabilize → Harden → Polish
```

Key principles from this lifecycle:
- **Ship full vertical slices:** Backend + frontend + migration in one commit when they're related
- **First fix ≠ complete fix:** Plan for at least two passes on any bug
- **Stabilization phases are real work:** Feature development naturally accumulates technical debt;
  dedicated stabilization passes are necessary, not optional
- **Late linting is better than no linting, but early linting is best:** Set up enforcement in the
  scaffold, not after 40+ commits of drift
