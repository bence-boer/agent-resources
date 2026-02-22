# Environment Variables

Environment variables for configuring GitHub Copilot CLI.

| Variable | Description |
|----------|-------------|
| `COLORFGBG` | Fallback to detect dark/light backgrounds; form is "fg;bg" where each field is 0-15 (ANSI colors) |
| `COPILOT_ALLOW_ALL` | Set to "true" to allow all tools without confirmation |
| `COPILOT_AUTO_UPDATE` | Set to "false" to disable auto-update; auto-enabled by default except in CI |
| `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` | Comma-separated list of additional directories for custom instructions |
| `COPILOT_EDITOR`, `VISUAL`, `EDITOR` | Command for interactive file editing (in precedence order) |
| `COPILOT_MODEL` | Set default agent model (overridden by --model or /model) |
| `COPILOT_GITHUB_TOKEN`, `GH_TOKEN`, `GITHUB_TOKEN` | Authentication token (in precedence order) |
| `USE_BUILTIN_RIPGREP` | Set to "false" to use ripgrep from PATH instead of bundled |
| `PLAIN_DIFF` | Set to "true" to disable rich diff rendering |
| `XDG_CONFIG_HOME` | Override config directory (default: $HOME/.copilot) |
| `XDG_STATE_HOME` | Override state directory (default: $HOME/.copilot) |

## CI Detection

Auto-update is disabled by default in CI environments, detected via:
- `CI`
- `BUILD_NUMBER`
- `RUN_ID`
- `SYSTEM_COLLECTIONURI`
