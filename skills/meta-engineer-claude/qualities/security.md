# Security — Is This Code Safe From Misuse?

Assume every input is hostile. Assume every boundary leaks. Verify every assumption.

1. What can a malicious actor do with the inputs this code accepts? (e.g., injection, overflow, path traversal, privilege escalation)
2. Am I exposing any internal state, error details, or system information to untrusted consumers? (e.g., stack traces, database errors, file paths, version numbers)
3. Does every operation verify that the caller is authorized to perform it? (e.g., authentication check, role verification, resource ownership validation)
4. Am I handling secrets, tokens, and credentials safely at every point in their lifecycle? (e.g., not logged, not in URLs, not in client bundles, rotatable)
5. What happens if this input is 10x larger, 10x faster, or 10x more concurrent than expected? (e.g., rate limiting, size limits, timeouts, backpressure)
6. Am I trusting data from an external system that could be compromised or malformed? (e.g., API responses, file contents, environment variables, user-generated content)
7. Does this change maintain the principle of least privilege? (e.g., minimal permissions, scoped access, allowlists over denylists)
