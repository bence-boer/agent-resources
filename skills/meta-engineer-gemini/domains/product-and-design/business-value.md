# Business Value

When evaluating the scope, purpose, or impact of a feature or bug fix, you must ask yourself:

- What is the ultimate business objective this code is trying to achieve? (e.g., user retention, revenue generation, cost reduction)
- Are there any edge cases in the business logic that could lead to financial or reputational harm if handled poorly? (e.g., concurrent transaction races, bypassing paywalls, incorrectly formatting user data)
- Is there a simpler, more elegant version of this feature that delivers the majority of the value with significantly less complexity? (e.g., MVP scope, leveraging existing components, avoiding over-engineering)
- Does this implementation actually solve the root problem, or is it just patching a symptom? (e.g., fixing the underlying data model vs adding another conditional check)
