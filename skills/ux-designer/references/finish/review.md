# Finish — Review

## Use when

Before finalizing any design decision, handoff, or implementation.

## Questions

- Does this design comply with every absolute rule in [SKILL.md](../../SKILL.md)? (Check each of the 15 rules against the current design: feedback timing, single primary action, grouping, chunking, async states, input preservation, target sizes, positioning, defaults, color independence, destructive placement, recognition over recall, flow interruption, recommended defaults, status visibility.)
- What is the weakest state in the design (empty, error, loading, edge case), and is it fully designed or merely assumed to work? (Test: what does this look like with 0 items, 1 item, 100 items, an error, a timeout?)
- If a user encountered this design for the first time with no introduction, could they complete the primary task without confusion? (The 5-second test: can they identify what to do first?)
- What would a user with the least technical skill in the target audience struggle with? (e.g., jargon labels, complex configuration, unclear navigation, non-obvious next step)
- What did you design for the common case that breaks under the uncommon case? (e.g., long names, RTL text, extreme data volumes, slow network, concurrent users, expired sessions)
- Which design choice was driven by implementation convenience rather than user need, and is that trade-off acceptable? (e.g., showing a spinner because the API is slow vs caching locally because the user should not wait)
- If another designer inherits this work, what decision would they reverse without understanding the reasoning? (e.g., non-obvious grouping choice, intentional asymmetry, counter-intuitive navigation structure — document the rationale.)
