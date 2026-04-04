---
name: copilot-sdk
description: >
  GitHub Copilot SDK reference for building Copilot-powered applications using @github/copilot-sdk,
  github-copilot-sdk, or equivalent Go/.NET/Java packages. Covers CopilotClient session lifecycle,
  streaming events, session hooks (pre/post tool use, prompt filtering, lifecycle, errors),
  authentication (GitHub OAuth, BYOK with Azure/OpenAI/Anthropic, env vars), MCP server
  integration, custom agents, skills, image attachments, steering/queueing, session persistence,
  and OpenTelemetry observability. Use when building apps with Copilot, adding AI features, setting
  up streaming responses, wiring up hooks, configuring auth, deploying Copilot services, debugging
  SDK issues, or asking "how do I use the Copilot SDK?" Triggers on any Copilot SDK task including
  setup, feature implementation, troubleshooting, and architecture decisions. Do NOT use for
  Copilot CLI configuration (use copilot-cli), IDE/editor Copilot features, or GitHub Copilot for
  Business administration.
---

# Copilot SDK

## Key Facts

- **Status:** Technical preview. APIs may change between releases.
- **Protocol version:** 3. The SDK communicates with the Copilot CLI via JSON-RPC over TCP.
- **Languages:** TypeScript (`@github/copilot-sdk`), Python (`github-copilot-sdk`), Go (`github.com/github/copilot-sdk/go`), .NET (`GitHub.Copilot.SDK`), Java (`com.github:copilot-sdk-java`).
- **Runtime dependency:** Requires the Copilot CLI installed and available in PATH. The SDK does not embed its own model — it delegates to the CLI's agent runtime.
- **Primary pattern:** Create a `CopilotClient` → create/resume a session → `send()` or `sendAndWait()` messages → subscribe to streaming events → disconnect.
- **Auth hierarchy:** GitHub signed-in user (default) → OAuth GitHub App → environment variables → BYOK. First valid credential wins.
- **Hooks model:** Six hook points (pre-tool-use, post-tool-use, user-prompt-submitted, session-lifecycle, error-handling, plus the hooks overview). Hooks are callbacks registered on session creation.
- **Not all CLI features are available in the SDK.** Interactive/terminal-specific CLI features (TUI, interactive prompts) are not exposed via JSON-RPC. Check the compatibility matrix before assuming a feature exists.

## Routing

Read the relevant reference file(s) based on the user's task. When multiple topics apply, load the most specific file first. For broad or exploratory questions, start with the documentation index for orientation, then load the relevant section.

### Getting Started

| User needs... | Load |
|---|---|
| First app, end-to-end tutorial, quick start | [getting-started.md](references/copilot-sdk/docs/getting-started.md) |
| Full documentation index | [index.md](references/copilot-sdk/docs/index.md) |

### Authentication

| User needs... | Load |
|---|---|
| Auth overview, environment variables, method priority | [auth/index.md](references/copilot-sdk/docs/auth/index.md) |
| BYOK (OpenAI, Azure, Anthropic, custom keys) | [auth/byok.md](references/copilot-sdk/docs/auth/byok.md) |

### Setup & Deployment

| User needs... | Load |
|---|---|
| Setup overview, deployment architecture | [setup/index.md](references/copilot-sdk/docs/setup/index.md) |
| Local CLI setup | [setup/local-cli.md](references/copilot-sdk/docs/setup/local-cli.md) |
| Bundled CLI setup | [setup/bundled-cli.md](references/copilot-sdk/docs/setup/bundled-cli.md) |
| Backend / headless CLI over TCP | [setup/backend-services.md](references/copilot-sdk/docs/setup/backend-services.md) |
| GitHub OAuth flow | [setup/github-oauth.md](references/copilot-sdk/docs/setup/github-oauth.md) |
| Azure Managed Identity / BYOK with Azure AI Foundry | [setup/azure-managed-identity.md](references/copilot-sdk/docs/setup/azure-managed-identity.md) |
| Horizontal scaling, multi-tenancy, isolation | [setup/scaling.md](references/copilot-sdk/docs/setup/scaling.md) |

### Features

| User needs... | Load |
|---|---|
| Features overview | [features/index.md](references/copilot-sdk/docs/features/index.md) |
| Hooks overview and guide | [features/hooks.md](references/copilot-sdk/docs/features/hooks.md) |
| Custom agents / sub-agents | [features/custom-agents.md](references/copilot-sdk/docs/features/custom-agents.md) |
| MCP server integration | [features/mcp.md](references/copilot-sdk/docs/features/mcp.md) |
| Skills / reusable prompt modules | [features/skills.md](references/copilot-sdk/docs/features/skills.md) |
| Image input / attachments | [features/image-input.md](references/copilot-sdk/docs/features/image-input.md) |
| Streaming events reference | [features/streaming-events.md](references/copilot-sdk/docs/features/streaming-events.md) |
| Steering and queueing / message delivery | [features/steering-and-queueing.md](references/copilot-sdk/docs/features/steering-and-queueing.md) |
| Session persistence / resuming sessions | [features/session-persistence.md](references/copilot-sdk/docs/features/session-persistence.md) |

