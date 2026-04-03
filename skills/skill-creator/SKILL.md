---
name: skill-creator
description: Create, split, rewrite, and validate standalone Markdown skills in any domain using evidence-based principles — expert vocabulary payloads for knowledge routing, dual-register descriptions for reliable triggering, named anti-pattern watchlists for steering past the distribution center, and progressive disclosure architecture for context efficiency. Use for any SKILL.md work — new skills, skill refactors, skill splits, turning docs/history/examples into a skill, tightening frontmatter and descriptions, or validation and packaging. Produces concise, dry, information-dense, comprehensive skills with explicit boundaries and minimal overlap.
---

# Skill Creator

Create standalone skills that are easy to trigger, efficient to load, and hard to misuse. Every design decision is grounded in how transformers process context.

## Anatomy of a skill

A skill is a directory containing a `SKILL.md` plus optional secondary files.

```text
skill-name/
├── SKILL.md            # required — frontmatter + Markdown body
├── references/         # docs, guides, examples loaded selectively
├── scripts/            # executable utilities for deterministic tasks
└── assets/             # templates, icons, or other output files
```

**Frontmatter** (YAML between `---` delimiters at the top of `SKILL.md`) requires `name` and `description`. Optional fields: `license`, `allowed-tools`, `metadata`, `compatibility`.

- `name`: kebab-case (lowercase letters, digits, hyphens), max 64 characters
- `description`: max 1024 characters, no angle brackets

**Three loading levels** — only the relevant level enters context:

1. `name` + `description` (~100 tokens) — always in context, drives discovery and triggering
2. `SKILL.md` body (<500 lines) — loaded when the skill is invoked
3. Secondary files — loaded on demand, only when the agent routes to them

This progressive disclosure architecture prevents context overflow. Performance follows an inverted-U: optimal at 15–40% window utilization, degraded above 60%.

The `description` carries the skill's condensed purpose and activation trigger. The body should start with owned surface, routing, defaults, or operating rules — not by repeating the description.

## What this skill owns

- Creating or rewriting skills in any domain: software, design, research, writing, operations, analysis, education, or mixed workflows
- Splitting one skill into multiple complementary skills or merging an over-fragmented set back into one
- Turning docs, prompts, history, examples, transcripts, or working practices into a reusable skill
- Reviewing descriptions, boundaries, routing, structure, references, examples, finish criteria, and packaging

This skill is about authoring skills. If the user wants some other artifact, use this skill only when the result should itself be a skill. Do NOT use for creating agent definitions or team composition.

## Outcome standard

These properties apply both to this skill and to every skill it authors or refines:

- Dry, factual, standalone language — no motivational filler, no process commentary, no conversation context
- Concise but comprehensive: every section must route, constrain, default, clarify, or validate
- Root-first design: anything relevant on every invocation belongs in `SKILL.md`
- Secondary files only for conditional depth: scenario, domain, variant, catalog, or optional examples
- Standalone: never link to skills or assets outside the skill's own folder
- Strong concern boundaries: minimal overlap between sibling skills and between root vs secondary files
- Decisive guidance: do not leave goals so broad that almost any choice can be justified
- Triggerable frontmatter: the description must say what the skill does and when it should activate
- Generality without vagueness: reusable across the intended domain, not overfit to one example
- Dominant-mode structure: thinking, prescriptive, and reference skills should not read the same

## First classify the job

| If the user wants...                                       | Do this                                                                                                    |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| A new skill                                                | Choose the dominant mode, define the owned surface, then design structure before writing                    |
| An existing skill improved                                 | Preserve the name, remove drift, tighten boundaries, rewrite stale sections instead of layering on top     |
| One skill split or several merged                          | Define ownership boundaries first, then decide what genuinely belongs together                              |
| Docs, prompts, history, or examples distilled into a skill | Analyze chronologically when time matters, keep stable conclusions, do not mirror the source blindly        |
| Validation or packaging only                               | Validate first; package only if requested                                                                  |

## Then choose the dominant mode

Most skills lead with one dominant mode. A skill may borrow from a second mode, but the root file must clearly lead with one.

### Thinking skill

Use when the skill should improve judgment across many scenarios rather than prescribe one fixed way.

