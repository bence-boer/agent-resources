---
name: agent-creator
description: |
  Production-ready custom agent creation guide covering agent profile format (.agent.md), YAML frontmatter configuration, tool selection and aliasing, MCP server setup, and evidence-based prompt design using persona science (PRISM), vocabulary routing, and failure mode prevention (MAST). Use when creating, configuring, reviewing, or improving custom agents (.agent.md profiles), setting up agent tools or MCP servers, writing agent system prompts, scoping agent responsibilities, or designing multi-agent architectures. Trigger for any custom agent task even when informal ("make me an agent", "set up a coding assistant", "I need a helper for X", "configure my agent's tools").

  Do NOT use for creating skills (use Skill Creator) or team composition planning.
---

# Agent Creator

Create custom agents as Markdown profile files. Each profile defines a focused, reusable teammate with consistent expertise through YAML configuration and behavioral instructions grounded in persona science research.

## Agent profile format

A profile is a `.agent.md` file with YAML frontmatter (configuration) and a Markdown body (behavioral prompt).

```text
---
name: my-agent
description: What this agent does and when to use it
tools: ['read', 'edit', 'search', 'execute']
---

You are a [role] specialized in [domain].

[Behavioral instructions]
```

Keep file names stable so users can reliably select the right agent. When teams share agents, keep descriptions precise and prompts narrowly scoped so each agent has a clear responsibility.

## YAML frontmatter

| Property | Type | Required | Purpose |
|----------|------|----------|---------|
| `name` | string | No | Display name |
| `description` | string | **Yes** | Agent purpose and capabilities — primary discovery and selection mechanism |
| `tools` | list or string | No | Available tools. Supports YAML arrays and comma-separated strings. Omit for all tools |
| `model` | string | No | Model override. Omit for runtime default |
| `target` | string | No | Target environment or context. Supported values depend on the host runtime |
| `disable-model-invocation` | boolean | No | `true` prevents automatic task-based selection — agent must be picked manually |
| `user-invocable` | boolean | No | `false` restricts the agent to programmatic flows only. Default: `true` |
| `mcp-servers` | object | No | Additional MCP servers to expose to the agent |
| `metadata` | object | No | Key-value annotations (runtime-dependent) |

The Markdown body below the frontmatter is the agent's prompt. Maximum 30,000 characters.

Some runtimes support additional properties (`argument-hint`, `handoffs`). Unsupported properties are ignored for compatibility.

## Tool configuration

### Access levels

```yaml
# All tools (default when omitted)
tools: ["*"]

# Specific tools only
tools: ["read", "search", "edit"]

# No tools
tools: []

# Mix built-in and server-specific tools
tools: ["read", "my-server/analyze"]

# All tools from one server
tools: ["my-server/*"]
```

Unrecognized tool names are silently ignored — profiles degrade gracefully across runtimes.

### Tool aliases

Case-insensitive aliases that map across runtimes:

| Alias | Also matches | Purpose |
|-------|-------------|---------|
| `execute` | `shell`, `Bash`, `powershell` | Run shell commands |
| `read` | `Read`, `NotebookRead` | Read file contents |
| `edit` | `Edit`, `MultiEdit`, `Write`, `NotebookEdit` | Modify files |
| `search` | `Grep`, `Glob` | Search files and text |
| `agent` | `custom-agent`, `Task` | Delegate to another agent |
| `web` | `WebSearch`, `WebFetch` | Fetch URLs or web search |
| `todo` | `TodoWrite` | Manage task lists |

Prefer standard aliases over runtime-specific tool names for portability.

### Tool selection strategy

Match tools to the agent's responsibility. Restricting tools enforces scope — a planning agent with `edit` access will be tempted to implement; a review agent with `execute` will run tests instead of analyzing code.

| Agent role | Tools | Rationale |
|------------|-------|-----------|
| Planner, reviewer, auditor | `read`, `search` | Prevents acting when the job is to analyze |
| Fixer, generator, refactorer | `read`, `search`, `edit` | Can modify files, cannot execute arbitrary commands |
| Full teammate | Omit (all) | Broad capability, behavior shaped by prompt |
| Advisor, responder | `[]` (none) | Pure reasoning, no side effects |

