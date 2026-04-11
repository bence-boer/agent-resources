# Job-Search Artifacts and Asynchronous Proof

Read this file when the user needs better resumes, LinkedIn positioning, GitHub proof, portfolio curation, or a stronger public signal for hiring loops.

## Resume Rules

- Target one role at a time. A diffuse identity weakens both ATS matching and recruiter comprehension.
- Use a simple, machine-readable layout: no tables, columns, graphics, icons, or text embedded in images.
- Keep the section order obvious: contact, summary, core skills, experience, projects, education, certifications.
- Default to one page unless the user has more than roughly ten years of highly relevant experience.
- Use standard fonts such as Arial, Calibri, or Aptos, and verify the exported resume copy-pastes cleanly or survives an ATS-style parser check before sending.
- Rewrite bullets as **action + scope + metric + business result**.
- Align keywords to the target role naturally. Do not keyword-stuff.

## Bullet Rewrite Formula

Turn weak bullets like:

- "Worked on API performance improvements"

Into stronger bullets like:

- "Reduced API p95 latency by 34% by introducing response caching and query-plan cleanup, which cut checkout abandonment during peak traffic."

## Artifact Ecosystem

| Node | What it proves | Standard |
| --- | --- | --- |
| Resume | fit for one role and business impact | quantified bullets and clean parsing |
| LinkedIn | discoverability for recruiters | precise headline, role-aligned keywords, Featured section used intentionally |
| GitHub profile README | visible technical identity | clear summary, pinned repos, proof of current focus |
| Repositories | engineering credibility | clean history, strong README, setup instructions, architecture notes, live or demo links when possible |
| Portfolio / case studies | curated end-to-end narrative and product taste | 2-4 strong case studies with screenshots or demo, role/context, constraints, decisions, measurable outcome, and links to code or live artifact |
| Blog posts | depth and explanatory ability | detailed problem breakdowns, not generic listicles |

## Positioning Rules

- Prefer "Senior Backend Engineer - Python, data pipelines, distributed services" over "Software Engineer."
- Show only 3-5 strong projects; weak or stale repos dilute credibility.
- Standalone portfolios are optional for many backend and infrastructure roles; use them when curated case studies or product presentation matter more than raw repository proof.
- Use public artifacts to prove depth, not to perform constant self-promotion.
- Optimize consistency across resume, LinkedIn, and GitHub. Recruiters should see one coherent story.

## When Callbacks Are Low

Diagnose in this order:

1. wrong target role
2. ATS-hostile formatting
3. weak keyword alignment
4. responsibility-only bullets
5. weak GitHub or portfolio proof
6. applying to roles above or outside the demonstrated scope

## Example: Turning raw notes into stronger proof

**Input:**
"Can you turn these notes into two resume bullets? I reduced API latency by 34%, moved deploys to GitHub Actions, and mentored two junior developers."

**Good response shape:**

```markdown
## Career Diagnosis
**Track / Stage:** external job search
**Primary Objective:** artifact lift
**Key Constraint:** the raw notes have impact, but they are not yet framed as recruiter-readable proof

## Leverage Map
- **Visibility / proof:** strong raw outcomes, weak current packaging
- **Organizational impact:** the notes already show speed, reliability, and mentoring value

## Deliverable
- Reduced API p95 latency by 34% by tightening query paths and response handling, improving application responsiveness for production users.
- Replaced manual deploy steps with GitHub Actions and mentored two junior engineers through the rollout, improving release consistency while raising team execution capacity.

## Next Moves
1. Tailor the verbs and nouns to the specific role you are targeting.
2. Keep the strongest quantified bullets in the top half of the resume.
3. Make sure LinkedIn and GitHub reinforce the same story.

## Proof to Gather
- any scale number attached to the API work: traffic, users, or service criticality
- release-frequency or failure-rate changes after the CI move
- examples of mentoring impact beyond the migration itself
```

## Coaching Moves

- If the user has strong work but weak framing: rewrite bullets and headline first.
- If the user lacks proof: curate projects, README quality, and visible artifacts before more applications.
- If the target role changed: rebuild the story around that role instead of adding every skill they have.
