# idle-compact

Keeps a Claude Code session with more than 200k tokens of context from paying for its whole context uncached. Compaction and resumption happen while the main conversation's prompt cache is still warm. The cache lifetime comes from the `promptCacheTtl` setting: `5m`, or one hour otherwise.

- **Idle**: when no turn is running, the session is compacted in the last stretch of the cache lifetime, 55 minutes after the main conversation's last model request on the one-hour cache.
- **Long tool call**: while a turn waits on one tool call for that long, a one-word fork of the conversation (`$.model.fork`) reads the cache and keeps it alive instead. When a fork finds the cache already gone, pinging stops until the next model request.
- **Above 95% plan usage**: the main agent is told after its next batch of tool calls to wrap up, stop its background agents, write a handoff note and end its turn. The session is compacted as soon as the turn ends. A turn still running at 98% is stopped.
- **At 100%**: compaction is impossible because it is a model request itself, so nothing is attempted.
- **After the reset**: a turn that the plugin wound down, or that the limit ended, is continued a minute after the window resets. A turn the person interrupted is left alone.

A compaction counts only once the context has actually shrunk; a failed one is retried while the cache is warm. The thresholds are `POLICY` in [`hooks/activity.ts`](hooks/activity.ts).

## Install

```
/plugin install idle-compact --marketplace bence-boer/agent-resources
```

Or load the working copy in every session, reloading on save, even in sessions without a terminal such as Remote Control's, through the `env` block of `~/.claude/settings.json`:

```json
"env": {
  "CLAUDE_CODE_PLUGIN_DIRS": "~/projects/agent-resources/plugins/idle-compact",
  "CLAUDE_CODE_PLUGIN_DIR_WATCH": "1"
}
```

## Layout

- `hooks/activity.ts`: the session's activity as a pure state machine, `transition(activity, event)`, and the effect a check claims, `claimedEffect`.
- `hooks/register.ts`: wires engine events and a one-minute check into that state machine and performs the effects.
- `types/index.d.ts`: the `$.state` contract for `Activity`.

## Develop

```
claude --plugin-dir plugins/idle-compact   # loads it with hot reload and lays its types for tsc
claude plugin validate plugins/idle-compact
claude plugin test plugins/idle-compact
```