## MCP server configuration

```yaml
---
name: my-agent
description: Agent with external tool access
tools: ['read', 'edit', 'custom-mcp/tool-1']
mcp-servers:
  custom-mcp:
    type: local
    command: some-command
    args: ['--arg1', '--arg2']
    tools: ['*']
    env:
      API_KEY: ${MY_API_KEY}
---
```

**Environment variable substitution** (patterns vary by runtime): `$VAR` / `${VAR}` / `${VAR:-default}` / `${{ secrets.VAR }}` / `${{ vars.VAR }}`

Store secrets in the host runtime's environment, not in agent profiles.

**Type mapping**: Some runtimes map `stdio` to `local` type.

**Processing order** when multiple layers define MCP servers: broader defaults → agent profile → workspace/runtime overrides.

## Writing the agent prompt

The Markdown body defines behavior, expertise, scope, and working patterns. Prompt quality is governed by persona science research — see [references/persona-science.md](references/persona-science.md) for the full findings.

### Prompt structure

```text
You are a [real job title] responsible for [primary responsibility]
within [organizational context].

[Core capabilities — what this agent does]

[Working approach — methodology, prioritization, decision-making]

[Scope boundaries — what this agent does NOT do]

[Guidelines — operational rules across all tasks]
```

### Role identity principles

PRISM research shows accuracy damage scales with persona length. Brief identities produce the best results.

- Keep role identity under 50 tokens. Move domain depth into the prompt body, not the opening identity statement
- Use real job titles that exist in actual organizations. "Software architect" not "code design guru." Real titles activate dense training data clusters
- NO flattery or superlatives. "World-class," "best," "expert," "genius" route to motivational/marketing clusters instead of domain expertise (Ranjan et al., 2024). Define the role through what they KNOW and DO, not how good they are
- Include organizational context: reporting lines, collaborators, and scope boundaries establish the role's position
- Match the role to the task domain. A misaligned persona is worse than no persona at all. Do not combine multiple roles — it fragments knowledge activation

### Domain vocabulary in prompts

Precise terminology in the prompt activates expert knowledge clusters. Generic terms route to generic content.

- Embed 15–30 expert terms organized in 3–5 sub-domain clusters within the prompt body when the agent needs deep domain expertise
- Apply the **15-year practitioner test**: would a senior practitioner use this exact term with a peer?
- Include originator attribution: "RICE prioritization (Intercom)" activates more specific knowledge than "RICE" alone
- Banned: "best practices," "leverage," "synergy," "paradigm shift," "holistic," "robust," "streamline"

### Prompt design principles

**Scope narrowly.** One clear responsibility per agent. Define both what the agent does and what it explicitly does not do. An agent scoped to "help with everything" delivers nothing consistently.

**Explain intent over mandating behavior.** Rather than rigid MUST/NEVER rules, explain why a pattern matters. A model that understands reasoning adapts to novel situations; one following brittle rules breaks on edge cases. Reserve imperative directives for hard boundaries like security and destructive actions.

**Handle multiple entry points.** Agents receive diverse requests. Use conditional blocks for the main pathways:

```text
**When a specific target is provided:**
- Focus only on the specified file or directory

**When no target is provided:**
- Scan the codebase for relevant opportunities
- Prioritize by impact and surface the top findings
```

**State limitations explicitly.** Agents work better when they know their boundaries:

```text
**Important limitations:**
- Do not modify source code outside your domain
- Do not run destructive commands without confirmation
```

**Include operational guidelines.** Short, actionable rules that shape behavior across all tasks.

**Embed output structure** when the agent produces structured deliverables. Include the template directly in the prompt so output format is consistent across invocations.