Root usually contains: routing order or scenario matrix, short principles or decision lenses, finish or self-review criteria. Prefer questions, invariants, discriminating matrices, and compact prescriptions. Avoid file-level detail or vague philosophy that cannot rule anything out.

### Prescriptive skill

Use when the skill should tell the agent how to perform recurring work, create a defined artifact, follow a stable format, or apply defaults. Also covers builder/process skills: creation, reporting, auditing, planning, formatting, workflow execution.

Root usually contains: what the skill owns and does not own, routing by task or surface, defaults, rules, process steps, output expectations. Prefer ownership rules, defaults, checklists, thresholds, and clear format contracts. Avoid broad goals with no defaults.

### Reference skill

Use when the main job is to make a large knowledge base, manual, catalog, or external system usable inside the agent.

Root usually contains: key facts that change how the source should be read, a routing matrix or topic map, local conventions or caveats. Prefer thin routing plus curated depth. Avoid rewriting the whole source into prose or leaving a raw dump with no navigation layer.

### Minimal root shapes

- Thinking: routing order → core questions or principles → scenario matrix if needed → finish review
- Prescriptive: what it owns → non-goals → routing by task or surface → defaults or workflow → output expectations
- Reference: key facts → routing matrix or index → local conventions or caveats

## Design principles

These principles govern how every skill should be structured. See [references/design-principles.md](references/design-principles.md) for the full research backing with sources and mechanism explanations.

### Terminology precision (vocabulary routing)

LLMs organize knowledge in embedding space clusters. Precise terminology activates deep knowledge; generic terms route to generic content.

- Include 15–30 expert domain terms organized in 3–5 clusters in every prescriptive or reference skill
- Apply the **15-year practitioner test**: would a senior practitioner use this exact term with a peer? If not, replace it
- Include originator attribution: "circuit breaker (Nygard)" activates more specific knowledge than "circuit breaker" alone
- Generic terms ("best practices," "robust solution") are actively harmful — they route to introductory content
- Place vocabulary BEFORE instructions so routing is established before execution begins

### Attention-optimized ordering

Tokens at the beginning and end of context receive disproportionately strong attention (U-shaped curve). Tokens in the middle receive less.

- Front-load vocabulary and routing signals
- Place retrieval anchors (natural-language queries the skill answers) at the end
- Keep `SKILL.md` under 500 lines so the middle is never too far from either edge
- Use numbered steps and IF/THEN conditions in the middle — structured format survives the attention dip

### Negative constraint steering

Without constraints, output gravitates to the statistical center of training data — the most generic, average version. Anti-patterns create pressure away from the center.

- Every skill needs both positive instructions and negative constraints
- Name anti-patterns with established terms when they exist
- Include detection signals and resolution steps — flagging without fixing is noise
- Place anti-patterns BEFORE behavioral instructions so the model checks before acting

### Few-shot examples

2–3 well-chosen examples outperform paragraphs of instruction. The model matches demonstrated patterns more reliably than it parses complex verbal rules.

- Use BAD vs GOOD pairs for quality standards, input-to-output pairs for workflows
- Cover different cases including at least one hard case
- Place the most representative example last (recency bias gives it the strongest influence)
- Don't exceed 3 examples — diminishing returns

### Dual-register descriptions

The ~100 words of YAML description are the most important tokens in the entire skill.

- Expert terms for routing to deep knowledge + casual phrases for reliable activation
- Be pushy — models undertrigger. Include synonyms, edge cases, adjacent scenarios
- Explicit exclusions: "Do NOT use for X" prevents mis-triggers
- Test with colloquial queries: if the skill doesn't fire on "help me with [casual version]," the description needs more casual register

### Rationale in instructions

A rule without explanation is brittle — it covers only literal matches. A principle with reasoning is generalizable. For every non-obvious behavioral instruction, include the reasoning (WHY). "Place vocabulary BEFORE instructions because it primes the routing signal before execution begins" is generalizable. "Place vocabulary first" is a dead rule.

## Anti-pattern watchlist

Scan every generated SKILL.md against this list before delivery.

### 1. Consultant-speak vocabulary
**Detection:** Vocabulary contains terms like "best practices," "leverage," "synergy," "robust solution." Fails the 15-year practitioner test.
**Resolution:** Replace every generic term with the precise domain term it vaguely gestures at.

