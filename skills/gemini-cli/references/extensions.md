# Extension Management

Manage Gemini CLI extensions to extend the capabilities of the agent.

## Commands

| Command | Description |
|---------|-------------|
| `gemini extensions install <source>` | Install an extension from a git URL or local path. |
| `gemini extensions uninstall <names..>` | Uninstall one or more extensions. |
| `gemini extensions list` | List all installed extensions. |
| `gemini extensions update [<name>]` | Update all or a specific extension to the latest version. |
| `gemini extensions disable <name>` | Disable an extension. |
| `gemini extensions enable <name>` | Enable a disabled extension. |
| `gemini extensions link <path>` | Link an extension from a local path for development. |
| `gemini extensions new <path> [template]` | Create a new extension from a boilerplate. |
| `gemini extensions validate <path>` | Validate an extension in a local path. |
| `gemini extensions config [name] [setting]` | Configure extension settings. |

## Subcommand: install

**Usage**: `gemini extensions install <source> [--auto-update] [--pre-release]`

- `--ref <ref>`: Git ref to install from.
- `--auto-update`: Enable auto-update.
- `--pre-release`: Enable pre-release versions.
- `--consent`: Skip confirmation prompt.

## Subcommand: new

**Templates**:
- `custom-commands`
- `exclude-tools`
- `hooks`
- `mcp-server`
- `skills`
- `themes-example`

## Subcommand: config

**Usage**: `gemini extensions config [name] [setting] [--scope <user|workspace>]`

- `--scope`: Set the scope (user or workspace, default: user).

## Options

- `-d, --debug`: Run in debug mode.
- `-h, --help`: Show help.
