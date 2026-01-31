# Memory Management & Project Context

## GEMINI.md

`GEMINI.md` is the primary mechanism for providing project-specific context.

- **Location:** Project root, subdirectories, or global configuration.
- **Function:** Contains instructions, persona definitions, style guides, and critical project facts.
- **Hierarchy:** Global -> Project Root -> Subdirectory (Specific overrides General).

## Memory Management

- **Initialization:** Context rebuilt from `GEMINI.md` on startup.
- **Refresh:** `/memory refresh` reloads context without restarting.
- **Persistence:** `save_memory` tool writes facts to long-term storage (Global `GEMINI.md`).
- **Caching:** API response caching and tactical local caching for tool outputs.

## Commands
- `/memory show`: Display currently loaded context.
- `/memory refresh`: Reload context from disk.
