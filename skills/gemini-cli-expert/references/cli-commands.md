# Gemini CLI Command Reference

## Core Commands

- **/help**: Display help information for commands and features.
  - Usage: `/help [command]`
- **/settings**: Configure CLI settings, themes, and model selection.
  - Usage: `/settings [option] [value]`
  - Example: `/settings theme dark`
- **/model**: Select the Gemini model to use.
  - Usage: `/model [model_name]`
  - Example: `/model gemini-1.5-pro`
- **/tool**: Execute specific tools directly.
  - Usage: `/tool <tool_name> [arguments]`
  - Example: `/tool read_file path/to/file.txt`
- **/checkpoint**: Manage session checkpoints.
  - Usage: `/checkpoint <action> [name]`
  - Actions: `save`, `load`, `list`, `delete`
  - Example: `/checkpoint save my-session`
- **/history**: View and manage conversation history.
  - Usage: `/history [action]`
  - Actions: `list`, `clear`
- **/clear**: Clear the current conversation context.
- **/exit**: Exit the Gemini CLI.

## Session Management
Sessions track conversation history and context.
- **Start New:** Auto-starts on launch.
- **Resume:** Load a checkpoint.
- **Save:** Use `/checkpoint save`.

## Keyboard Shortcuts
- **Ctrl+C:** Cancel current generation or clear input.
- **Ctrl+D:** Exit CLI.
- **Up/Down Arrow:** Navigate command history.
- **Tab:** Autocomplete commands/files.

## Custom Commands

Custom commands allow aliases for frequently used prompts or sequences. Defined in `~/.gemini/config.yaml` under `custom_commands`.

**Example Config:**
```yaml
custom_commands:
  greet: "Hello, how can I assist you today?"
  list_files: "/tool list_files path=."
  search_docs: "/tool google_web_search query='Gemini CLI {query} documentation'"
```

**Usage:**
- `/greet`
- `/search_docs query="agent skills"`
