# Advanced Features

## Headless Mode & Scripting
Run Gemini CLI programmatically for automation.

- **Flags:**
  - `--prompt "your prompt"`: Run a single prompt.
  - `--output-format json`: Return structured JSON output.
- **Piping:** `echo "content" | gemini --prompt "summarize"`

## System Prompt Override
Completely replace the default system instructions.

- **Env Var:** `GEMINI_SYSTEM_MD=true` (looks for `.gemini/system.md`).
- **Path:** `GEMINI_SYSTEM_MD=/path/to/custom.md`.
- **Warning:** This removes *all* default behavior (tools, safety, etc.) unless you re-add it.

## Sandboxing
Execute dangerous tools (shell, file write) in an isolated container.

- **Configuration:** Enable in `settings.json`.
- **Mechanism:** Uses Docker or other container runtimes to isolate execution.

## Policy Engine
Enforce security policies on tool execution.
- Allow/Deny specific tools or arguments.
- Configure via `policy.yaml` (likely location, check specific docs).
