# Discovery

Frameworks for understanding users, defining problems, and designing engagement. Use when structuring research, writing JTBD statements, building opportunity trees, or designing retention loops.

## Opportunity Solution Tree (OST)

A hierarchy that connects a measurable outcome to user opportunities, candidate solutions, and testable assumptions.

### When to use

- Starting discovery for a new outcome or metric
- Structuring qualitative research findings
- Deciding which solution to test first

### How to build one

1. Define a **specific, measurable outcome**. Reject vague goals. "Reduce onboarding drop-off from 60% to 40%" works. "Improve engagement" does not.
2. Identify the **user segment** this outcome applies to.
3. Map **3–5 opportunities** — unmet needs or pain points, not solutions. "Reduce form friction" is an opportunity. "Redesign the form" is a solution.
4. For each opportunity, list **2–3 candidate solutions**.
5. For each solution, surface **assumptions** that must hold for it to work. Tag assumptions as testable.
6. Identify **kill-assumptions** — if false, the whole opportunity is invalid. Test these first.

### Output template

```
Outcome: [specific + measurable]
User Segment: [who benefits]
Success Metric: [how we measure it]

## Opportunity 1: [name]
Why it matters: [evidence or user quote]

| Solution | Assumptions | Kill-Assumption? |
|----------|-------------|------------------|
| A | 1. … 2. … | Yes/No |
| B | 1. … 2. … | Yes/No |

Best bet: [which solution first + why]
Next step: [experiment to run]

## Opportunity 2: [name]
[same structure]

## Cross-Opportunity Risks
- Conflicts between opportunities?
- Resource constraints blocking parallel pursuit?
- Dependencies requiring sequencing?
```

### Anti-patterns

- Vague outcomes that can't be measured
- More than 5 opportunities (analysis paralysis)
- Solutions disguised as opportunities
- Untestable assumptions ("users will like this")
- Skipping kill-assumptions and wasting time on invalidated paths

---

## Jobs-to-be-Done (JTBD)

A statement format that captures why a user hires a product — the situation, motivation, and desired outcome — independent of any specific solution.

### When to use

- Defining what problem a feature actually solves
- Prioritizing between competing feature requests
- Writing acceptance criteria grounded in user intent
- Evaluating whether a product serves its stated purpose

### How to write one

1. Identify the **situation** — the specific context and trigger. Not "they open the app" but "they have 15 unread messages at 8am."
2. Identify the **user type** by functional role, not demographics. Not "busy professional" but "person triaging incoming requests."
3. State the **motivation** — the progress they want. This is never a feature. "Understand priority quickly" not "see email preview."
4. State the **outcome** — the measurable result. "Respond to urgent items within 30 min" not "scan inbox."

### Statement format

```
When [situation: specific context and trigger],
[user type: functional role]
wants to [motivation: progress they seek],
so they can [outcome: measurable result].
```

### Validation checklist

- Would they hire a competitor if it did this job better? (If no, you described a feature, not a job)
- Is the motivation independent of any specific solution?
- Does this job exist without your product?
- Can you name substitute products (competitors, manual workarounds, or adjacent tools)?
- What competing demands (contra-jobs) prevent them from hiring your solution?

### Anti-patterns

- Describing a feature instead of a motivation
- Statements so broad they apply to every product ("users want to save time")
- Mixing multiple situations into one statement
- Ignoring substitute products and competing behaviors

---

## Product Kata

A four-step loop for navigating from strategic direction to the next concrete action. Derived from lean methodology — useful when the team is stuck or scope is unclear.

### When to use

- Team doesn't know what to build next
- Gap between strategic goals and daily work
- Need to decide between problem exploration, solution exploration, or optimization

### The four steps

1. **Direction.** What is the strategic goal? State it as a measurable position, not a slogan.
2. **Current state.** What are the baseline metrics right now? Use actual data, not estimates. Include the data source and when it was collected.
3. **Target state.** What measurable change do we want within a fixed timeframe (typically 90 days)? Be realistic — 20% improvement may be ambitious enough.
4. **Next step.** Choose exactly one process:
   - **Problem exploration** — we don't know what's causing the gap → run user research
   - **Solution exploration** — we have hypotheses → test them quickly
   - **Optimization** — we know the solution works → improve its performance

### Output template

```
Strategic Direction: [measurable position]
Time Horizon: [e.g., 90 days]

Current State:
| Metric | Value | Source | Collected |
|--------|-------|--------|-----------|
| … | … | … | … |

Target State:
| Metric | Target | Rationale | Confidence |
|--------|--------|-----------|------------|
| … | … | … | High/Med/Low |

Lever: [specific change area]
Hypothesis: If we [action], then [outcome], because [assumption].
Kill-assumption: [the one thing that invalidates everything]

Process: [ ] Problem exploration  [ ] Solution exploration  [ ] Optimization

Success signal: [what we'd see if this works]
Failure signal: [what we'd see if this doesn't work]
Decision rule: If [X], commit. If [Y], pivot.
```