### 2. Over-prompting
**Detection:** SKILL.md exceeds 500 lines. Same concept stated multiple times. Hedging phrases ("you might want to consider").
**Resolution:** State each instruction once, in imperative form. Remove hedging. Move heavy content to `references/`.

### 3. Positive-only instructions
**Detection:** Zero "do NOT" or "avoid" guidance. No anti-pattern section. Only describes what to do.
**Resolution:** Add 5–10 domain-specific anti-patterns with detection signals and resolution steps.

### 4. Single-register description
**Detection:** Description uses only formal terminology OR only casual language.
**Resolution:** Rewrite with both expert terms and natural-language trigger scenarios.

### 5. Edge-case stuffing
**Detection:** More than 15 specific edge-case rules. Long "if X then Y" lists instead of pattern demonstrations.
**Resolution:** Replace with 2–3 diverse canonical examples that show the pattern. Let the model generalize.

### 6. Paragraph-form logic
**Detection:** Multi-step behavior described in prose paragraphs. No numbered steps, no IF/THEN conditions.
**Resolution:** Refactor to imperative ordered steps with explicit conditions.

### 7. Missing examples
**Detection:** Zero input-to-output examples or BAD/GOOD pairs. The skill relies entirely on verbal instructions.
**Resolution:** Add 2–3 diverse examples. Place the strongest last.

### 8. Overlapping skill boundaries
**Detection:** Ambiguous triggers that overlap with sibling skills. No explicit exclusions.
**Resolution:** Add explicit exclusions. Define boundaries generically instead of pointing outside the folder.

### 9. Description-as-opening-paragraph
**Detection:** The body opens with a purpose paragraph that merely restates the frontmatter description.
**Resolution:** Start the body with owned surface, routing, defaults, or operating rules.

### 10. Scattered repetition
**Detection:** Same guidance appears in root and secondary files, or across sibling skills.
**Resolution:** State each rule once. In root if globally relevant; in secondary if conditional.

## SKILL.md section ordering

Optimal ordering for prescriptive skills, based on attention characteristics:

1. **YAML frontmatter** — triggering surface; most important tokens
2. **Expert vocabulary payload** — primes routing before execution begins
3. **Anti-pattern watchlist** — model checks for problems before acting
4. **Behavioral instructions** — structured format survives mid-attention dip
5. **Output format** — defines the shape of success
6. **Examples** — recency bias strengthens the last example
7. **Questions this skill answers** — retrieval anchors benefit from end-position attention

Thinking skills may replace the vocabulary payload with principles/questions and a scenario matrix. Reference skills may replace behavioral instructions with a routing index. Adapt the ordering to the dominant mode, but preserve the front-load/back-load attention principle.

## Root vs secondary files

`SKILL.md` should always contain the globally relevant rules, the dominant mode and boundaries, the owned surface, how to route deeper, and how to finish or validate.

Move content into secondary files only when it is not always relevant:

- Scenario-specific depth
- Domain- or variant-specific detail
- Large source material requiring selective routing
- Optional examples or catalogs that would bloat the root

If a file would be used on every invocation, merge it back into `SKILL.md`. One concern per secondary file. Do not split just to chase smaller files; split when it reduces context load and overlap. Keep each reference file under 300 lines.

## Standalone and split rules

Every skill must stand on its own, even if it has a complement elsewhere.

- Explain owned surface, non-goals, and routing inside the skill itself
- Never link to skills or assets outside the skill's own folder
- If adjacent surfaces matter, describe the boundary generically
- Split one skill into several only when the user should make a meaningful choice before loading detail
- If siblings would share large parts of the same prose, the split is probably wrong or the shared content should be duplicated inside each skill as needed

## Writing rules

- Distill; do not copy prompts, commit history, transcripts, or docs into final instructions
- Keep conclusions, not provenance
- If the source spans time, analyze chronologically — let later stable guidance override earlier obsolete guidance
- State stable defaults when they exist
- Use proper Markdown file links with destinations relative to the containing file: `references/file.md` from root, `../foundation/context.md` from a nested reference, `sibling.md` for a sibling file
- Do not link to directories, use bare paths, or use repo-root paths for local files
- Use examples only when they remove ambiguity faster than prose; keep them short and representative
- If examples start carrying the real rules, move those rules into instructions
- Do not open the body with a purpose paragraph that merely repeats the description
- Do not repeat the same guidance in root and secondary files or across sibling skills

