# MCP Server Management

Manage Model Context Protocol (MCP) servers within Gemini CLI.

## Commands

| Command | Description |
|---------|-------------|
| `gemini mcp add <name> <commandOrUrl> [args...]` | Add a new MCP server. |
| `gemini mcp remove <name>` | Remove an MCP server. |
| `gemini mcp list` | List all configured MCP servers. |
| `gemini mcp enable <name>` | Enable a previously disabled MCP server. |
| `gemini mcp disable <name>` | Disable an MCP server without removing it. |

## Options

- `-d, --debug`: Run in debug mode (open debug console with F12).
- `-h, --help`: Show help for the `mcp` command.