### Anti-patterns

- Guessing baselines instead of measuring them
- Pulling multiple levers simultaneously
- Ambiguous success criteria ("gets better")
- Picking optimization when the problem isn't understood yet
- Disconnecting the lever from the strategic direction

---

## Engagement Loop Design (Hooked Model)

A four-phase cycle for building recurring product usage: Trigger → Action → Variable Reward → Investment. Use for retention and habit-forming features.

### When to use

- Designing onboarding flows meant to convert to habitual use
- Diagnosing why users try a feature once but don't return
- Planning notification or re-engagement strategy

### How to design a loop

1. **Name the loop.** Be specific. "Daily check-in" or "weekly review ritual" — not "engagement."
2. **Trigger.** External (push notification, email) or internal (boredom, anxiety, curiosity). State what, when, to whom, and at what frequency.
3. **Action.** The minimum behavior after the trigger. Target under 30 seconds and under 3 taps/clicks. If it takes longer, simplify.
4. **Variable reward.** The payoff must be unpredictable — rotate between content types, social signals, or progress markers. Predictable rewards kill habits.
5. **Investment.** What users put back in (time, data, customization, social connections). Investment raises switching costs and improves the next cycle.

### Output template

```
Loop Name: [e.g., "Daily Check-in"]
User Segment: [who]
Goal: Increase [metric] from [baseline] to [target]

Trigger:
- Type: External / Internal
- Cue: [what it says/shows]
- Timing: [when and how often]

Action:
- Path: [step 1] → [step 2] → [done]
- Target: < 30 sec, < 3 interactions

Variable Rewards (rotate):
- [reward type 1] — frequency %
- [reward type 2] — frequency %
- [reward type 3] — frequency %

Investment:
- [what users put in: time, data, social, customization]

Friction audit:
- Any step > 2 clicks deep?
- Any loading > 3 seconds?
- Any text > 10 words per screen?

Loop metrics:
- Trigger delivery rate
- Action completion rate
- Recurrence rate (24h / 7d)
- Investment depth

Ethics check:
- Does this serve a real user need or just extract attention?
- Would users still engage if triggers stopped?
- Would users approve if they knew the design intent?
```

### Anti-patterns

- Predictable rewards (same thing every time)
- Actions with too much friction (>30 sec = not a habit)
- Over-frequent triggers (multiple per day = spam = uninstall)
- No investment step (users enter but never commit)
- Manipulative design that extracts attention without serving a real job

---

## Behavioral Bias Checklist

Five biases that commonly affect product decisions around pricing, onboarding, conversion, and feature adoption. Use as a review step before shipping changes to user-facing flows.

### The biases

| Bias | Mechanism | Check question |
| --- | --- | --- |
| **Default** | Users pick the pre-selected option | What's our default? Is it aligned with user benefit and business goal? |
| **Loss aversion** | Losing feels worse than gaining feels good | Are we framing this as a gain or a loss? Which fits this audience? |
| **Social proof** | People follow others' visible behavior | What peer behavior or numbers do users see? Is it specific? |
| **Decoy effect** | A dominated option makes another look better | Are our options structured so one is the obvious choice? |
| **Anchoring** | The first number seen sets the reference point | What's the first number or reference point users encounter? |

### How to use

1. Name the decision or change being shipped.
2. For each bias, assess the current state — is it present, helping, or hurting?
3. For each relevant bias, decide: amplify (it helps), neutralize (it manipulates), or skip (not relevant).
4. Define the metric that proves the nudge worked and a decision rule for keeping or reverting it.

### Output template

```
Decision: [what's changing]
Target: [who's affected]
Goal: [metric + target]

| Bias | Current State | Action | Change | Metric | Decision Rule |
|------|---------------|--------|--------|--------|---------------|
| Default | [current default] | Amplify/Neutralize/Skip | [change] | [metric] | Keep if X, revert if Y |
| Loss Aversion | [current framing] | … | … | … | … |
| Social Proof | [what users see] | … | … | … | … |
| Decoy | [current options] | … | … | … | … |
| Anchoring | [first reference] | … | … | … | … |

Focus on: [1-2 most relevant biases for this decision]

Ethics check:
- Would users approve if they knew about this nudge?
- Is this reversible?
- Are we serving users or exploiting them?
```

### Anti-patterns

- Applying all five biases simultaneously instead of focusing on the 1–2 that matter
- No measurement plan — applying a nudge and never checking if it worked
- Assuming biases apply uniformly across segments (they don't — test with your users)
- Missing a decision rule for when to revert
- Treating bias exploitation as a substitute for solving a real user problem
