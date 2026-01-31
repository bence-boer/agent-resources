# Agent Skills

Agent skills extend Gemini CLI with specialized workflows and expertise.

## Structure

A skill is a directory containing:
1. **`SKILL.md` (Required):** YAML frontmatter + Markdown body.
2. **`scripts/` (Optional):** Python/Bash scripts.
3. **`references/` (Optional):** Markdown documentation files.
4. **`assets/` (Optional):** Templates, images, etc.

## Creating a Skill

1. **Initialize:** Use the helper script (if available) or create the structure manually.
   `scripts/init_skill.py <skill-name> --path <output-directory>` (Hypothetical helper)

2. **SKILL.md Frontmatter:**
   ```yaml
   name: my-skill
   description: detailed description of when to use this skill.
   ```

3. **SKILL.md Body:**
   Instructions for the model. Use "Progressive Disclosure" - keep the main body concise and link to reference files for details.

## Example `SKILL.md`

```markdown
---
name: python-expert
description: Use when the user needs help writing, debugging, or understanding Python code.
---

# Python Expert

Follow these guidelines when writing Python:
- Use type hints.
- Follow PEP 8.
- Write docstrings for all functions.

## Resources
- **Conventions:** See [references/conventions.md](references/conventions.md)
```

## Packaging
Skills are packaged into `.skill` files (zip archives).
