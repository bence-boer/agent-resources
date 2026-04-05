[0] TEMPLATE
- input: ...
- output: ...

[1] Map current context
 * task: Look at all code relevant to the task and build a conceptual UX map and a flat Code architecture map.
 * input: {prompt, raw code}
 * output: [CODE-MAP.txt, UX-MAP-OLD.xml]

[2] What do we want (UX)
 * task: Define desired UX, user flows, and behavior based on the prompt and UX-MAP-OLD. Outline hard rules. Strictly write no code.
 * input: {prompt, UX-MAP-OLD.xml}
 * output: [UX-PLAN-NEW.xml]

[3] High level ideal planning projected into code
 * task: Map the new UX plan onto the existing CODE-MAP. Decide on file modifications, new files, refactors, data flow, interfaces, API contracts, and schema changes.
 * input: {UX-PLAN-NEW.xml, CODE-MAP.txt, raw code}
 * output: [TECHNICAL-ARCHITECTURE-PLAN.md]

[4] E2E tests (Drafting)
 * task: Write E2E test definitions based purely on the UX plan and expected architecture outcomes (TDD approach).
 * input: {UX-PLAN-NEW.xml, TECHNICAL-ARCHITECTURE-PLAN.md}
 * output: [E2E-TEST-SUITE.spec]

[5] Manager break into chunks (include refactors)
 * task: Deconstruct the architecture plan into actionable, independent agent tasks. Isolate refactoring steps and set dependencies.
 * input: {TECHNICAL-ARCHITECTURE-PLAN.md, CODE-MAP.txt}
 * output: [TASK-QUEUE.json, DEPENDENCY-GRAPH.json]

[6] Individual agents (horizontal + vertical)
 * task: Execute assigned coding tasks and write isolated unit tests.
 * input: {Task details from TASK-QUEUE.json, CODE-MAP.txt}
 * output: [unit tests FIRST then code changes in commit]

[7] E2E on done
 * task: Execute the E2E test suite against integrated code diffs. Capture logs and generate report.
 * input: {Merged CODE-DIFFS, E2E-TEST-SUITE.spec}
 * output: [TEST-EXECUTION-REPORT.json]

[8] Manager + architect hybrid
 * task: Review report and diffs for architectural consistency, quality, and security. Formulate actionable feedback if tests fail.
 * input: {CODE-DIFFS.patch, TEST-EXECUTION-REPORT.json, TECHNICAL-ARCHITECTURE-PLAN.md}
 * output: [REVIEW-REPORT.md, ITERATION-TASK-QUEUE.json]

[9] Agent iterations
 * task: Read feedback, debug tests, fix errors, and refactor. Loop back to step 7 until approved.
 * input: {ITERATION-TASK-QUEUE.json, Failing Code, Error Logs}
 * output: [UPDATED-CODE-DIFFS.patch]

[10] Stakeholder review
 * task: Synthesize final changes into a summary, compare against the prompt/UX plan, and ask for approval.
 * input: {Original prompt, UX-PLAN-NEW.xml, Final Merged Code}
 * output: [RELEASE-NOTES.md, STAKEHOLDER-APPROVAL-REQUEST.md]
