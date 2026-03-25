---
name: copilot-sdk
description: >
  GitHub Copilot SDK reference for building Copilot-powered applications. Use when working with
  @anthropic/copilot-sdk or github/copilot-sdk for: (1) Creating Copilot apps with streaming and
  tools, (2) Configuring authentication (GitHub OAuth, BYOK, Azure), (3) Implementing session hooks
  (pre/post tool use, prompt filtering, lifecycle, errors), (4) Integrating MCP servers, custom
  agents, skills, or image input, (5) Setting up deployment (local CLI, bundled CLI, backend
  services, scaling), (6) Debugging Copilot SDK or MCP issues, (7) Adding OpenTelemetry
  observability, (8) Session persistence or streaming events. Triggers on any Copilot SDK task
  including setup, feature implementation, troubleshooting, and architecture decisions.
---

# Copilot SDK

Official documentation reference for the GitHub Copilot SDK. All docs are sourced directly from `github/copilot-sdk` and loaded on demand by topic.

## Routing

Read the relevant reference file(s) based on the user's task.

| User needs... | Load |
|---|---|
| First app, end-to-end tutorial, quick start | `references/copilot-sdk/docs/getting-started.md` |
| Auth overview, environment variables, method priority | `references/copilot-sdk/docs/auth/index.md` |
| BYOK (OpenAI, Azure, Anthropic, custom keys) | `references/copilot-sdk/docs/auth/byok.md` |
| Setup overview, deployment architecture | `references/copilot-sdk/docs/setup/index.md` |
| Local CLI setup | `references/copilot-sdk/docs/setup/local-cli.md` |
| Bundled CLI setup | `references/copilot-sdk/docs/setup/bundled-cli.md` |
| Backend / headless CLI over TCP | `references/copilot-sdk/docs/setup/backend-services.md` |
| GitHub OAuth flow | `references/copilot-sdk/docs/setup/github-oauth.md` |
| Azure Managed Identity / BYOK with Azure AI Foundry | `references/copilot-sdk/docs/setup/azure-managed-identity.md` |
| Horizontal scaling, multi-tenancy, isolation | `references/copilot-sdk/docs/setup/scaling.md` |
| Features overview | `references/copilot-sdk/docs/features/index.md` |
| Hooks overview and guide | `references/copilot-sdk/docs/features/hooks.md` |
| Custom agents / sub-agents | `references/copilot-sdk/docs/features/custom-agents.md` |
| MCP server integration | `references/copilot-sdk/docs/features/mcp.md` |
| Skills / reusable prompt modules | `references/copilot-sdk/docs/features/skills.md` |
| Image input / attachments | `references/copilot-sdk/docs/features/image-input.md` |
| Streaming events reference | `references/copilot-sdk/docs/features/streaming-events.md` |
| Steering and queueing / message delivery | `references/copilot-sdk/docs/features/steering-and-queueing.md` |
| Session persistence / resuming sessions | `references/copilot-sdk/docs/features/session-persistence.md` |
| Hooks API: pre-tool-use | `references/copilot-sdk/docs/hooks/pre-tool-use.md` |
| Hooks API: post-tool-use | `references/copilot-sdk/docs/hooks/post-tool-use.md` |
| Hooks API: user prompt submitted | `references/copilot-sdk/docs/hooks/user-prompt-submitted.md` |
| Hooks API: session lifecycle | `references/copilot-sdk/docs/hooks/session-lifecycle.md` |
| Hooks API: error handling | `references/copilot-sdk/docs/hooks/error-handling.md` |
| Hooks API: overview and all hooks | `references/copilot-sdk/docs/hooks/index.md` |
| Debugging, common issues | `references/copilot-sdk/docs/troubleshooting/debugging.md` |
| MCP-specific debugging | `references/copilot-sdk/docs/troubleshooting/mcp-debugging.md` |
| SDK vs CLI feature compatibility | `references/copilot-sdk/docs/troubleshooting/compatibility.md` |
| OpenTelemetry / tracing / observability | `references/copilot-sdk/docs/observability/opentelemetry.md` |
| Microsoft Agent Framework integration | `references/copilot-sdk/docs/integrations/microsoft-agent-framework.md` |
| Full documentation index | `references/copilot-sdk/docs/index.md` |

When multiple topics apply, load the most specific file first. For broad or exploratory questions, start with `references/copilot-sdk/docs/index.md` for orientation, then load the relevant section.
