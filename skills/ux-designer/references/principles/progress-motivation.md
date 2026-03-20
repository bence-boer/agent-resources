# Principle — Progress & Motivation

Governs how the interface sustains engagement and drives task completion. Integrates Goal-Gradient Effect (effort increases near completion), Zeigarnik Effect (incomplete tasks persist in memory), and Parkinson's Law (tasks expand to fill available time).

## Use when

Any design involves multi-step processes, progress tracking, onboarding, or time-bounded tasks.

## Route next

- [cognitive-load.md](cognitive-load.md) — to manage per-step information burden
- [feedback-perception.md](feedback-perception.md) — to design peak moments within the flow
- [decision-architecture.md](decision-architecture.md) — to structure per-step choices

## Rules

- Show progress whenever a task has more than 2 steps. Progress indicators (bars, step counts, checklists) increase completion rate.
- Users accelerate as they approach completion. Front-load easy steps and back-load complex ones only when the user's commitment is established. Never place the hardest step last.
- Artificial progress (e.g., starting a progress bar at 20% or pre-completing the first step) increases engagement. Use when onboarding new users.
- Incomplete tasks persist in the user's mind. Use this constructively: save drafts, show "continue where you left off", display partial progress on dashboards.
- Constrain time-based tasks to expected completion duration. A 10-minute form should not present as an open-ended task. Show estimated time or set expectations.
- Provide visible content beyond the current scroll position (partial items, truncated cards, peeking elements) to signal more content exists without requiring explicit pagination.
- Break long operations into visible increments. A 60-second operation shown as 10 completed sub-steps feels faster than a single spinner for 60 seconds.

## Questions

- At which step in the process is abandonment most likely, and what intervention reduces it? (e.g., mid-form fatigue → save draft option, complex step → inline help, long wait → progress detail)
- Does the progress indicator accurately represent remaining effort, or does it mislead? (e.g., 5 steps but step 4 takes 10× longer than others, percentage bar that stalls at 90%)
- Where can artificial progress or pre-population reduce the perceived effort to start? (e.g., pre-filled form fields, auto-detected defaults, completed setup step, imported data)
- What content or information hints at more without requiring explicit "load more" actions? (e.g., partially visible next card, truncated preview, scroll-dependent reveal, count badge)
