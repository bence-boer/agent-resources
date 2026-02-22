# Interactive Mode Commands

Agent environment:
- `/init` - Initialize Copilot instructions for this repository, or suppress the init suggestion
- `/agent` - Browse and select from available agents (if any)
- `/skills` - Manage skills for enhanced capabilities
- `/mcp` - Manage MCP server configuration
- `/plugin` - Manage plugins and plugin marketplaces

Models and subagents:
- `/model` - Select AI model to use
- `/fleet` - Enable fleet mode for parallel subagent execution
- `/tasks` - View and manage background tasks (subagents and shell sessions)

Code:
- `/ide` - Connect to an IDE workspace
- `/diff` - Review the changes made in the current directory
- `/review` - Run code review agent to analyze changes
- `/lsp` - Manage language server configuration
- `/terminal-setup` - Configure terminal for multiline input support (shift+enter and ctrl+enter)

Permissions:
- `/allow-all` - Enable all permissions (tools, paths, and URLs)
- `/add-dir` - Add a directory to the allowed list for file access
- `/list-dirs` - Display all allowed directories for file access
- `/cwd` - Change working directory or show current directory
- `/reset-allowed-tools` - Reset the list of allowed tools

Session:
- `/resume` - Switch to a different session (optionally specify session ID)
- `/rename` - Rename the current session (alias for /session rename)
- `/context` - Show context window token usage and visualization
- `/usage` - Display session usage metrics and statistics
- `/session` - Show session info and workspace summary. Use subcommands for details.
- `/compact` - Summarize conversation history to reduce context window usage
- `/share` - Share session to markdown file or GitHub gist

Help and feedback:
- `/help` - Show help for interactive commands
- `/changelog` - Display changelog for CLI versions
- `/feedback` - Provide feedback about the CLI
- `/theme` - View or configure terminal theme
- `/update` - Update the CLI to the latest version
- `/experimental` - Show available experimental features, or enable/disable experimental mode
- `/clear` - Clear the conversation history
- `/instructions` - View and toggle custom instruction files
- `/streamer-mode` - Toggle streamer mode (hides preview model names and quota details for streaming)

Other commands:
- `/exit, /quit` - Exit the CLI
- `/login` - Log in to Copilot
- `/logout` - Log out of Copilot
- `/plan` - Create an implementation plan before coding
- `/user` - Manage GitHub user list
