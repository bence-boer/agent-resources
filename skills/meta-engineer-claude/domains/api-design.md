# API Design — Building or Modifying Endpoints

An API is a contract. Every decision becomes someone else's constraint.

→ Also read: [security](../qualities/security.md), [reliability](../qualities/reliability.md), [developer-experience](../qualities/developer-experience.md)

1. Does this endpoint follow the existing conventions for routing, naming, and response shapes? (e.g., RESTful patterns, consistent error formats, chained routes for type inference)
2. Is every input validated before it reaches business logic? (e.g., body schema validation, parameter format checks, query string parsing)
3. Does every mutation verify its preconditions and check for errors from the data layer? (e.g., existence checks, permission verification, database error handling)
4. Is the response shape consistent with other endpoints, and can the consumer derive types from it? (e.g., typed responses, discriminated unions for success/error)
5. What happens when this endpoint receives concurrent, duplicate, or out-of-order requests? (e.g., idempotency, optimistic locking, race conditions)
6. Is the separation between route handler and business logic clean? (e.g., route handles HTTP concerns, service handles domain logic, testable in isolation)
