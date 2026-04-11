# Company Diagnostics and Engineering Culture

Read this file when the user asks whether to join a team, how to evaluate engineering maturity, or what questions reveal a healthy software organization.

## Engineering Health Checklist

| Pillar | Healthy signal | Red flag |
| --- | --- | --- |
| Deployment flow | elite teams can often move from commit to production in under 15 minutes; even when not elite, engineers can still ship safely the same day via automated CI/CD, small batches, and minimal manual approval | releases are rare, manual, and politically heavy |
| Branch strategy | trunk-based development; branches usually live less than a day | long-lived feature branches and painful merges |
| Review culture | small PRs, usually below roughly 200 LOC equivalent, with reviews usually back within 24 hours and focused on logic | giant PRs, review latency, mostly style comments |
| Blocker handling | blocked engineers get pairing, escalation, or system fixes quickly and predictably | blockers linger, depend on heroics, or trigger blame |
| Infrastructure | Infrastructure as Code reviewed like application code | manual infra changes with weak audit trail |
| Developer self-service | platform golden paths reduce ticket waiting; a new engineer can ideally ship safely on day one, and should not need a ticket queue for routine work | developers depend on ops queues for routine work |
| Security | shift-left checks: SAST, SCA, secrets, container scans | security appears only near release or after incidents |
| Reliability | explicit SLOs, error budgets, observability, on-call expectations, and blameless postmortems | outages are handled ad hoc and blamed on individuals |
| Technical debt | explicit recurring capacity allocation, often around 20-25 percent, and named owners | "we will fix it later" with no budget or owner |
| AI code use | human review and scanning are stricter when AI is used | AI output is trusted by default and shipped uninspected |

## Employer-Evaluation Question Bank

Use these when the user needs reverse-interview questions to assess a manager or team:

- When code is ready, how long does commit-to-prod usually take?
- Walk me through the last production deploy from merge to release.
- How do you release incomplete work safely - feature flags or something equivalent?
- How long do branches usually live before merge?
- What is the normal review turnaround time for a PR?
- What are your SLOs, and what happens when they are missed?
- How often are engineers on call, and what does a bad week look like?
- How do you balance technical debt against feature work?
- What happens when a developer is blocked for multiple days?
- What do postmortems look like after an incident?
- How quickly can a new engineer ship safely - can it happen on day one?
- How do developers provision services or ship code without waiting on tickets?
- What security checks run before code reaches production?
- How do you use AI coding tools, and what extra review standards do you apply?

## Decision Heuristics

- Favor teams that can explain their delivery system quantitatively.
- Distinguish elite signals from acceptable hygiene: under-15-minute commit-to-prod and day-one shipping are unusually strong positive evidence.
- Favor managers who respond to blocked engineers with pairing, mentoring, or system fixes - not blame.
- Discount superficial perks when the delivery system is visibly slow or brittle.
- Score the hiring team first, then adjust only if you have multiple org-wide signals.
- Treat documentation hostility as a major warning sign in regulated domains.

## Simple Scoring Model

Score in two buckets, then interpret team score first:

- **Team score:** deployment flow, branch strategy, review culture, blocker handling, and technical debt
- **Org support score:** infrastructure, developer self-service, security, reliability, and AI code use

For each answered item, use:

- **0:** absent or clearly unhealthy
- **1:** partially present, inconsistent, manager-dependent, or described only at policy level
- **2:** normal operating discipline backed by a recent concrete example, metric, or specific operating detail
- **N/A / unknown:** no evidence beyond assertion; exclude from the average

Do not interpret an overall result until at least 5 signals are answered, including at least 4 team-local signals and a scored blocker-handling signal. Do not call the environment strong until at least 2 org-support signals are also answered. Otherwise mark the result provisional and keep probing.

Interpretation:

- **Team average 1.6-2.0 with blocker handling scored 2 and org support average at least 1.5 across 2 or more answered org-support signals:** strong hiring environment
- **Team average 1.0-1.5, or strong team score with weak org support, thin org-support evidence, or blocker handling scored 1:** mixed; investigate the weakest answered signals before accepting
- **Team average below 1.0, or blocker handling scored 0:** high risk of stagnation, burnout, or avoidable chaos

## AI-Specific Caveat

AI coding tools can increase local speed while degrading system stability if review, security scanning, and maintainability discipline do not increase with them. Treat "we use AI heavily" as neutral until the team can explain the guardrails.
