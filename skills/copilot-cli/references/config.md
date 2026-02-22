# Configuration Settings

Configuration options for GitHub Copilot CLI. Can be set via config file or CLI flags.

## Config Options

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `allowed_urls` | list | - | URLs or domains allowed without prompting |
| `alt_screen` | boolean | false | Use terminal alternate screen buffer |
| `auto_update` | boolean | true | Automatically download CLI updates |
| `bash_env` | boolean | false | Enable BASH_ENV support for bash shells |
| `banner` | string | "once" | Banner display frequency: "always", "never", "once" |
| `beep` | boolean | true | Beep when user attention required |
| `include_coauthor` | boolean | true | Add Co-authored-by trailer to git commits |
| `compact_paste` | boolean | true | Collapse large pastes (>10 lines) into compact tokens |
| `custom_agents.default_local_only` | boolean | false | Default to local custom agents only |
| `denied_urls` | list | - | URLs or domains denied access |
| `experimental` | boolean | false | Enable experimental features |
| `launch_messages` | list | - | Messages to display in startup banner |
| `log_level` | string | "default" | Log level: "none", "error", "warning", "info", "debug", "all" |
| `model` | string | - | AI model to use |
| `streamer_mode` | boolean | false | Hide preview model names and quota details |
| `parallel_tool_execution` | boolean | true | Enable parallel execution of tools |
| `render_markdown` | boolean | true | Render markdown in terminal |
| `screen_reader` | boolean | false | Enable screen reader optimizations |
| `stream` | boolean | true | Enable streaming mode |
| `theme` | string | "auto" | Theme: "auto", "dark", "light" |
| `trusted_folders` | list | - | Folders with granted read/execute permissions |
| `undo_without_confirmation` | boolean | false | Skip undo confirmation on Esc Esc |
| `update_terminal_title` | boolean | true | Update terminal tab/window title with current intent |

## Available Models

- claude-sonnet-4.6
- claude-sonnet-4.5
- claude-haiku-4.5
- claude-opus-4.6
- claude-opus-4.6-fast
- claude-opus-4.5
- claude-sonnet-4
- gemini-3-pro-preview
- gpt-5.3-codex
- gpt-5.2-codex
- gpt-5.2
- gpt-5.1-codex-max
- gpt-5.1-codex
- gpt-5.1
- gpt-5.1-codex-mini
- gpt-5-mini
- gpt-4.1

## CLI Flag Equivalents

Some config options can be set via CLI flags:

- `--alt-screen on/off` or `--no-alt-screen`
- `--bash-env on/off` or `--no-bash-env`
- `--experimental`
- `--theme dark/light/auto`