### Hooks API Reference

| User needs... | Load |
|---|---|
| Hooks API: overview and all hooks | [hooks/index.md](references/copilot-sdk/docs/hooks/index.md) |
| Hooks API: pre-tool-use | [hooks/pre-tool-use.md](references/copilot-sdk/docs/hooks/pre-tool-use.md) |
| Hooks API: post-tool-use | [hooks/post-tool-use.md](references/copilot-sdk/docs/hooks/post-tool-use.md) |
| Hooks API: user prompt submitted | [hooks/user-prompt-submitted.md](references/copilot-sdk/docs/hooks/user-prompt-submitted.md) |
| Hooks API: session lifecycle | [hooks/session-lifecycle.md](references/copilot-sdk/docs/hooks/session-lifecycle.md) |
| Hooks API: error handling | [hooks/error-handling.md](references/copilot-sdk/docs/hooks/error-handling.md) |

### Troubleshooting & Observability

| User needs... | Load |
|---|---|
| Debugging, common issues | [troubleshooting/debugging.md](references/copilot-sdk/docs/troubleshooting/debugging.md) |
| MCP-specific debugging | [troubleshooting/mcp-debugging.md](references/copilot-sdk/docs/troubleshooting/mcp-debugging.md) |
| SDK vs CLI feature compatibility | [troubleshooting/compatibility.md](references/copilot-sdk/docs/troubleshooting/compatibility.md) |
| OpenTelemetry / tracing / observability | [observability/opentelemetry.md](references/copilot-sdk/docs/observability/opentelemetry.md) |

### Integrations

| User needs... | Load |
|---|---|
| Microsoft Agent Framework integration | [integrations/microsoft-agent-framework.md](references/copilot-sdk/docs/integrations/microsoft-agent-framework.md) |

## Caveats

- **CLI dependency is mandatory.** The SDK is a client library over the Copilot CLI — if the CLI is not installed, authenticated, and in PATH, nothing works. Ensure `copilot --version` succeeds before debugging SDK issues.
- **`destroy()` is deprecated.** Use `disconnect()` to release in-memory resources. Use `deleteSession()` to remove from storage. Code using `destroy()` will break in a future release.
- **Not all CLI features are SDK-accessible.** The SDK communicates via JSON-RPC, so interactive/TUI-only features are unavailable. Always check the [compatibility matrix](references/copilot-sdk/docs/troubleshooting/compatibility.md) before assuming a CLI feature can be used programmatically.
- **Auth method priority can surprise you.** The SDK uses the first valid credential it finds (signed-in user → OAuth → env vars → BYOK). If you set BYOK config but a signed-in user exists, BYOK is ignored. Be explicit about which method you intend.
- **Streaming events require subscription.** Events are not delivered by default — you must subscribe to the event types you care about. Missing events usually means missing subscriptions, not a bug.
- **Session persistence requires explicit opt-in.** Sessions are ephemeral by default. To resume across restarts, configure session persistence and use `resumeSession()` with the stored session ID.
- **Hook errors can silently break sessions.** If a hook callback throws an unhandled exception, behavior depends on the hook type. Some fail open (session continues without the hook), others fail closed (session aborts). Always wrap hook callbacks in try/catch.
- **BYOK skips Copilot subscription checks.** When using BYOK, no GitHub Copilot subscription is required — but you lose Copilot-specific model routing and safety filters. You are responsible for your own API key costs and rate limits.
- **Multi-language API surface is consistent but not identical.** Method names follow each language's conventions (camelCase in TS, snake_case in Python, PascalCase in .NET). The docs show all languages — read the tab for your language, not the first tab.

## Questions this skill answers

- "Build an app with the Copilot SDK"
- "How do I use the Copilot SDK?"
- "Set up authentication for Copilot"
- "How do hooks work in the SDK?"
- "Add MCP servers to my Copilot app"
- "Configure BYOK with the SDK"
- "Debug my Copilot SDK integration"
- "How do I add custom agents?"
- "Set up streaming events"
- "Deploy a Copilot-powered app"
- "How do I use session persistence in the SDK?"
- "My SDK app can't connect to the CLI"
- "What's the difference between send and sendAndWait?"
- "How do I scale a Copilot-powered service?"
- "Add OpenTelemetry tracing to my Copilot app"
