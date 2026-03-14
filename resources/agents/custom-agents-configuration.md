# Custom agents configuration

Reference for configuring custom agents.

## YAML frontmatter properties

The following table outlines common properties that can be configured for agent profiles. Environment-specific behavior, when relevant, is noted in the description. If the same agent is defined at multiple levels, the most specific definition usually takes precedence.

| Property                   | Type                                                     | Purpose                                                                                                                                                           |
| -------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                     | string                                                   | Display name for the custom agent. Optional.                                                                                                                      |
| `description`              | **Required** string                                      | Description of the custom agent's purpose and capabilities.                                                                                                       |
| `target`                   | string                                                   | Target environment or context for the custom agent. Supported values depend on the host runtime. If unset, the runtime default applies.                         |
| `tools`                    | list of strings, string                                  | List of tool names the custom agent can use. Supports both a comma-separated string and a YAML string array. If unset, the runtime may expose all available tools. |
| `model`                    | string                                                   | Model to use when the custom agent executes. If unset, the runtime default is used.                                                                              |
| `disable-model-invocation` | boolean                                                  | Disables automatic selection of this custom agent based on task context. When `true`, the agent must be selected manually. If both `disable-model-invocation` and `infer` are set, `disable-model-invocation` takes precedence. |
| `user-invocable`           | boolean                                                  | Controls whether a user can manually select this custom agent. When `false`, the agent is available only through supported programmatic flows. If unset, defaults to `true`. |
| `infer`                    | boolean                                                  | **Retired**. Use `disable-model-invocation` and `user-invocable` instead.                                                                                        |
| `mcp-servers`              | object                                                   | Additional MCP servers and tools that should be available to the custom agent. Support varies by runtime.                                                        |
| `metadata`                 | object consisting of a name and value pair, both strings | Optional annotations with useful data. Support varies by runtime.                                                                                                 |

Define the agent's behavior, expertise, and instructions in the Markdown content below the YAML frontmatter. The prompt can be a maximum of 30,000 characters.

> [!NOTE]
> Some runtimes support additional properties such as `argument-hint` or `handoffs`. Other runtimes ignore unsupported properties for compatibility.

## Tools

The custom agent `tools` property controls which tools are available to your agent, including those provided by MCP servers.

You can configure `tools` using the following approaches:

* **Enable all available tools**: Omit the `tools` property entirely or use `tools: ["*"]`.
* **Enable specific tools**: Provide a list of specific tool names or aliases, for example `tools: ["read", "edit", "search"]`.
  * Server-specific tools can be namespaced as `server-name/tool-name`.
  * You can enable all tools from a specific server using `server-name/*`.
* **Disable all tools**: Use an empty list, `tools: []`.

All unrecognized tool names are ignored, which lets the same agent profile degrade gracefully across runtimes with different tool sets.

### Tool aliases

The following tool aliases are commonly available for custom agents. Aliases are typically case-insensitive:

| Primary alias | Compatible aliases                           | Generic mapping         | Purpose                                                           |
| ------------- | -------------------------------------------- | ----------------------- | ----------------------------------------------------------------- |
| `execute`     | `shell`, `Bash`, `powershell`                | Shell execution tools   | Execute a command in the appropriate shell for the operating system. |
| `read`        | `Read`, `NotebookRead`                       | File read tools         | Read file contents.                                               |
| `edit`        | `Edit`, `MultiEdit`, `Write`, `NotebookEdit` | File edit tools         | Modify files.                                                     |
| `search`      | `Grep`, `Glob`                               | Search tools            | Search for files or text in files.                                |
| `agent`       | `custom-agent`, `Task`                       | Delegation tools        | Invoke another custom agent to accomplish a task.                 |
| `web`         | `WebSearch`, `WebFetch`                      | Web tools               | Fetch content from URLs or perform web search when supported.     |
| `todo`        | `TodoWrite`                                  | Task-list tools         | Create and manage structured task lists when supported.           |

