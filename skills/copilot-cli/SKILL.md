---
name: copilot-cli
description: >
  GitHub Copilot CLI v0.0.414 - An AI-powered coding assistant for the terminal.
  Covers interactive sessions, non-interactive prompt execution (`-p`), model
  selection, session resume, slash commands, configuration, permissions (tool/path/URL
  granular control), environment variables, authentication (OAuth, token precedence),
  plugin management, and logging. Use when asking about copilot CLI commands, setting
  up copilot in terminal, configuring copilot permissions, troubleshooting copilot
  authentication, running copilot headless in CI, or understanding copilot flags and
  options. Do NOT use for Copilot SDK/API integration (use copilot-sdk), IDE/editor
  Copilot features, or GitHub Copilot for Business administration.
---

# Copilot CLI

## Key facts

- **Version:** 0.0.414
- **Binary:** `copilot` — two primary modes: interactive (default) and non-interactive (`-p`)
- **Config location:** `$XDG_CONFIG_HOME` or `~/.copilot/` — YAML config file, overridden by CLI flags, overridden by env vars
- **Auth model:** OAuth via `copilot login`, or token env vars (`COPILOT_GITHUB_TOKEN` > `GH_TOKEN` > `GITHUB_TOKEN`)
- **Permission model:** Granular tool/path/URL allow/deny; `--allow-all` (alias `--yolo`) enables everything — required for unattended/CI usage
- **Session persistence:** `--continue` resumes most recent session; `--resume [id]` resumes a specific one
- **Model selection:** `--model <name>` or `COPILOT_MODEL` env var or `/model` slash command — Claude, GPT, and Gemini families available
- **Auto-update:** Enabled by default, disabled automatically in CI environments (detected via `CI`, `BUILD_NUMBER`, `RUN_ID`)
- **Logging:** `~/.copilot/logs/` by default; configurable via `--log-dir` and `--log-level`

## Core flags

| Flag | Purpose |
|------|---------|
| `-p, --prompt <text>` | Non-interactive: execute prompt and exit |
| `-i, --interactive <prompt>` | Interactive: start session with initial prompt |
| `-s, --silent` | Suppress stats, output only agent response |
| `--model <model>` | Override default model |
| `--allow-all` / `--yolo` | Grant all permissions (tools, paths, URLs) |
| `--continue` | Resume most recent session |
| `--resume [sessionId]` | Resume specific session |
| `--available-tools [t...]` | Whitelist specific tools |
| `--excluded-tools [t...]` | Blacklist specific tools |
| `--log-dir <path>` | Custom log directory |
| `--log-level <level>` | none / error / warning / info / debug / all |

## Routing index

Route to the reference file that covers the user's topic. Load only what is needed.

| Topic | Reference | Covers |
|-------|-----------|--------|
| Slash commands, interactive mode features | [commands.md](references/commands.md) | `/init`, `/agent`, `/skills`, `/mcp`, `/model`, `/fleet`, `/tasks`, `/ide`, `/diff`, `/review`, `/lsp`, `/allow-all`, `/add-dir`, `/resume`, `/compact`, `/clear`, `/help`, etc. |
| Config file settings, defaults | [config.md](references/config.md) | `allowed_urls`, `alt_screen`, `auto_update`, `bash_env`, `banner`, `model`, `theme`, `trusted_folders`, `parallel_tool_execution`, `streamer_mode`, `compact_paste`, etc. |
| Environment variables | [environment.md](references/environment.md) | `COPILOT_ALLOW_ALL`, `COPILOT_MODEL`, `COPILOT_GITHUB_TOKEN`, `GH_TOKEN`, `GITHUB_TOKEN`, `COPILOT_EDITOR`, `XDG_CONFIG_HOME`, `COPILOT_CUSTOM_INSTRUCTIONS_DIRS`, CI detection vars |
| Log levels, log directory, debugging | [logging.md](references/logging.md) | Log levels (none through all), `--log-dir`, `--log-level`, default log path `~/.copilot/logs/` |
| Permissions: tools, paths, URLs | [permissions.md](references/permissions.md) | `--allow-tool`, `--deny-tool`, `--allow-all-tools`, shell/path/URL permission patterns (`shell(git:*)`, `read(src/*)`), tool filtering vs approval |
| Plugins: install, uninstall, marketplaces | [plugin.md](references/plugin.md) | `copilot plugin install`, `copilot plugin uninstall`, source formats (marketplace, owner/repo, URL), `--config-dir` |

## Caveats and common mistakes

1. **`-p` vs `-i` confusion.** `-p` runs non-interactively and exits after the prompt completes — no follow-up turns. `-i` starts an interactive session with an initial prompt. Using `-p` when you need multi-turn conversation silently loses context.
2. **`--allow-all` in production.** Grants unrestricted tool, path, and URL access. Safe for local dev; dangerous in shared CI runners. Use `--allow-tool` with specific patterns instead.
3. **Token precedence surprises.** `COPILOT_GITHUB_TOKEN` > `GH_TOKEN` > `GITHUB_TOKEN`. If multiple are set, only the highest-precedence one is used. A stale `COPILOT_GITHUB_TOKEN` will shadow a valid `GH_TOKEN`.
4. **Config override order.** Config file < CLI flags < env vars. Users often edit the config file but forget a conflicting env var is set, causing "my config change does nothing" confusion.
5. **Auto-update in CI.** Auto-update is disabled when CI env vars are detected. If CI builds suddenly use a new version, check whether someone pinned `COPILOT_AUTO_UPDATE=true` or removed CI detection vars.
6. **Session resume expects same directory.** `--continue` and `--resume` restore conversation state but tool permissions and working directory depend on where you launch from. Resuming in a different directory can cause file-not-found errors.
7. **Plugin source format.** `copilot plugin install` accepts `plugin@marketplace`, `owner/repo`, `owner/repo:path`, or a URL — not a local path. Local plugins need a different approach via config.

## Questions this skill answers

- "How do I use Copilot CLI?"
- "Run a prompt without interactive mode"
- "What models are available in Copilot?"
- "How do I configure Copilot CLI settings?"
- "Resume my previous copilot session"
- "What environment variables does Copilot use?"
- "How do permissions work in Copilot?"
- "Set up Copilot plugins"
- "What CLI options and flags does Copilot support?"
- "How do I authenticate with GitHub Copilot?"
- "How do I run copilot in CI/CD pipelines?"
- "What slash commands are available in interactive mode?"
- "Why is my copilot config not taking effect?"
- "How do I restrict which tools copilot can use?"
- "copilot help config / commands / permissions"