**Include named anti-patterns.** Every agent benefits from 3–8 domain-specific anti-patterns with observable detection signals and concrete resolutions. Without negative constraints, output gravitates to the statistical center — the most generic, average version. Anti-patterns steer past this toward distinctive, expert-level output. See [references/failure-modes.md](references/failure-modes.md) for the MAST taxonomy of common failure modes.

### Writing the description

The `description` field drives agent discovery and selection. It answers: "What does this agent do, and when should someone pick it?"

- Lead with the core capability in concrete terms
- Include both expert terminology AND casual trigger phrases (dual register) — models undertrigger, so be pushy with synonyms and adjacent scenarios
- Include explicit exclusions ("Do NOT use for X") to prevent mis-triggers
- Be specific enough to differentiate from similar agents

## Anti-pattern watchlist

Scan every generated agent profile against this list before delivery.

### 1. Flattery persona
**Detection:** Superlatives in identity — "world-class," "best," "always," "unparalleled," "leading expert."
**Resolution:** Remove every superlative. Define through knowledge and behavior, not quality claims.

### 2. Bare role label
**Detection:** Identity is fewer than 10 tokens with no organizational context. Example: "You are a product manager."
**Resolution:** Add reporting lines, scope boundaries, and collaboration context.

### 3. Verbose identity
**Detection:** Identity exceeds 50 tokens or is a full paragraph of description.
**Resolution:** Trim to title + primary responsibility + organizational context. Move domain depth into vocabulary or the prompt body.

### 4. Missing deliverables
**Detection:** Prompt describes only behaviors and attitudes, no concrete artifacts that could be verified as produced.
**Resolution:** Name specific artifacts with format descriptions. Ask: "What does this agent hand to the next agent or user?"

### 5. Overlapping authority
**Detection:** Two agents in a team can both autonomously decide the same thing.
**Resolution:** Delineate explicitly — one agent decides, others advise. Exactly one Responsible per decision.

### 6. Consultant-speak vocabulary
**Detection:** Prompt contains "best practices," "leverage," "synergy," "holistic approach," "robust solution."
**Resolution:** Apply the 15-year practitioner test. Replace each generic term with the precise domain term.

### 7. Scope-free prompt
**Detection:** No explicit "does NOT do" or limitations section. Prompt only describes what to do.
**Resolution:** Add a limitations/scope section. Without negative constraints, the agent attempts anything remotely related to its title.

### 8. Tool-scope mismatch
**Detection:** Agent tools grant capabilities beyond its stated responsibility. A planning agent has `edit` access; a review agent has `execute`.
**Resolution:** Restrict tools to match responsibility. Tools enforce scope boundaries that prompts alone cannot.

## Agent patterns

### Specialist

Deep focus on one domain. Restricted tools enforce the scope boundary.

```yaml
---
name: test-specialist
description: Writes and improves tests for code quality and coverage without modifying production code
tools: ['read', 'search', 'edit']
---
```

Prompt shape: role → responsibilities → methodology → file scope → limitations

### Planner

Creates plans and specifications without implementing. Tool restrictions prevent scope creep.

```yaml
---
name: implementation-planner
description: Creates detailed implementation plans and technical specifications in markdown
tools: ['read', 'search', 'edit']
---
```

Prompt shape: role → responsibilities → output structure template → scope calibration

### Teammate

Broad capability with a specific working style. Full tool access, behavior shaped entirely by prompt.

```yaml
---
name: bug-fix-teammate
description: Identifies critical bugs and implements targeted fixes with working code
---
```

Prompt shape: role → triage logic → implementation approach → guidelines → knowledge sharing

### Programmatic-only agent

Not user-selectable — available only through automation or other agents.

```yaml
---
name: ci-reviewer
description: Automated code review agent for CI pipelines
user-invocable: false
disable-model-invocation: true
tools: ['read', 'search']
---
```

## Cross-runtime compatibility

- Different runtimes expose different tools and may ignore unsupported properties
- Test agent profiles in the target environment, especially when relying on tool restrictions or MCP configuration
- Prefer tool aliases over runtime-specific tool names for portability
- When versioning matters, treat profiles as configuration and test changes before broad rollout

## Authoring workflow

