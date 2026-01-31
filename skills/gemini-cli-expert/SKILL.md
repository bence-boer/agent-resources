---
name: gemini-cli-expert
description: Comprehensive guide to using, configuring, and extending Gemini CLI. Use when the user asks about Gemini CLI commands, settings, architecture, skills, hooks, or enterprise features.
---

# Gemini CLI Expert

This skill provides detailed information about the Gemini CLI ecosystem.

## Core Topics

### 0. Overview
An overview of Gemini CLI features and capabilities:
- **Reference:** [references/overview.md](references/overview.md)

### 1. Commands & Usage
For details on available commands (`/help`, `/settings`, `/tool`, etc.) and custom commands:
- **Reference:** [references/cli-commands.md](references/cli-commands.md)

### 2. Configuration & Security
For setting up models, themes, authentication, trusted folders, and ignore files:
- **Reference:** [references/configuration.md](references/configuration.md)

### 3. Agent Skills & Extensibility
For creating skills, configuring MCP servers, and using experimental features:
- **Skills:** [references/agent-skills.md](references/agent-skills.md)
- **Extensions:** Packaging, writing, and releasing. [references/extensions.md](references/extensions.md)
- **MCP Servers:** Connect external tools/data. [references/mcp-servers.md](references/mcp-servers.md)
- **Sub-Agents:** (Experimental) Specialized agents. [references/sub-agents.md](references/sub-agents.md)
- **Hooks:** Intercept lifecycle events. [references/hooks.md](references/hooks.md)
- **IDE Integration:** [references/ide-integration.md](references/ide-integration.md)

### 4. Tools & Memory
- **Tools:** Built-in and external tool usage. [references/tools.md](references/tools.md)
- **Memory/Context:** `GEMINI.md` and memory management. [references/project-context.md](references/project-context.md)

### 5. Advanced & Enterprise
- **Advanced Features:** Headless mode, Scripting, Sandboxing, Policy Engine. [references/advanced.md](references/advanced.md)
- **Enterprise:** RBAC, Audit Logging. [references/enterprise.md](references/enterprise.md)
- **Architecture:** [references/architecture.md](references/architecture.md)

### 6. Development & Troubleshooting
- **Development:** Contributing, Local Dev, Tools API. [references/development.md](references/development.md)
- **Troubleshooting:** FAQ, Common Issues. [references/troubleshooting.md](references/troubleshooting.md)
- **Gemini 3:** [references/gemini-3.md](references/gemini-3.md)

## Best Practices
- **Updates:** Keep the CLI updated.
For RBAC, audit logging, and centralized config:
- **Reference:** [references/enterprise.md](references/enterprise.md)

## Best Practices
- **Updates:** Keep the CLI updated.
- **Version Control:** Store config and scripts in git.
- **Security:** Use environment variables for secrets. Enable Trusted Folders.
- **Performance:** Optimize prompts, use efficient tools, and cache data.

## Troubleshooting
- **API Errors (429):** Resource exhausted. Wait or check quota.
- **Permissions:** Ensure `chmod +x` on scripts.
- **Connection:** Check internet and VPN settings.
