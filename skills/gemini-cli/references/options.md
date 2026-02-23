# Gemini CLI Options

Full list of command-line options for the `gemini` command.

| Option | Description |
|--------|-------------|
| `-d, --debug` | Run in debug mode (open debug console with F12). |
| `-m, --model <model>` | Specify the AI model to use. |
| `-p, --prompt <text>` | Run in non-interactive (headless) mode with the given prompt. |
| `-i, --prompt-interactive <text>` | Execute the provided prompt and continue in interactive mode. |
| `-s, --sandbox` | Run in sandbox mode. |
| `-y, --yolo` | Automatically accept all actions (YOLO mode). |
| `--approval-mode <mode>` | Set the approval mode: `default`, `auto_edit`, `yolo`, `plan`. |
| `--policy <files>` | Additional policy files or directories to load (comma-separated). |
| `--experimental-acp` | Starts the agent in ACP mode. |
| `--allowed-mcp-server-names <names>` | Allowed MCP server names (array). |
| `--allowed-tools <tools>` | [DEPRECATED] Tools allowed to run without confirmation. |
| `-e, --extensions <exts>` | A list of extensions to use. |
| `-l, --list-extensions` | List all available extensions and exit. |
| `-r, --resume <index\|latest>` | Resume a previous session. |
| `--list-sessions` | List available sessions for the current project and exit. |
| `--delete-session <index>` | Delete a session by index number. |
| `--include-directories <dirs>` | Additional directories to include in the workspace. |
| `--screen-reader` | Enable screen reader mode for accessibility. |
| `-o, --output-format <format>` | The format of the CLI output (`text`, `json`, `stream-json`). |
| `--raw-output` | Disable sanitization of model output (WARNING: Security risk). |
| `--accept-raw-output-risk` | Suppress the security warning when using `--raw-output`. |
| `-v, --version` | Show version number. |
| `-h, --help` | Show help. |
