---
name: gemini-cli
description: "Gemini CLI - An AI-powered autonomous agent for software engineering. Use when working with the gemini command-line tool for: (1) Interactive coding sessions, (2) Executing prompts in non-interactive (headless) mode, (3) Managing MCP servers, extensions, and skills, (4) Resuming previous sessions, and (5) Understanding CLI options, commands, and interactive mode features."
---

# Gemini CLI

Gemini CLI is an autonomous agent for software engineering that defaults to interactive mode.

## Quick Start

```bash
# Start interactive mode
gemini

# Start with an initial prompt
gemini "Refactor the authentication logic"

# Execute a prompt in non-interactive mode (headless)
gemini -p "Fix the typo in index.js"

# Start with a specific model
gemini --model gemini-2.0-flash

# Enable YOLO mode (auto-approve all actions)
gemini --yolo -p "Update all dependencies"
```

## Core Options

| Flag | Description |
|------|-------------|
| `-p, --prompt <text>` | Run in non-interactive mode with the given prompt. |
| `-i, --prompt-interactive <text>` | Run prompt and continue in interactive mode. |
| `-m, --model <model>` | Specify the AI model to use. |
| `-y, --yolo` | Automatically accept all actions. |
| `--approval-mode <mode>` | Set mode: `default`, `auto_edit`, `yolo`, `plan`. |
| `-r, --resume <index\|latest>` | Resume a previous session. |
| `-d, --debug` | Run in debug mode. |
| `-h, --help` | Show help for the command. |

## Sub-commands

| Command | Description |
|---------|-------------|
| `mcp` | Manage Model Context Protocol (MCP) servers. |
| `extensions` | Manage Gemini CLI extensions. |
| `skills` | Manage agent skills. |
| `hooks` | Manage Gemini CLI hooks. |

## Detailed Documentation

Access detailed documentation for specific areas:

| Topic | Reference |
|-------|-----------|
| **Interactive Mode** | [interactive.md](references/interactive.md) |
| **All Options** | [options.md](references/options.md) |
| **MCP Servers** | [mcp.md](references/mcp.md) |
| **Extensions** | [extensions.md](references/extensions.md) |
| **Agent Skills** | [skills.md](references/skills.md) |
| **Hooks** | [hooks.md](references/hooks.md) |

For full command details and options, consult the reference files above.
