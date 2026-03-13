# VIBE CODE GUIDE

## 1. What Is Vibe Coding with FORGEMIND?
You describe intent in plain English. FORGEMIND interprets, scopes, proposes, implements, tests, reviews, and opens a PR. Humans approve at high-impact gates.

## 2. Magic Trigger Phrases
- "Add a feature to..." -> full BA->PR workflow
- "Fix the bug where..." -> DebuggerAgent path
- "Refactor the..." -> CoderAgent + Reviewer swarm
- "Write tests for..." -> TesterAgent path
- "Roll back to..." -> RollbackAgent path
- "Review the PR..." -> Reviewer swarm only

## 3. Session Checklist
1. Provide business context and acceptance criteria.
2. Confirm constraints (deadline, risk tolerance, security boundaries).
3. Review scope doc carefully before approval.
4. Approve or request iteration with explicit comments.
5. Validate final PR summary and test evidence.

## 4. Reading Logs
- `logs/ai_success.log`: completed task summary and PR metadata
- `logs/ai_fail.log`: failure diagnostics and escalation state
- `logs/rollback.log`: recovery events and issue links
- `logs/cost_tracker.log`: token/cost accounting per task

## 5. BA Prompt Templates
1. New API endpoint: Describe route, auth, request/response, and failure behavior.
2. UI component: Describe UX states, interactions, and accessibility constraints.
3. Database migration: Describe schema delta, backfill plan, and rollback path.
4. Bug fix: Describe observed behavior, expected behavior, and repro steps.
5. Performance optimization: Describe bottleneck, target metric, and load profile.
6. Security patch: Describe vulnerability class, impacted surface, and acceptance checks.
7. Documentation update: Describe audience, sections, and examples to include.
8. Dependency upgrade: Describe target version, compatibility checks, and rollout plan.
9. Refactor: Describe technical debt, constraints, and non-functional objectives.
10. Adding tests: Describe risk areas, expected coverage, and required scenarios.

## 6. Extending FORGEMIND
- Add custom agents by extending `BaseAgent` and registering in `TaskRouter`.
- Add MCP servers in `mcp-servers.json` plus matching client wrapper.
- Add channels by extending `BaseChannel` and wiring to gate/notification flows.
