# MCP Servers (Model Context Protocol)

Gemini CLI uses the Model Context Protocol (MCP) to connect to external tools and data sources.

## Overview
MCP servers are local or remote services that expose:
- **Tools:** Executable functions (e.g., database queries, API calls).
- **Resources:** Data sources (e.g., logs, file contents).
- **Prompts:** Reusable templates.

## Configuration
Configure MCP servers in `~/.gemini/settings.json` under `mcpServers`.

**Example:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
    },
    "git": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "mcp/git"]
    }
  }
}
```

## Usage
- **List Servers:** `/mcp list`
- **Refresh:** `/mcp refresh` (Reloads configuration)
- **Tools:** Tools exposed by MCP servers appear automatically in the CLI's tool list and can be selected by the model.

## Troubleshooting
- Ensure the server command is executable.
- Check stdio connection (MCP uses stdin/stdout).
- Verify environment variables if required by the server.
