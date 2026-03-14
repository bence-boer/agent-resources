---
name: agent-creator
description: >
  Production-ready custom agent creation guide covering agent profile format, YAML frontmatter
  configuration, tool selection and aliasing, MCP server setup, and prompt design for agent
  instructions. Use when creating, configuring, reviewing, or improving custom agents
  (.agent.md profiles), setting up agent tools or MCP servers, writing agent system prompts,
  scoping agent responsibilities, or designing multi-agent architectures. Trigger for any
  custom agent task even when informal ("make me an agent", "set up a coding assistant",
  "I need a helper for X", "configure my agent's tools").
---

# Agent Creator

Create custom agents as Markdown profile files. Each profile defines a focused, reusable teammate with consistent expertise through YAML configuration and behavioral instructions.

## Agent profile format

A profile is a `.agent.md` file with YAML frontmatter (configuration) and a Markdown body (behavioral prompt).

```text
---
name: my-agent
description: What this agent does and when to use it
tools: ['read', 'edit', 'search', 'execute']
---

You are a [role] specialized in [domain].

[Behavioral instructions]
```

Keep file names stable so users can reliably select the right agent. When teams share agents, keep descriptions precise and prompts narrowly scoped so each agent has a clear responsibility.

## YAML frontmatter

| Property | Type | Required | Purpose |
|----------|------|----------|---------|
| `name` | string | No | Display name |
| `description` | string | **Yes** | Agent purpose and capabilities — primary discovery and selection mechanism |
| `tools` | list or string | No | Available tools. Supports both YAML arrays and comma-separated strings. Omit for all tools |
| `model` | string | No | Model override. Omit for runtime default |
| `target` | string | No | Target environment or context. Supported values depend on the host runtime; if unset, the runtime default applies |
| `disable-model-invocation` | boolean | No | `true` prevents automatic task-based selection — agent must be picked manually |
| `user-invocable` | boolean | No | `false` restricts the agent to programmatic flows only. Default: `true` |
| `infer` | boolean | No | **Retired.** Use `disable-model-invocation` and `user-invocable` instead. If both `disable-model-invocation` and `infer` are set, `disable-model-invocation` takes precedence |
| `mcp-servers` | object | No | Additional MCP servers to expose to the agent |
| `metadata` | object | No | Key-value annotations (runtime-dependent) |

The Markdown body below the frontmatter is the agent's prompt. Maximum 30,000 characters.

Some runtimes support additional properties (`argument-hint`, `handoffs`). Unsupported properties are ignored for compatibility.

## Tool configuration

### Access levels

```yaml
# All tools (default when omitted)
tools: ["*"]

# Specific tools only
tools: ["read", "search", "edit"]

# No tools
tools: []

# Mix built-in and server-specific tools
tools: ["read", "my-server/analyze"]

# All tools from one server
tools: ["my-server/*"]
```

Unrecognized tool names are silently ignored — profiles degrade gracefully across runtimes.

### Tool aliases

Case-insensitive aliases that map across runtimes:

| Alias | Also matches | Purpose |
|-------|-------------|---------|
| `execute` | `shell`, `Bash`, `powershell` | Run shell commands |
| `read` | `Read`, `NotebookRead` | Read file contents |
| `edit` | `Edit`, `MultiEdit`, `Write`, `NotebookEdit` | Modify files |
| `search` | `Grep`, `Glob` | Search files and text |
| `agent` | `custom-agent`, `Task` | Delegate to another agent |
| `web` | `WebSearch`, `WebFetch` | Fetch URLs or web search |
| `todo` | `TodoWrite` | Manage task lists |

Some runtimes expose tools through namespaces (`server-name/tool-name`). Prefer standard aliases for portability.

### Tool selection strategy

Match tools to the agent's responsibility. Restricting tools enforces scope — a planning agent with `edit` access will be tempted to implement; a review agent with `execute` will run tests instead of analyzing code.

| Agent role | Tools | Rationale |
|------------|-------|-----------|
| Planner, reviewer, auditor | `read`, `search` | Prevents acting when the job is to analyze |
| Fixer, generator, refactorer | `read`, `search`, `edit` | Can modify files, cannot execute arbitrary commands |
| Full teammate | Omit (all) | Broad capability, behavior shaped by prompt |
| Advisor, responder | `[]` (none) | Pure reasoning, no side effects |

## MCP server configuration

```yaml
---
name: my-agent
description: Agent with external tool access
tools: ['read', 'edit', 'custom-mcp/tool-1']
mcp-servers:
  custom-mcp:
    type: local
    command: some-command
    args: ['--arg1', '--arg2']
    tools: ['*']
    env:
      API_KEY: ${MY_API_KEY}
---
```

