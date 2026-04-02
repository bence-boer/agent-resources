---
name: skill-creator
description: Create, split, rewrite, and validate standalone Markdown skills in any domain. Use for any `SKILL.md` work - new skills, skill refactors, skill splits, turning docs/history/examples into a skill, tightening frontmatter and descriptions, or validation and packaging. Produces concise, dry, information-dense, comprehensive skills with explicit boundaries and minimal overlap.
---

# Skill Creator

Create standalone skills that are easy to trigger, easy to load, and hard to misuse.

## Anatomy of a skill

A skill is a directory containing a `SKILL.md` plus optional secondary files.

```text
skill-name/
├── SKILL.md            # required — frontmatter + Markdown body
├── references/         # docs, guides, examples loaded selectively
├── scripts/            # executable utilities for deterministic tasks
└── assets/             # templates, icons, or other output files
```

**Frontmatter** (YAML block between `---` delimiters at the top of `SKILL.md`) requires `name` and `description`. All other fields are optional.

**Three loading levels** — only the relevant level is loaded into context:

1. `name` + `description` — always in context, drives skill discovery and triggering
2. `SKILL.md` body — loaded when the skill is invoked
3. Secondary files — loaded on demand, only when the agent routes to them

Keep the `SKILL.md` body worth loading by default. Push depth into secondary files only when it is genuinely conditional.

The `description` should carry the skill's condensed purpose and activation trigger. The body should start with owned surface, routing, defaults, or operating rules instead of repeating the description as an opening purpose paragraph.

## What this skill owns

Use this skill for:

- creating or rewriting skills in any domain: software, design, research, writing, operations, analysis, education, or mixed workflows
- splitting one skill into multiple complementary skills or merging an over-fragmented set back into one
- turning docs, prompts, history, examples, transcripts, or working practices into a reusable skill
- reviewing descriptions, boundaries, routing, structure, references, examples, finish criteria, and packaging

This skill is about authoring skills. If the user wants some other artifact, use this skill only when the result should itself be a skill.

## Outcome standard

These properties apply both to this skill and to every skill it authors or refines:

- dry, factual, standalone language; no motivational filler, no process commentary, no conversation context
- concise but comprehensive: every section must route, constrain, default, clarify, or validate
- root-first design: anything relevant on every invocation belongs in `SKILL.md`
- secondary files only for conditional depth: scenario, domain, variant, catalog, large source docs, or optional examples
- standalone skills only: never link to skills or assets outside the skill's own folder
- strong concern boundaries: minimal overlap between sibling skills and between root vs secondary files
- decisive guidance: do not leave goals so broad that almost any choice can be justified
- triggerable frontmatter: the description must say what the skill does and when it should activate
- generality without vagueness: reusable across the intended domain, not overfit to one example
- dominant-mode structure: thinking, prescriptive, and reference skills should not read the same

## First classify the job

| If the user wants...                                       | Do this                                                                                                    |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| a new skill                                                | choose the dominant mode, define the owned surface, then design structure before writing                   |
| an existing skill improved                                 | preserve the name, remove drift, tighten boundaries, and rewrite stale sections instead of layering on top |
| one skill split or several skills merged                   | define ownership boundaries first, then decide what genuinely belongs together                             |
| docs, prompts, history, or examples distilled into a skill | analyze chronologically when time matters, keep stable conclusions, and do not mirror the source blindly   |
| validation or packaging only                               | validate first; package only if requested                                                                  |

## Then choose the dominant mode

Most skills are built in one dominant mode. A skill may borrow a little from a second mode, but the root file must clearly lead with one.

### Thinking skill

Use when the skill should improve judgment across many scenarios rather than prescribe one fixed way of doing the work.

Root usually contains:

- routing order or scenario matrix
- short principles, questions, or decision lenses
- finish or self-review criteria

Prefer questions, invariants, discriminating matrices, and compact prescriptions.

Avoid file-level detail, giant singleton files, and vague philosophy that cannot rule anything out.

### Prescriptive skill

Use when the skill should tell the agent how to perform recurring work, create a defined artifact, follow a stable format, or apply defaults on a known surface.

This mode also covers builder or process skills such as skill creation, reporting, auditing, planning, formatting, and workflow execution.

Root usually contains:

- what the skill owns and what it does not own
- routing by task or surface if needed
- defaults, rules, thresholds, process steps, or output expectations

Prefer ownership rules, defaults, checklists, thresholds, and clear format contracts.

Avoid broad goals with no defaults, or turning a prescriptive skill into an open-ended theory document.

### Reference skill

Use when the main job is to make a large knowledge base, manual, catalog, or external system usable inside the agent.

Root usually contains:

- key facts that change how the source should be read
- a routing matrix, index, or topic map
- local conventions or caveats

Prefer thin routing plus curated depth.

