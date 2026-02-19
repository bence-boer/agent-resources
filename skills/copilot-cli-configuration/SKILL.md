---
name: copilot-cli-configuration
description: Guide for configuring GitHub Copilot CLI with custom instructions, MCP servers, custom agents, and skills. Use this when asked to configure, customize, or set up Copilot CLI features.
---

# Configuring GitHub Copilot CLI

GitHub Copilot CLI can be customized in four main ways. Follow these guidelines when configuring Copilot CLI:

## 1. Custom Instructions

**Use for:** Simple instructions relevant to almost every task (e.g., coding standards, project preferences).

**Location:**
- Project-level: `.github/.copilot-instructions.md` in repository root
- Personal-level: `~/.copilot/.copilot-instructions.md` for all projects

**When to use:** For general guidelines that should apply to most tasks in a project.

## 2. Agent Skills

**Use for:** Detailed, specialized instructions that Copilot should access when relevant (e.g., debugging workflows, testing procedures).

**Location:**
- Project skills: `.github/skills/` or `.claude/skills/` (repository-specific)
- Personal skills: `~/.copilot/skills/` or `~/.claude/skills/` (shared across projects)

**Structure:**
```
~/.copilot/skills/skill-name/
  └── SKILL.md
  └── [optional scripts, examples, resources]
```

**SKILL.md format:**
```markdown
---
name: skill-name (lowercase, hyphens for spaces)
description: What the skill does and when to use it
license: [optional]
---

[Markdown instructions, examples, and guidelines]
```

**When to use:** For complex, multi-step procedures that should only activate when relevant to the task.

## 3. Model Context Protocol (MCP) Servers

**Use for:** Giving Copilot access to external data sources and tools.

**Configuration:** Add MCP servers to Copilot CLI configuration (typically `~/.copilot/config.json`).

**View configured servers:** Use `/mcp` slash command in interactive mode.

**Control access:** Use `--allow-tool 'SERVER_NAME'` or `--deny-tool 'SERVER_NAME(tool_name)'` options.

## 4. Custom Agents

**Use for:** Creating specialized versions of Copilot for specific roles (e.g., frontend expert, security auditor).

**When to use:** When you need Copilot to consistently act with a specific expertise or perspective.

## Security Best Practices

When configuring Copilot CLI:

1. **Trust directories carefully:** Only launch Copilot from directories you trust
2. **Review tool permissions:** Be cautious with `--allow-all-tools`
3. **Use specific allow/deny rules:** Prefer `--allow-tool 'shell(git)'` over blanket permissions
4. **Edit trusted folders:** Manage via `~/.copilot/config.json` → `trusted_folders` array
5. **Use restricted environments:** Consider VMs or containers for sensitive operations

## Command-Line Options for Tool Approval

- `--allow-all-tools`: Allow any tool without approval (use with caution)
- `--allow-tool 'shell(COMMAND)'`: Allow specific shell commands (e.g., `'shell(git)'`)
- `--allow-tool 'write'`: Allow file modifications without approval
- `--allow-tool 'MCP_SERVER'`: Allow all tools from an MCP server
- `--deny-tool 'TOOL'`: Block specific tools (takes precedence over allow options)

## Configuration File Locations

- **Config directory:** `~/.copilot/` (or `$XDG_CONFIG_HOME/.copilot/`)
- **Main config:** `~/.copilot/config.json`
- **Personal instructions:** `~/.copilot/.copilot-instructions.md`
- **Personal skills:** `~/.copilot/skills/`

## Slash Commands for Configuration

- `/model`: Change the AI model used by Copilot CLI
- `/mcp`: View and manage MCP servers
- `/feedback`: Submit feedback, bug reports, or feature requests

## Model Selection

Default model: Claude Sonnet 4.5 (1x premium request multiplier)
Change via: `/model` slash command in interactive mode

## Skills vs Custom Instructions Decision Guide

**Use Custom Instructions when:**
- Instructions apply to almost every task
- Content is simple and concise
- Examples: coding style, file organization, commit message format

**Use Skills when:**
- Instructions are complex or multi-step
- Only relevant to specific tasks
- Include scripts, examples, or external resources
- Examples: debugging workflows, testing procedures, deployment processes
