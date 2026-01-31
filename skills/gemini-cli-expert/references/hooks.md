# Hooks

Hooks intercept and customize Gemini CLI behavior at key lifecycle points. They run synchronously.

## Capabilities
- **Add Context:** Inject git history, env vars, etc.
- **Validate:** Review tool args, block dangerous actions.
- **Enforce Policies:** Security scanners, compliance checks.
- **Log:** Audit trails.

## Lifecycle Events
- `SessionStart`, `SessionEnd`
- `BeforeAgent`, `AfterAgent`
- `BeforeModel`, `AfterModel`
- `BeforeToolSelection`
- `BeforeTool`, `AfterTool`
- `PreCompress`
- `Notification`

## Implementation
- **Input:** JSON via Stdin.
- **Output:** JSON via Stdout (final object only).
- **Debug:** Stderr.
- **Exit Codes:**
  - `0`: Success.
  - `2`: Critical block (stops execution).
  - Other: Warnings.

## Configuration
Configure in `settings.json` using Matchers (Regex for tool events, exact strings for lifecycle).
