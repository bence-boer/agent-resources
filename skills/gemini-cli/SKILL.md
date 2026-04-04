---
name: gemini-cli
description: "Gemini CLI reference covering interactive sessions, headless mode (-p), session resumption (-r), MCP server integration, extensions management, agent skills, hooks, approval modes (default/auto_edit/yolo/plan), and CLI options. Use when working with gemini in the terminal, running gemini commands, configuring gemini extensions, resuming gemini sessions, setting up MCP servers for gemini, or understanding gemini interactive commands like /reset, /skills, and /mcp. Do NOT use for Gemini API/SDK integration, Google AI Studio, or Gemini web interface."
---

# Gemini CLI

## Key facts

- **Binary**: `gemini` — autonomous coding agent, defaults to interactive mode when run without flags
- **Headless mode**: `-p <prompt>` runs non-interactively, exits after completion — use for scripting and CI
- **Hybrid mode**: `-i <prompt>` executes a prompt then stays in interactive mode
- **Session resumption**: `-r <index|latest>` resumes a previous session; `--list-sessions` shows available sessions; `--delete-session <index>` removes one
- **Approval modes**: `--approval-mode` accepts `default` (confirm destructive actions), `auto_edit` (auto-approve file edits), `yolo` (auto-approve everything), `plan` (read-only, no tool execution). `-y` is shorthand for `--yolo`
- **Model selection**: `-m <model>` overrides the default model (e.g., `gemini-2.0-flash`)
- **Sub-commands**: `mcp`, `extensions`, `skills`, `hooks` — each has its own command tree
- **Interactive commands**: `/help`, `/reset`, `/quit`, `/skills list`, `/skills reload`, `/mcp list`, `/mcp enable <name>`, `/mcp disable <name>`, `/bug`
- **Output formats**: `--output-format` supports `text`, `json`, `stream-json` for programmatic consumption

## Routing index

Map user intent to the correct reference file. Consult the reference before answering — do not guess from memory.

| User intent | Reference file | Key content |
|---|---|---|
| Interactive session commands (`/help`, `/reset`, `/quit`, `/skills`, `/mcp`) | [references/interactive.md](references/interactive.md) | Slash commands, sub-agents, project awareness, tool integration |
| CLI flags, options, output format, sandbox, debug mode | [references/options.md](references/options.md) | Full flag table including `--policy`, `--sandbox`, `--screen-reader`, `--raw-output`, `--include-directories` |
| Adding, removing, enabling, disabling MCP servers | [references/mcp.md](references/mcp.md) | `gemini mcp add/remove/list/enable/disable` commands and options |
| Installing, updating, creating, validating extensions | [references/extensions.md](references/extensions.md) | `gemini extensions install/uninstall/list/update/disable/enable/link/new/validate/config` with flags like `--auto-update`, `--pre-release`, `--ref` |
| Installing, linking, enabling, disabling agent skills | [references/skills.md](references/skills.md) | `gemini skills list/enable/disable/install/link/uninstall` with `--scope` and `--all` flags |
| Hooks, lifecycle customization, migrating from Claude Code | [references/hooks.md](references/hooks.md) | `gemini hooks migrate` — hooks customize agent behavior at lifecycle points |

**Routing rules:**
1. If the question is about what happens inside a running session → [references/interactive.md](references/interactive.md)
2. If the question is about CLI invocation flags → [references/options.md](references/options.md)
3. If the question names a sub-command (`mcp`, `extensions`, `skills`, `hooks`) → route to the matching reference file
4. If the question is about scripting/CI/automation → combine [references/options.md](references/options.md) (headless flags) with the relevant sub-command reference

## Caveats

- **`-p` vs `-i` confusion**: `-p` exits after completion (headless); `-i` stays in interactive mode. Users often use `-p` when they want `-i`. If the user wants to give an initial prompt but keep chatting, recommend `-i`.
- **`--yolo` in production**: `--yolo` auto-approves all tool actions including shell commands and file writes. Never recommend for untrusted prompts or CI without sandboxing. Suggest `--approval-mode auto_edit` as a safer alternative that only auto-approves file edits.
- **`--approval-mode plan`**: Read-only mode — the agent cannot execute any tools. Useful for exploring what the agent would do without side effects, but users may not realize no changes will be made.
- **Session resumption scope**: `-r` only lists sessions for the current project directory. Users in a different directory won't see previous sessions.
- **`--raw-output` security risk**: Disables output sanitization. Must pair with `--accept-raw-output-risk` to suppress the warning. Do not recommend unless the user explicitly needs unsanitized model output.
- **Hooks are minimal**: `gemini hooks` currently only supports `migrate` (from Claude Code). Users expecting full lifecycle hook authoring should check the extensions system instead.
- **`--allowed-tools` is deprecated**: Appears in `--help` but is deprecated. Guide users to `--approval-mode` instead.

## Questions this skill answers

- "How do I use Gemini CLI?"
- "Run a prompt in headless mode"
- "What's the difference between -p and -i?"
- "Set up MCP servers for Gemini"
- "Resume a previous Gemini session"
- "What options does Gemini CLI have?"
- "Install or manage Gemini extensions"
- "Configure Gemini agent skills"
- "How do hooks work in Gemini?"
- "What commands are available in Gemini interactive mode?"
- "How do I run Gemini non-interactively in CI?"
- "What approval modes are available?"
- "How do I auto-approve actions in Gemini?"
- "List my Gemini sessions"
- "How do I use Gemini with a specific model?"