Avoid rewriting the whole source into prose or leaving a raw dump with no navigation layer.

## Root vs secondary files

`SKILL.md` should always contain:

- the globally relevant rules
- the dominant mode and boundaries
- the owned surface and non-goals when relevant
- how to route deeper
- how to finish or validate

Move content into secondary files only when it is not always relevant.

Good reasons to split:

- scenario-specific depth
- domain- or variant-specific detail
- large source material that must be routed selectively
- optional examples or catalogs that would bloat the root

If a file would be used on every invocation, merge it back into `SKILL.md`.

One concern per secondary file. Do not split just to chase smaller files; split when it reduces context load and overlap.

## Standalone and split rules

Every skill must stand on its own, even if it has a complement elsewhere.

- explain the skill's owned surface, non-goals, and routing inside the skill itself; rely on the `description` for the condensed purpose and activation trigger
- never link to skills or assets outside the skill's own folder
- if adjacent surfaces matter, describe the boundary generically instead of pointing outside the folder
- split one skill into several only when the user should make a meaningful choice before loading detail
- if sibling skills would share large parts of the same prose, the split is probably wrong or the shared truth should move into a file inside each skill as needed

## Writing rules

- Distill; do not copy prompts, commit history, transcripts, or docs into the final instructions.
- Keep conclusions, not provenance.
- If the source spans time, analyze it in chronological order and let later stable guidance override earlier obsolete guidance.
- If a stable default exists, state it.
- If several valid paths exist, use the smallest useful routing matrix or question set.
- Use proper markdown file links with destinations relative to the file that contains the link when referring readers to another local skill file: `references/file.md` from the root skill file, `../foundation/context.md` from a nested reference file, or `review.md` for a sibling file.
- Do not leave internal navigation references as bare paths or wrapped only in backticks such as `file.md` or `references/file.md`.
- Do not use site-root or repo-root destinations like `/docs/...` or `/skills/...` for local skill files.
- Do not link to directories. If you need to mention a folder such as `references/principles/`, name it in prose instead.
- Use examples only when they remove ambiguity faster than prose; keep them short and representative.
- If examples start carrying the real rules, move those rules into the instructions.
- Do not make every skill sound like a thinking skill if the user actually needs defaults or reference routing.
- Do not open the body with a purpose paragraph that merely repeats the `description`.
- Do not repeat the same guidance in the root and in secondary files.
- Do not repeat the same guidance across sibling skills unless local repetition prevents a likely misuse.

## Description rules

The `description` field is the skill's discovery surface. It should:

1. name the capability in concrete terms
2. condense the skill's purpose into one or two factual clauses
3. say when to use the skill
4. differentiate it from nearby skills only when that prevents overlap or misfires

Bad descriptions are generic, vague, or keyword-stuffed. Good descriptions are capability-first and trigger-rich.

## Minimal root shapes

Use these as starting patterns.

- Thinking skill root: routing order -> core questions or principles -> scenario matrix if needed -> finish review
- Prescriptive skill root: what it owns -> non-goals if needed -> routing by task or surface -> defaults or workflow -> output expectations
- Reference skill root: key facts -> routing matrix or index -> local conventions or caveats

If a skill mixes modes, the root should still read clearly as one of the three shapes above.

## Authoring workflow

1. Extract intent from the conversation, files, examples, or source history first. Ask the user only when missing information materially changes scope or behavior.
2. Identify the owned surface, dominant mode, explicit non-goals, and what is universally relevant.
3. Gather source material narrowly. If the source spans time, read it in chronological order and let later stable patterns override earlier ones.
4. Decide what belongs in the root and what is truly conditional enough for a secondary file.
5. Draft in the dominant mode using the matching root shape.
6. Use subagents for large independent research surfaces, not for overlapping authorship. One agent should do the final synthesis.
7. Tighten the draft until each section is unambiguous, non-repetitive, and worth loading into context.
8. Validate. Package only if the user asked for a distributable artifact.

## Updating existing skills

- Preserve the existing `name` and directory unless the user explicitly wants a rename.
- Remove stale or conflicting sections instead of stacking new guidance on top of them.
- Re-check every referenced file path after moving or splitting content.
- If the installed skill is read-only, edit a copy in `/tmp/` and package from there.

## Validate and package

Before handing the skill back:

1. Run `python -m scripts.quick_validate <path-to-skill>`.
2. Check that the description is clear and triggerable.
3. Check that the root `SKILL.md` is worth loading by default and contains all globally relevant rules.
4. Check that the skill is standalone and does not reference anything outside its own folder.
5. Check that overlap is minimal and no important user requirement was lost during distillation.
6. Check that every referenced file path resolves from the file that contains the link.
7. If the user wants an installable artifact, run `python -m scripts.package_skill <path/to/skill-folder>`.
8. Report the final skill path and packaged `.skill` path if one was created.
