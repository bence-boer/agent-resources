# About custom agents

Custom agents provide assistance tailored to your needs.

## About custom agents

Custom agents are specialized agents that you can tailor to your workflows, coding conventions, and use cases. They act like focused teammates that follow your standards, use the right tools, and apply task-specific practices. You define these agents once instead of repeatedly providing the same instructions and context.

You define custom agents using Markdown files called agent profiles. These files specify prompts, tools, and optional MCP servers. This lets you encode your conventions, frameworks, and desired outcomes directly into the agent profile.

The agent profile defines the custom agent's behavior. When you assign the agent to a task, the runtime instantiates that profile.

## Agent profile format

Agent profiles are Markdown files with YAML frontmatter. In their simplest form, they include:

* **Name**: A unique identifier for the custom agent.
* **Description**: Explains the agent's purpose and capabilities.
* **Prompt**: Custom instructions that define the agent's behavior and expertise.
* **Tools** (optional): Specific tools the agent can access. If omitted, the runtime may expose all available tools.

Agent profiles can also include MCP server configurations using the `mcp-servers` property.

### Example agent profile

```text
---
name: readme-creator
description: Agent specializing in creating and improving README files
---

You are a documentation specialist focused on README files. Your scope is limited to README files or closely related documentation files only.

Focus on the following instructions:
- Create and update `README.md` files with clear project descriptions
- Structure sections logically: overview, installation, usage, contributing
- Write scannable content with clear headings and formatting
- Keep references to related documentation clear and consistent
- Maintain concise, practical guidance for readers
```

## Managing custom agents

Store agent profiles wherever your runtime expects them, and keep file names stable so users can reliably select the right agent. When teams share agents, keep descriptions precise and prompts narrowly scoped so each agent has a clear responsibility.

## Working across runtimes

Different runtimes may expose different tools or ignore unsupported properties. Test each agent profile in the environment where you plan to use it, especially if it relies on tool restrictions or MCP configuration.

## Next steps

Create a focused agent profile, test it with a small task, and refine its prompt until the output is consistent and reusable.