**Environment variable substitution** (patterns vary by runtime):
- `$VAR` / `${VAR}` / `${VAR:-default}`
- `${{ secrets.VAR }}` / `${{ vars.VAR }}`

Store secrets in the host runtime's environment, not in agent profiles.

**Type mapping**: Some runtimes map `stdio` to `local` type.

**Processing order** when multiple layers define MCP servers: broader defaults → agent profile → workspace/runtime overrides.

## Writing the agent prompt

The Markdown body defines behavior, expertise, scope, and working patterns.

### Prompt structure

```text
You are a [role] focused on [domain]. Your responsibilities:

[Core capabilities — what this agent does]

[Working approach — methodology, prioritization, decision-making]

[Scope boundaries — what this agent does NOT do]

[Guidelines — operational rules across all tasks]
```

### Prompt design principles

**Scope narrowly.** One clear responsibility per agent. Define both what the agent does and what it explicitly does not do. An agent scoped to "help with everything" delivers nothing consistently.

**Explain intent over mandating behavior.** Rather than rigid MUST/NEVER rules, explain why a pattern matters. A model that understands reasoning adapts to novel situations; one following brittle rules breaks on edge cases. Reserve imperative directives for hard boundaries like security and destructive actions.

**Handle multiple entry points.** Agents receive diverse requests. Use conditional blocks for the main pathways:

```text
**When a specific target is provided:**
- Focus only on the specified file or directory
- Do not expand scope beyond what was asked

**When no target is provided:**
- Scan the codebase for relevant opportunities
- Prioritize by impact and surface the top findings
```

**State limitations explicitly.** Agents work better when they know their boundaries:

```text
**Important limitations:**
- Do not modify source code outside your domain
- Do not run destructive commands without confirmation
- Ask for clarification if a task requires out-of-scope changes
```

**Include operational guidelines.** Short, actionable rules that shape behavior across all tasks:

```text
**Guidelines:**
- Stay focused on the task at hand; avoid unrelated changes
- Keep changes minimal and testable
- Explain reasoning as you work
- Check how changes affect adjacent systems before committing
```

**Embed output structure when the agent produces structured deliverables.** If the agent creates plans, reports, or documentation, include the template directly in the prompt so output format is consistent across invocations.

### Writing the description

The `description` field drives agent discovery and selection. It answers: "What does this agent do, and when should someone pick it?"

- Lead with the core capability in concrete terms
- Include the specific task types it handles
- Be specific enough to differentiate from similar agents

When naming conflicts exist between agents, the most specific definition takes precedence.

## Agent patterns

### Specialist

Deep focus on one domain. Restricted tools enforce the scope boundary.

```yaml
---
name: test-specialist
description: Writes and improves tests for code quality and coverage without modifying production code
tools: ['read', 'search', 'edit']
---
```

Prompt shape: role → responsibilities → methodology → file scope → limitations

### Planner

Creates plans and specifications without implementing. Tool restrictions prevent scope creep into implementation.

```yaml
---
name: implementation-planner
description: Creates detailed implementation plans and technical specifications in markdown
tools: ['read', 'search', 'edit']
---
```

Prompt shape: role → responsibilities → output structure template → scope calibration

### Teammate

Broad capability with a specific working style. Full tool access, behavior shaped entirely by prompt.

```yaml
---
name: bug-fix-teammate
description: Identifies critical bugs and implements targeted fixes with working code
---
```

Prompt shape: role → triage logic → implementation approach → guidelines → knowledge sharing

### Programmatic-only agent

Not user-selectable — available only through automation or other agents.

```yaml
---
name: ci-reviewer
description: Automated code review agent for CI pipelines
user-invocable: false
disable-model-invocation: true
tools: ['read', 'search']
---
```

## Cross-runtime compatibility

- Different runtimes expose different tools and may ignore unsupported properties.
- Test agent profiles in the target environment, especially when relying on tool restrictions or MCP configuration.
- Prefer tool aliases over runtime-specific tool names for portability.
- When versioning matters, treat profiles as configuration and test changes before broad rollout.

## Preflight checklist

Before finalizing an agent profile:

- `description` clearly conveys purpose and differentiates from similar agents
- `tools` match the agent's responsibility scope — no more, no less
- Prompt defines what the agent does AND what it does not do
- Conditional blocks handle the agent's main entry points
- Guidelines section covers operational behavior across all tasks
- Limitations are stated explicitly
- Profile degrades gracefully across runtimes (no hard dependency on runtime-specific features)
- MCP server secrets use environment variable substitution, not hardcoded values