1. Identify the agent's primary responsibility, domain, and organizational context. IF from a direct user request and the request is vague: ask 1–2 clarifying questions about domain, deliverables, and decision scope. IF the user provides a job description or role document: extract answers from it.
2. IF unfamiliar domain: research what a real person in this role produces daily, what frameworks define the domain, and what vocabulary a 15-year practitioner uses.
3. Write the YAML frontmatter: set `description` (dual-register, ~100 words), select `tools` matching the agent's responsibility scope, configure `mcp-servers` if needed.
4. Write the role identity (~20–50 tokens): real job title, primary responsibility, organizational context, reporting lines. No flattery.
5. Write the prompt body: core capabilities, domain vocabulary (if the agent needs deep expertise), working approach with conditional entry points, scope boundaries and limitations, operational guidelines.
6. Add 3–8 domain-specific anti-patterns with detection signals and resolutions to the prompt body.
7. Validate: scan against the anti-pattern watchlist above. Check that tools match scope. Check that the description is triggerable with both expert and casual queries.
8. For team agents: cross-reference decision authority with sibling agents to verify no overlap and no authority vacuum.

## Preflight checklist

- [ ] `description` clearly conveys purpose and differentiates from similar agents
- [ ] `tools` match the agent's responsibility scope — no more, no less
- [ ] Role identity is under 50 tokens, uses a real job title, no flattery
- [ ] Prompt defines what the agent does AND what it does not do
- [ ] Conditional blocks handle the agent's main entry points
- [ ] Domain vocabulary uses precise expert terms, not consultant-speak
- [ ] Anti-patterns included with detection signals and resolutions
- [ ] Limitations stated explicitly
- [ ] Profile degrades gracefully across runtimes
- [ ] MCP server secrets use environment variable substitution, not hardcoded values
- [ ] For team agents: no decision authority overlap, no authority vacuum

## Examples

### BAD vs GOOD role identity

**BAD:**
> You are the world's leading product manager with unparalleled expertise in creating products that users love. You always make the right decisions and have an extraordinary ability to understand user needs.

Problems: 42 tokens of flattery. "World's leading" routes to motivational text. "Always make the right decisions" is an absolute. No organizational context. No collaboration boundaries.

**GOOD:**
> You are a product manager responsible for defining requirements and success metrics within a B2B SaaS product team. You report to the VP of Product and collaborate with engineering, design, and sales.

Why it works: Real job title. Primary responsibility stated. Organizational context (B2B SaaS). Reporting line and collaborators establish boundaries. 35 tokens. No flattery.

### BAD vs GOOD domain vocabulary in prompt

**BAD:**
> best practices, stakeholder alignment, strategic vision, innovative solutions, leverage synergies, drive results, thought leadership, holistic approach

Problems: Every term fails the 15-year practitioner test. Routes to generic business writing clusters. No attributions.

**GOOD:**
> **Discovery & Prioritization:** PRD structure, RICE prioritization (Intercom), Jobs-to-be-Done (Christensen), opportunity-solution tree (Teresa Torres), assumption mapping
> **Execution:** user story mapping (Jeff Patton), INVEST criteria (Bill Wake), acceptance criteria, definition of done
> **Measurement:** OKR alignment, North Star metric (Sean Ellis), activation rate, retention cohort, product-market fit score

Why it works: Three distinct clusters. Every term passes the 15-year practitioner test. Framework originators attributed. 25 precise terms routing to product management knowledge clusters.

## Questions this skill answers

- "Create an agent for [role/domain]"
- "I need a [job title] agent"
- "Make me an AI assistant for [specific task]"
- "Build me a product manager / engineer / designer / etc."
- "How do I create a good agent definition?"
- "Set up a coding assistant"
- "I need a helper for X"
- "Configure my agent's tools"
- "What should a [role] agent look like?"
- "Turn this role description into an agent"
- "Improve this agent persona"
- "What's wrong with my agent definition?"
- "My agent isn't working well, how do I fix it?"
- "Set up MCP servers for my agent"
