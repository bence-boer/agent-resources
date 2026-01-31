# Architecture

Gemini CLI consists of two main packages:

1. **Client (`packages/cli`):**
   - Handles user input/output (REPL).
   - Manages session state locally.
   - Communicates with Core.

2. **Core (`packages/core`):**
   - **Gemini Model Integration:** Prompt engineering, API calls.
   - **Tool Orchestration:** Discovery, execution, sandboxing.
   - **Session Management:** History, context, checkpoints.
   - **Extension Management:** Loading/unloading.

## Data Flow
User Input -> Client -> Core -> Gemini API -> Core (Tool Call?) -> Tool Execution -> Core -> Gemini API -> Response -> Client -> User