## Authoring workflow

1. Extract intent from the conversation, files, examples, or source history. Ask the user only when missing information materially changes scope or behavior. IF the request is vague: ask 1–2 clarifying questions about domain, trigger scenarios, and expected output.
2. Identify the owned surface, dominant mode, explicit non-goals, and what is universally relevant.
3. IF unfamiliar domain: research before drafting. Use web search or codebase exploration. Identify 15–30 expert terms that pass the 15-year practitioner test and 5–10 domain anti-patterns with established names.
4. Decide what belongs in root vs secondary files.
5. Draft in the dominant mode using the matching root shape and the section ordering above.
6. Write the dual-register description (~100 words). Include expert terminology AND natural-language trigger scenarios. Include explicit exclusions.
7. Write 2–3 diverse examples (BAD vs GOOD or input-to-output). Place the strongest last.
8. Use subagents for large independent research surfaces, not for overlapping authorship. One agent should do the final synthesis.
9. Tighten the draft until each section is unambiguous, non-repetitive, and worth loading into context.
10. Scan the generated SKILL.md against the anti-pattern watchlist. Fix any violations.
11. Validate: run `python -m scripts.quick_validate <path-to-skill>`. Check that the skill is standalone, description is triggerable, links resolve, overlap is minimal.
12. Package only if the user asked for a distributable artifact: `python -m scripts.package_skill <path/to/skill-folder>`.

## Updating existing skills

- Preserve the existing `name` and directory unless the user explicitly wants a rename
- Remove stale or conflicting sections instead of stacking new guidance on top
- Re-check every referenced file path after moving or splitting content
- If the installed skill is read-only, edit a copy in `/tmp/` and package from there

## Examples

### BAD vs GOOD description

**BAD:**
```yaml
description: "Helps with code review."
```
Single-register. Not pushy. No expert terms. No trigger scenarios. No exclusions. Will almost never fire, and when it does, it will produce generic output.

**GOOD:**
```yaml
description: |
  Performs structured code review using cyclomatic complexity analysis,
  connascence taxonomy (Page-Jones), and conventional comments (Slaughter).
  Use when the user asks to review code, check a PR, look at changes, or
  says "is this good?" about code — even if they don't say "review."
  Also triggers for diff feedback, merge request review, and pre-commit
  quality checks. Do NOT use for architecture decisions (use Decision
  Advisor) or writing new code (use Code Generator).
```
Dual-register. Expert terms route to deep knowledge. Casual triggers ensure activation. Explicit exclusions prevent mis-triggers.

### BAD vs GOOD vocabulary payload

**BAD:**
```markdown
## Domain Vocabulary
good code, clean code, readable, maintainable, well-tested
```
Generic terms. Fails the 15-year practitioner test. Routes to introductory content.

**GOOD:**
```markdown
## Expert Vocabulary Payload

**Structural Analysis:** cyclomatic complexity (McCabe), cognitive
complexity (SonarSource), afferent/efferent coupling (Martin),
connascence (Page-Jones)

**Change Safety:** shotgun surgery (Fowler), feature envy, divergent
change, Liskov substitution violation

**Review Process:** conventional comments (Slaughter), ship/no-ship
framework, diff review vs design review, LGTM criteria
```
Precise terms in clusters. Named frameworks with originators. Every term passes the 15-year practitioner test.

## Questions this skill answers

- "Create a skill for [domain/task]"
- "Build a skill that [does X]"
- "I want the agent to always [behavior] when [trigger]"
- "Make a reusable [domain] helper"
- "How do I create a good skill?"
- "Turn this workflow into a skill"
- "Split this skill into smaller pieces"
- "Merge these skills together"
- "My skill isn't triggering, how do I fix it?"
- "How should I structure a SKILL.md?"
- "Review this skill for quality"
- "Package this as a distributable skill"
- "What makes a skill effective?"
- "Turn these docs into a skill"