### Runtime-specific tool namespaces

Some runtimes expose server or extension tools through namespaces such as `server-name/tool-name` or `extension-name/tool-name`. Availability, permissions, and naming conventions depend on the host environment.

## MCP server configuration details

The following sample agent profile shows an agent with an MCP server configured. Only one tool from the MCP server has been enabled in the `tools` property in the YAML frontmatter:

```text
---
name: my-custom-agent-with-mcp
description: Custom agent description
tools: ['tool-a', 'tool-b', 'custom-mcp/tool-1']
mcp-servers:
  custom-mcp:
    type: local
    command: some-command
    args: ['--arg1', '--arg2']
    tools: ['*']
    env:
      ENV_VAR_NAME: ${AGENT_MCP_ENV_VAR_VALUE}
---

Prompt with suggestions for behavior and output
```

The `mcp-servers` property in an agent profile is a YAML representation of a common JSON-style MCP configuration format. Most sub-properties are the same as their JSON counterparts, although host runtimes may rename or map some values for compatibility.

### MCP server type

For compatibility, some runtimes map `stdio` style configurations to a `local` type.

### MCP server environment variables and secrets

If your MCP server requires secrets or environment variables, configure them in the environment used by the host runtime.

Common substitution patterns can include:

* `$AGENT_MCP_ENV_VAR_VALUE`
* `${AGENT_MCP_ENV_VAR_VALUE}`
* `${AGENT_MCP_ENV_VAR_VALUE:-default}`
* `${{ secrets.AGENT_MCP_ENV_VAR_VALUE }}`
* `${{ vars.AGENT_MCP_ENV_VAR_VALUE }}`

## Example agent profile configurations

The following examples demonstrate what an agent profile could look like for common tasks such as writing tests or planning an implementation.

### Testing specialist

This example enables all tools by omitting the `tools` property.

```text copy
---
name: test-specialist
description: Focuses on test coverage, quality, and testing best practices without modifying production code
---

You are a testing specialist focused on improving code quality through comprehensive testing. Your responsibilities:

- Analyze existing tests and identify coverage gaps
- Write unit tests, integration tests, and end-to-end tests following best practices
- Review test quality and suggest improvements for maintainability
- Ensure tests are isolated, deterministic, and well-documented
- Focus only on test files and avoid modifying production code unless specifically requested

Always include clear test descriptions and use appropriate testing patterns for the language and framework.
```

### Implementation planner

This example only enables a subset of tools.

```text copy
---
name: implementation-planner
description: Creates detailed implementation plans and technical specifications in markdown format
tools: ["read", "search", "edit"]
---

You are a technical planning specialist focused on creating comprehensive implementation plans. Your responsibilities:

- Analyze requirements and break them down into actionable tasks
- Create detailed technical specifications and architecture documentation
- Generate implementation plans with clear steps, dependencies, and milestones
- Document API designs, data models, and system interactions
- Create markdown files with structured plans that teams can follow

Always structure your plans with clear headings, task breakdowns, and acceptance criteria. Include considerations for testing, deployment, and potential risks. Focus on creating thorough documentation rather than implementing code.
```

## Processing of custom agents

### Custom agent names

When naming conflicts occur, the most specific configuration usually overrides broader shared configuration.

### Versioning

Versioning depends on how your runtime tracks agent profile files. Common approaches rely on file revisions, commits, or tagged releases. When stability matters, treat the profile as versioned configuration and test changes before broad rollout.

### Tools processing

The `tools` list filters the set of tools made available to the agent, whether built-in or sourced from MCP servers. When you configure tools in your agent profile:

* If no tools are specified, the runtime may enable all available tools.
* An empty tools list (`tools: []`) disables all tools.
* A specific list (`tools: [...]`) enables only those tools.

### MCP server configurations

When multiple layers can define MCP servers, a common processing order is: broader defaults first, then agent-profile configuration, then the most specific workspace or runtime overrides.
