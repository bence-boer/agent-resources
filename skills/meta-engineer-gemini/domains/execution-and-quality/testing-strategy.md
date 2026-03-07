# Testing Strategy

When implementing functionality, fixing bugs, or ensuring the correctness of the system, you must ask yourself:

- What specific proof gives me absolute confidence that this code works perfectly? (e.g., comprehensive unit tests, integration tests, strict type safety, successful manual reproduction)
- What are the bizarre, unexpected edge cases that "should never happen," and how does the code gracefully handle them? (e.g., negative numbers, incredibly long strings, concurrent mutations, missing fields)
- Are the tests verifying the actual desired behavior, or are they just rigidly testing the internal implementation details? (e.g., testing public APIs, avoiding the mocking of internal state, focusing on final outcomes)
- If a future developer accidentally breaks this logic, will a test fail immediately and clearly tell them why? (e.g., descriptive test names, isolated assertions, clear failure messages)
