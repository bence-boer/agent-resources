---
name: skill-creator
description: Create new skills and modify existing skills. Use when users want to create a skill from scratch, edit or simplify an existing skill, improve a skill's instructions or description, validate a SKILL.md file, or package a skill for distribution.
---

# Skill Creator

Create new skills and refine them directly.

## Core workflow

1. Capture intent - what should the skill do and when should it trigger
2. Draft the skill
3. Validate the structure and fix obvious issues
4. Refine the draft directly when gaps are clear from the conversation or examples
5. Package the skill when the user wants a distributable artifact

Identify where the user is in this process and pick up from there. If they already have a draft, skip to reviewing and editing it. The order is flexible - follow the user's lead, but keep the work direct and lightweight.

## Communication

Calibrate jargon to the user's familiarity level. Terms like "frontmatter" and "compatibility" are generally fine. For "JSON", "YAML", or similar technical terms, briefly explain them unless the user has clearly demonstrated familiarity.

---

## Creating a skill

### Capture Intent

Start by understanding the user's intent. The current conversation might already contain a workflow the user wants to capture (e.g., they say "turn this into a skill"). If so, extract answers from the conversation history first - the tools used, the sequence of steps, corrections the user made, input/output formats observed. The user may need to fill the gaps, and should confirm before proceeding to the next step.

1. What should this skill enable the agent to do?
2. When should this skill trigger? (what user phrases/contexts)
3. What's the expected output format?
4. Are there example prompts, files, or constraints that should shape the draft?

### Interview and Research

Proactively ask questions about edge cases, input/output formats, example files, success criteria, and dependencies. Wait to write the draft until you've got this part ironed out.

Check available MCPs - if useful for research (searching docs, finding similar skills, looking up best practices), research in parallel via subagents if available, otherwise inline. Come prepared with context to reduce burden on the user.

### Write the SKILL.md

Based on the user interview, fill in these components:

- **name**: Skill identifier
- **description**: Primary triggering mechanism - include both what the skill does AND specific contexts for when to use it. All "when to use" info belongs here, not in the body. Models tend to undertrigger skills, so make descriptions assertive about when to activate. Example: instead of "Build dashboards for internal data", write "Build dashboards for internal data. Use whenever the user mentions dashboards, data visualization, internal metrics, or wants to display company data, even without explicitly asking for a 'dashboard.'"
- **compatibility**: Required tools, dependencies (optional, rarely needed)
- **body**: The skill's instructions - workflow steps, decision logic, output formats, constraints, and references to bundled resources

### Skill Writing Guide

#### Anatomy of a Skill

```
skill-name/
|- SKILL.md (required)
|  |- YAML frontmatter (name, description required)
|  \- Markdown instructions
\- Bundled Resources (optional)
   |- scripts/    - Executable code for deterministic/repetitive tasks
   |- references/ - Docs loaded into context as needed
   \- assets/     - Files used in output (templates, icons, fonts)
```

#### Progressive Disclosure

Skills use a three-level loading system:
1. **Metadata** (name + description) - Always in context (~100 words)
2. **SKILL.md body** - In context whenever skill triggers (<500 lines ideal)
3. **Bundled resources** - As needed (unlimited, scripts can execute without loading)

These word counts are approximate and you can feel free to go longer if needed.

**Key patterns:**
- Keep SKILL.md under 500 lines; if you're approaching this limit, add an additional layer of hierarchy along with clear pointers about where the model using the skill should go next to follow up.
- Reference files clearly from SKILL.md with guidance on when to read them
- For large reference files (>300 lines), include a table of contents

**Domain organization**: When a skill supports multiple domains/frameworks, organize by variant:
```
cloud-deploy/
|- SKILL.md (workflow + selection)
\- references/
   |- aws.md
   |- gcp.md
   \- azure.md
```
The agent reads only the relevant reference file.

#### Safety

Skills must not contain malware, exploit code, or content that could compromise system security. A skill's contents should not surprise the user in their intent if described. Decline requests to create skills designed for unauthorized access, data exfiltration, or other malicious purposes.

