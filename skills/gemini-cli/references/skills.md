# Agent Skills Management

Manage agent skills to extend the capabilities of the Gemini CLI agent.

## Commands

| Command | Description |
|---------|-------------|
| `gemini skills list [--all]` | List discovered agent skills. |
| `gemini skills enable <name>` | Enable an agent skill. |
| `gemini skills disable <name>` | Disable an agent skill. |
| `gemini skills install <source>` | Install an agent skill from a git URL or local path. |
| `gemini skills link <path>` | Link an agent skill from a local path. |
| `gemini skills uninstall <name>` | Uninstall an agent skill. |

## Options

- `--scope <user|workspace>`: Specify the scope for installation/uninstallation.
- `--path <path>`: Specify the path for installation.
- `--all`: List all skills, including built-in and disabled ones.
- `-d, --debug`: Run in debug mode.
- `-h, --help`: Show help.
