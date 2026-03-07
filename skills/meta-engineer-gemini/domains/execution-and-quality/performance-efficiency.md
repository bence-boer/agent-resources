# Performance & Efficiency

When writing algorithms, querying data, or rendering UI, you must ask yourself:

- Is there any hidden computational complexity I am inadvertently introducing? (e.g., nested loops leading to O(n^2), redundant external API calls, unoptimized database queries)
- How does this feature negatively impact the perceived performance and latency for the end user? (e.g., blocking the main browser thread, bloated bundle sizes, unoptimized and large images, missing loading indicators)
- Am I holding onto memory, connections, or system resources longer than absolutely necessary? (e.g., missing cleanup functions, dangling event listeners, unclosed database connections)
- Are we fetching only the absolute minimum amount of data required for this operation? (e.g., avoiding `SELECT *`, using pagination, GraphQL field selection)
