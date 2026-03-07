# Agent System

## Architecture

The agent pipeline has two phases:

### Phase 1: Planning (Manager Agent)

```
Feature submitted → watcher_service polls (5s interval)
  → spawns manager agent
  → manager reads feature description + context
  → manager produces tasks.json in workspace directory
  → server parses tasks.json, creates task rows in DB
  → tasks await human approval
```

### Phase 2: Execution (Ralph Agents)

```
Task approved → pipeline_service.process_next()
  → checks can_spawn_agent() (concurrency limit)
  → spawns ralph agent for the task
  → ralph reads task instructions + system prompt
  → ralph writes progress.json in workspace directory
  → server reads progress.json, updates task status
  → process_next() chains to next approved task
```

### Human-in-the-Loop

- Features must be explicitly submitted (not auto-planned on creation)
- Tasks produced by the manager must be approved before execution
- Users can stop, pause, and resume the pipeline

## Concurrency Control

```typescript
const MAX_CONCURRENT_AGENTS = parseInt(process.env.MAX_CONCURRENT_AGENTS ?? '3', 10);
```

**The increment/decrement pattern is the only safe approach:**

```typescript
if (!can_spawn_agent()) {
    // Register callback to retry when a slot opens
    set_on_agent_freed(() => process_next());
    return;
}

increment_agent_count();
try {
    await spawn_agent(task);
}
finally {
    decrement_agent_count(); // MUST be in finally — covers crash, timeout, abort
}
```

**Every path that calls `increment_agent_count()` must have a matching `decrement_agent_count()`
in a `finally` block.** This includes:
- Normal completion
- Agent crash (non-zero exit)
- Timeout
- User cancellation
- Any error in the spawn process itself

A leaked counter permanently reduces concurrency capacity.

**Manager agents respect the same limit.** A manager that bypasses `can_spawn_agent()` can deadlock
the pipeline by consuming all slots, leaving none for task execution.

## Process Spawning

### Binary Discovery

CLI tools (Copilot, Gemini) may be installed in different locations depending on the environment:

```typescript
function find_binary(name: string): string {
    const candidates = [
        `${process.env.HOME}/.bun/bin/${name}`,
        `${process.env.HOME}/.local/bin/${name}`,
        // fnm-managed paths
        `/run/user/${uid}/.fnm_multishells/*/bin/${name}`,
        `/usr/local/bin/${name}`
    ];
    // Return first that exists
}
```

Do not assume a binary is on PATH. Probe known install locations for each tool's ecosystem.

### Environment Sandboxing

**NEVER spread `...process.env` into spawned processes.** This leaks secrets (API keys, database
credentials, session tokens) into agent processes.

Use the explicit allowlist:

```typescript
function build_agent_env(): Record<string, string> {
    return {
        HOME: process.env.HOME,
        PATH: build_enriched_path(),
        TERM: 'xterm-256color',
        // Only specific, safe variables
    };
}
```

The PATH must include bin directories for all version managers and package managers in use
(fnm, bun, local bin).

### Process Cleanup

Kill by process group, not just parent PID:

```typescript
process.kill(-proc.pid, 'SIGKILL'); // Negative PID = process group
```

This ensures child processes spawned by an agent don't linger as orphans after timeout.

### Log Buffer Cap

Cap agent output collection at 1MB to prevent memory exhaustion from verbose agents:

```typescript
const MAX_LOG_SIZE = 1024 * 1024; // 1MB
let log_size = 0;
proc.stdout.on('data', (chunk) => {
    log_size += chunk.length;
    if (log_size <= MAX_LOG_SIZE) {
        log_buffer.push(chunk);
    }
});
```

## Multi-CLI Support

The system supports two AI CLI tools:

| Property | Copilot CLI | Gemini CLI |
|----------|-------------|------------|
| Binary | `COPILOT_BIN` | `GEMINI_BIN` |
| Tool flag | `--allow-all-tools` | `--yolo` |
| Model prefix | `gpt-*`, `claude-*`, `o1-*` | `gemini-*` |

Features have a `cli` column (`'copilot'` or `'gemini'` or `NULL`). The pipeline selects the
appropriate binary and flags based on this setting.

Chat routing detects the CLI from the model name:
```typescript
const is_gemini = resolved_model.toLowerCase().startsWith('gemini');
const cli = is_gemini ? 'gemini' : 'copilot';
```

## Model Configuration

Features support split model selection:
- **Planning model:** Used by the manager agent to decompose features into tasks
- **Execution model:** Used by ralph agents to execute individual tasks

This allows using a stronger model for planning (better decomposition) and a faster/cheaper model
for execution.

## File-Based IPC

Agents communicate results via JSON files in workspace directories:

- **Manager output:** `agents/workspace/{feature_id}/tasks.json`
- **Ralph output:** `agents/workspace/{feature_id}/{task_id}/progress.json`

The server validates agent output with Zod before database insertion. `JSON.parse()` alone is not
sufficient — structural validation catches malformed but parseable output.

## Prompt Injection Defense

All user-supplied content in agent prompts must be delimited:

```
<user_input>
${feature.description}
</user_input>
```

This reduces the surface for prompt injection where user-controlled feature descriptions could
contain instructions that override the system prompt.

## Restart Reconciliation

On server startup, reconcile in-memory state with the database:

```typescript
// Before spawning, check if already handled
const existing = await supabase
    .from('agent_runs')
    .select('id')
    .eq('feature_id', feature.id)
    .eq('agent_type', 'manager')
    .in('status', ['running', 'completed'])
    .limit(1);

if (existing.data?.length) return; // Already handled
```

The watcher service must not re-spawn managers for features that already have running or completed
manager runs. Without this check, every restart creates duplicate agent runs.

## Pipeline Flow Control

Use `setTimeout(0)` for `process_next()` chaining instead of direct recursion:

```typescript
function process_next() {
    // ... process current task ...
    setTimeout(() => process_next(), 0); // Prevents stack overflow on long queues
}
```
