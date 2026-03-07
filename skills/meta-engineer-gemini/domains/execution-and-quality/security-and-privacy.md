# Security & Privacy

When handling authentication, authorization, user data, or external inputs, you must ask yourself:

- How could a motivated, malicious user actively exploit this new endpoint or feature? (e.g., SQL/NoSQL injection attacks, missing authorization checks on object IDs, rate limit bypasses)
- Am I accidentally exposing or logging sensitive data in URLs, client-side code, or server logs? (e.g., PII in query parameters, API keys bundled in the frontend, overly verbose error messages)
- Do we actually need to store or request this specific piece of user data, and if so, is it protected correctly? (e.g., the principle of data minimization, least privilege access, encryption at rest)
- Are external dependencies and inputs treated with extreme suspicion? (e.g., strict schema validation, sanitizing HTML input, avoiding unsafe deserialization)
