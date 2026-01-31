# IDE Integration

Integrate Gemini CLI with IDEs (VS Code, Antigravity) for context awareness and native diffing.

## Features
- **Workspace Context:** Access to 10 recent files, active cursor, selected text (up to 16KB).
- **Native Diffing:** Review code changes in the IDE's diff viewer. Accept/Reject via UI.
- **Commands:** Access CLI features via Command Palette.

## Setup
- **Install:** Automatic nudge or `/ide install`.
- **Enable:** `/ide enable`.
- **Status:** `/ide status`.

## Workflow
1. User requests code change.
2. Gemini generates diff.
3. IDE opens diff view.
4. User reviews and accepts (checkmark) or rejects (x).
