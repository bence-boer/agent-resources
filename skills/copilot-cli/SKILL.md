---
name: copilot-cli
description: "GitHub Copilot CLI v0.0.414 - An AI-powered coding assistant. Use when working with the copilot command-line tool for: (1) Interactive coding sessions, (2) Executing prompts in non-interactive mode, (3) Managing CLI configuration permissions and plugins, (4) Authentication with GitHub, (5) Understanding CLI options commands and environment variables."
---

# Copilot CLI

GitHub Copilot CLI v0.0.414 is an AI-powered coding assistant that works in your terminal.

## Quick Start

```bash
# Start interactive mode
copilot

# Execute a prompt in non-interactive mode
copilot -p "Fix the bug in main.js"

# Start with a specific model
copilot --model claude-sonnet-4.6

# Enable all permissions (for scripting)
copilot -p "Fix the bug" --allow-all
```

## Core Options

| Flag | Description |
|------|-------------|
| `-p, --prompt <text>` | Execute prompt in non-interactive mode |
| `-i, --interactive <prompt>` | Start interactive mode and execute prompt |
| `-s, --silent` | Output only agent response (no stats) |
| `--model <model>` | Set AI model to use |
| `--allow-all` | Enable all permissions (tools, paths, URLs) |
| `--yolo` | Same as --allow-all |
| `-v, --version` | Show version information |
| `--continue` | Resume the most recent session |
| `--resume [sessionId]` | Resume from a previous session |
| `-h, --help` | Display help for command |

## Available Models

- claude-sonnet-4.6, claude-sonnet-4.5, claude-sonnet-4
- claude-opus-4.6, claude-opus-4.6-fast, claude-opus-4.5
- claude-haiku-4.5
- gemini-3-pro-preview
- gpt-5.3-codex, gpt-5.2-codex, gpt-5.2, gpt-5.1-codex-max, gpt-5.1-codex, gpt-5.1, gpt-5.1-codex-mini, gpt-5-mini
- gpt-4.1

## Commands

| Command | Description |
|---------|-------------|
| `copilot` | Start interactive mode |
| `copilot -p <prompt>` | Execute prompt non-interactively |
| `copilot login` | Authenticate via OAuth |
| `copilot init` | Initialize Copilot instructions for repository |
| `copilot update` | Download latest version |
| `copilot version` | Display version info |
| `copilot plugin` | Manage plugins and marketplaces |

## Help Topics

Access detailed documentation with `copilot help <topic>`:

| Topic | Description |
|-------|-------------|
| `copilot help config` | Configuration Settings |
| `copilot help commands` | Interactive Mode Commands |
| `copilot help environment` | Environment Variables |
| `copilot help logging` | Logging |
| `copilot help permissions` | Permissions |

For full details, see the reference files:
- [commands.md](references/commands.md) - Interactive Mode Commands
- [config.md](references/config.md) - Configuration Settings
- [environment.md](references/environment.md) - Environment Variables
- [logging.md](references/logging.md) - Logging
- [permissions.md](references/permissions.md) - Permissions
- [plugin.md](references/plugin.md) - Plugin Management
