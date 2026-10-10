# idle-compact

Runs `/compact` in a Claude Code session once all hold:

- the main conversation has no open turn — a pending AskUserQuestion or permission prompt keeps the turn open, a background shell process does not, and a working background agent counts as activity;
- it has stayed that way for 20 minutes, or any rate-limit window (five-hour, seven-day) is above 95% used, in which case it compacts at the next one-minute check;
- the context window holds more than 200k tokens.

It compacts once per idle stretch; the next turn starts a new one. The thresholds are `POLICY` in [`hooks/activity.ts`](hooks/activity.ts).

## Install

```
/plugin install idle-compact --marketplace bence-boer/agent-resources
```

## Layout

- `hooks/activity.ts` — the session's activity as a pure state machine: `transition(activity, event)` and the compaction policy.
- `hooks/register.ts` — wires engine events and a one-minute check into that state machine and runs `/compact`.
- `types/index.d.ts` — the `$.state` contract for `Activity`.

## Develop

```
claude --plugin-dir plugins/idle-compact   # loads it with hot reload and lays its types for tsc
claude plugin validate plugins/idle-compact
claude plugin test plugins/idle-compact
```