#### Writing Patterns

Prefer using the imperative form in instructions.

**Defining output formats** - You can do it like this:
```markdown
## Report structure
ALWAYS use this exact template:
# [Title]
## Executive summary
## Key findings
## Recommendations
```

**Examples pattern** - It's useful to include examples. You can format them like this (but if "Input" and "Output" are in the examples you might want to deviate a little):
```markdown
## Commit message format
**Example 1:**
Input: Added user authentication with JWT tokens
Output: feat(auth): implement JWT-based authentication
```

### Writing Style

- **Explain intent over mandating behavior.** Rather than rigid MUST/NEVER rules, explain why a pattern matters. A model that understands reasoning adapts to novel situations; one following brittle rules breaks on edge cases. Reserve imperative directives for hard safety and correctness boundaries.
- **Generalize, don't overfit.** Write skills that work across many prompts, not just the examples at hand. If a behavior is stubborn, try different framing or patterns rather than adding restrictive constraints.
- **Keep the prompt lean.** Every instruction should pull its weight. If the current draft causes unproductive work, cut or rephrase the responsible instructions.
- **Bundle repeated work.** If a skill repeatedly needs the same helper logic or multi-step deterministic task, write the script once, put it in `scripts/`, and reference it from the skill.

### How skill triggering works

Understanding the triggering mechanism helps design better descriptions. In environments with skill discovery, skills appear in the agent's available skill list with their name + description, and the agent decides whether to consult a skill based on that description. The important thing to know is that agents only consult skills for tasks they can't easily handle on their own - simple, one-step queries like "read this PDF" may not trigger a skill even if the description matches perfectly, because the agent can handle them directly with basic tools. Complex, multi-step, or specialized queries reliably trigger skills when the description matches.

This means the description should emphasize user intent, the situations where the skill adds leverage, and the kinds of tasks that benefit from specialized guidance.

## Direct refinement

When a user wants to change an existing skill, make the requested edits directly.

1. Read the current `SKILL.md` and any bundled resources it references.
2. Identify which instructions, examples, or helpers still support the intended use case.
3. Remove or rewrite parts that no longer fit.
4. Check that the remaining guidance is internally consistent and that all file references still resolve.
5. If helpful, walk through a few representative prompts conversationally to sanity-check the draft.

---

## Validate and package

Before handing the skill back:

1. Run `python -m scripts.quick_validate <path-to-skill>` to catch frontmatter or structure issues.
2. If the user wants an installable artifact, package it:
   ```bash
   python -m scripts.package_skill <path/to/skill-folder>
   ```
3. If packaging succeeds, tell the user where the `.skill` file was written.

### Package and Present (only if `present_files` tool is available)

Check whether you have access to the `present_files` tool. If you don't, skip this step. If you do, package the skill and present the .skill file to the user:

```bash
python -m scripts.package_skill <path/to/skill-folder>
```

After packaging, direct the user to the resulting `.skill` file path so they can install it.

---

## Environment adaptations

The core workflow (capture intent -> draft -> refine directly -> package) is the same everywhere. Adapt mechanics based on available capabilities.

### Without subagents

- Research and edit inline.
- If helpful, sanity-check the draft with a few representative prompts in conversation rather than building extra tooling around the review.

### Headless / remote environments

- Validation (`quick_validate.py`) and packaging (`package_skill.py`) work normally in headless environments.
- Present results in conversation and point the user at the final skill path or packaged artifact.

### Updating an existing skill

- **Preserve the original name.** Keep the directory name and `name` frontmatter field unchanged.
- **Copy to a writable location before editing.** The installed skill path may be read-only. Copy to `/tmp/skill-name/`, edit there, and package from the copy.
- **Stage in `/tmp/` first** when packaging manually - direct writes may fail due to permissions.

---

## Bundled scripts

- `scripts/quick_validate.py` - Basic validation for `SKILL.md` frontmatter and related metadata
- `scripts/package_skill.py` - Package a skill into a distributable `.skill` archive
