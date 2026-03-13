# ARCHITECTURE

## System Architecture (ASCII)
```
Slack / Google Chat
      |
      v
+--------------------------+
| Chat Channels            |
| SlackChannel/GoogleChat  |
+--------------------------+
             |
             v
+--------------------------+
| Queen Orchestrator       |
| StateMachine + Router    |
+--------------------------+
   |       |        |      \
   |       |        |       \
   v       v        v        v
 BA   Architect   Coder    Tester
  \      |         |        |
   \     |         |        v
    \    |         |   Reviewer Swarm x3
     \   |         |        |
      \  v         v        v
      Approval Gate ---> DevOps ---> GitHub PR
             |
             v
      Human Approver
```

## Workflow State Machine
```
IDLE -> ANALYZING -> SCOPING -> AWAITING_APPROVAL -> IMPLEMENTING -> TESTING -> REVIEWING -> DEPLOYING -> COMPLETE
TESTING -> DEBUGGING -> TESTING
AWAITING_APPROVAL -> SCOPING (iteration request)
AWAITING_APPROVAL -> REJECTED
FAILED -> ROLLING_BACK
```

## Data Flow
1. BA message enters Slack/Google Chat.
2. Queen normalizes input into Task.
3. BA Interpreter extracts structure.
4. Architect generates scope and ADR.
5. ApprovalGate pauses and waits for human decision.
6. Coder implements approved scope.
7. Tester validates and generates test document.
8. Reviewer swarm audits quality/security/performance.
9. DevOps opens PR and sends notifications.

## Agent Communication Topology
Hierarchical topology with Queen as coordinator and MessageBus for event propagation. Agents do not directly mutate state machine; they return results, and Queen commits transitions.

## Memory Architecture
AgentDB stores vectorized task context (HNSW when native module is available, deterministic cosine fallback otherwise). Embeddings are deterministic hash vectors to keep tests reproducible.

## Approval Gate State Machine
PENDING -> APPROVED | REJECTED | ITERATION_REQUESTED | TIMED_OUT

## Token Budget Management Strategy
- Per-agent usage estimated from token counter
- Per-task aggregate tracked in cost tracker
- Daily and per-task limits evaluated by automation scripts

## Cost Optimization
- Prefer Haiku for fast ops (DevOps, Rollback, Monitor)
- Use Sonnet for implementation/review
- Use Opus only where strategic depth matters
- Use deterministic local fallback in tests to avoid API spend

## Failure Cascade
- Test failure -> Debugger retries up to 3
- Debug retries exhausted -> FAILED -> Rollback
- Monitor P0 -> immediate Rollback
- Monitor P1 -> Debugger + alert
- PR creation failure -> FAILED with remediation
