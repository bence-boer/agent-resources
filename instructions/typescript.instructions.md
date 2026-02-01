---
name: TypeScript Code Style Guidelines
description: Guidelines for writing TypeScript code.
applyTo: "**/*.ts"
---

# TypeScript Guidelines

## Module Organization

- Keep enums and pure transformation utilities in standalone ESModules to avoid pulling HTTP dependencies into consumers.
- Export literal constant objects with as const satisfies for immutable lookup tables.

## Type Safety

- Always use exact TypeScript types. NEVER use any, unknown, or Object or unsafe casts (as any, as unknown as T).
If some data is not typed, follow the data stream up to find the source of the type, and type the data all the way through.
- Define data with the most specific type that still meets the requirements.
- ALWAYS prefer compile-time type checking over runtime checks
- ALWAYS prefer enums over string literal unions

## Code Complexity & Control Flow

- Strive for lower cognitive complexity in functions (target: ≤10 complexity per function).
- Imperative calculations are only allowed in "leaf" functions calculating a single primitive value.
- Keep the control flow linear (use early returns and guard clauses)
- Apply separation of concerns + locality of behavior
- Prefer declarative/functional patterns over imperative/sequential operations.
  - Use const instead of let when possible, break complex logic into smaller functions
  - If a piece of local data is only used once, inline it
  - Treat state as immutable; use spread/structuredClone for updates
  - Use array functions (map, filter, reduce) instead of imperative loops
  - Use switch(true), object maps or ternary operators instead of long if/else if chains
  - Utilize modern JavaScript/TypeScript features (??, ?., ??=)

## Naming & Scope

- Follow consistent naming conventions:
  - Classes, Interfaces, Types, Enums: PascalCase
  - Variables, Functions, Methods: snake_case
  - Constants, Enum Members: UPPER_SNAKE_CASE
- Use descriptive variable and function names that clearly indicate their purpose.
- In lambda functions and loops, shorter names are acceptable when the context is clear, but NO ABBREVIATIONS. This holds for generic type parameters as well (no T, U, V).
- Only request the exact data in function parameters you need, no more.
- Define data with the smallest possible scope that still meets the requirements (private, const).

## Code Evolution

- WET (Write Everything Twice) -> abstract at third use
- If you're modifying code that doesn't follow these rules, fix it in place after analyzing the impact. ALWAYS KEEP EXISTING LOGIC INTACT.
- Use JSDoc comments for all public methods and classes.

VERY IMPORTANT:
If you have understood these instructions, include the following at the start of your response:
[TYPESCRIPT INSTRUCTIONS - ACTIVE]
