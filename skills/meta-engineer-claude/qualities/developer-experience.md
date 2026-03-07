# Developer Experience — Does This Respect Fellow Developers?

You are writing code for humans who will read, modify, and debug it after you.

1. Can a developer unfamiliar with this code find, understand, and modify it without fear? (e.g., clear structure, typed interfaces, predictable patterns, no hidden magic)
2. Do the types and interfaces guide correct usage and prevent misuse at compile time? (e.g., discriminated unions, branded types, required vs optional fields, narrow return types)
3. Are error messages and logs actionable — do they tell the developer what went wrong and what to do? (e.g., context in error messages, structured logging, correlation IDs)
4. Is the development workflow fast, reliable, and well-documented? (e.g., documented scripts, fast feedback loops, reproducible builds, clear setup instructions)
5. Does this change increase or decrease the cognitive load required to work in this area? (e.g., new concepts to learn, hidden dependencies, implicit behavior, surprising side effects)
6. Am I leaving breadcrumbs for the next developer? (e.g., meaningful commit messages, comments explaining "why" not "what", clear PR descriptions)
