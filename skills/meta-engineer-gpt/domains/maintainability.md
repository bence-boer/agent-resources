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
- Delete spaghetti branches instead of growing them.
- Keep the code readable without global reconstruction.
- If a piece of complexity is necessary, contain it behind a small, well-defined surface.

## Resolve explicitly

- What abstraction actually removes misuse or duplication of policy?
- What complexity is accidental and can be deleted?
- Can the changed area be reasoned about locally?
- What naming or file split will age best?

## Minimum proof

- Changed area is simpler to trace than before
- API is narrower or clearer where it matters
- Hidden policy and parallel logic are reduced, not relocated
