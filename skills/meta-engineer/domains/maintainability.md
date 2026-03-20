# Domain - Maintainability

## Use when

The task changes file boundaries, abstraction choices, naming, code shape, or repeated patterns.

## Route next

- [extensibility.md](extensibility.md) to keep the next legitimate requirement cheap
- [developer-experience.md](developer-experience.md) to make the correct maintenance path obvious
- [../finish/self-review.md](../finish/self-review.md) to check whether the final structure will still look wise later

## Apply

- Prefer fewer concepts, clearer names, and shallower APIs.
- Abstract to capture a stable rule or boundary, not merely to hide repetition.
- Extraction alone is not abstraction; moved code still needs a contract and a misuse-resistant surface.
- Delete spaghetti branches instead of growing them.
- Keep the code readable without global reconstruction.
- If a piece of complexity is necessary, contain it behind a small, well-defined surface.
- Everything earns its place. Remove dead code, vestigial parameters, and speculative structure in the changed area.

## Resolve explicitly

- What abstraction actually removes misuse or duplication of policy?
- What complexity is accidental and can be deleted?
- Can the changed area be reasoned about locally?
- What naming or file split will age best?
- What code remains only because nobody has removed it yet?

## Minimum proof

- Changed area is simpler to trace than before
- API is narrower or clearer where it matters
- Hidden policy and parallel logic are reduced, not relocated
- Dead or vestigial paths were removed where they were tightly coupled to the change
