# CONTRIBUTING

## Add a New Agent
1. Extend `src/agents/BaseAgent.ts`.
2. Implement prompt formatter, parser, capabilities, and execution logic.
3. Register agent in `src/queen/TaskRouter.ts`.
4. Add unit tests and update AGENTS.md contract.

## Add a New MCP Server
1. Add server entry in `mcp-servers.json`.
2. Create wrapper in `src/mcp`.
3. Wire usage into relevant agent.
4. Add integration tests for failure and success paths.

## Add a New Communication Channel
1. Extend `src/channels/BaseChannel.ts`.
2. Implement channel adapter with fallback mode.
3. Wire into ApprovalGate and notification hooks.
4. Add webhook and integration tests.

## Add a New Approval Gate Type
1. Extend gate status/record definitions.
2. Implement gate policy in `ApprovalGate`.
3. Add webhook decision mapping.
4. Add unit tests for all transitions.

## Write Agent Tests
- Mock external integrations.
- Assert schema completeness and deterministic outputs.
- Cover both pass and fail paths.

## PR Process
- Use feature branches: `feature/forgemind-...`.
- Include summary, changes, tests, and scope links.
- Ensure lint, type-check, and tests pass before review.

## Naming Conventions
- Agent files: `<Role>Agent.ts`
- MCP wrappers: `<Provider>MCPClient.ts`
- Hooks: `<Action>Hook.ts`

## System Prompt Guidelines
- Define role, boundaries, and output schema.
- Include uncertainty rules and escalation behavior.
- Keep deterministic and machine-readable outputs.
