# FORGEMIND

```
 ______ ___  ____   ____ _____ __  __ ___ _   _ ____  
|  ____/ _ |  _  / __ _   _|  /  |_ _|  | |  _  
| |__ | | | | |_) | |  | || | | |/| || ||  | | | | |
|  __|| | | |  _ <| |  | || | | |  | || || |\  | | | |
| |   | |_| | |_) | |__| || |_| |  | || || |  | |_| |
|_|    ___/|____/ ____/_____|_|  |_|___|_|  _|____/ 
```

The world's first open-source Devin alternative built on Claude Code + Ruflo.

![CI](https://img.shields.io/badge/ci-FORGEMIND-green) ![License](https://img.shields.io/badge/license-MIT-blue) ![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen) ![Claude](https://img.shields.io/badge/claude-4.6-orange)

## Architecture (ASCII)
```
BA in Slack/Chat
      |
      v
+-------------------+      +-------------------+
|   Queen Agent     |----->|  AgentDB (HNSW)   |
+-------------------+      +-------------------+
      |
      +--> BA Interpreter --> Architect --> [Approval Gate]
      |                                      |
      +--> Coder --> Tester --> Reviewer x3--+
      |
      +--> DevOps --> GitHub PR --> Notifications
      |
      +--> Monitor --> Debugger / Rollback
```

## Quick Start (5 commands)
```bash
npm install
npm run type-check
npm run test:coverage
node scripts/seed-agentdb.js
npm run dev
```

## Features
- ?? Full BA-to-PR autonomous delivery loop
- ?? Multi-agent swarm orchestration with deterministic routing
- ? Human-in-the-loop approval gate before implementation
- ?? Automated test generation, execution, and reporting
- ?? Parallel reviewer swarm (quality, security, performance)
- ?? Runtime monitoring with debugger and rollback triggers
- ?? Cost tracking and JSONL audit logs
- ?? Slack and Google Chat channels

## Agent Roster
| Agent | Model | Role | Speed |
|---|---|---|---|
| Queen | claude-opus-4-6 | Strategic orchestration | Medium |
| BA Interpreter | claude-sonnet-4-6 | Requirement parsing | Fast |
| Architect | claude-opus-4-6 | ADR + scope planning | Medium |
| Coder | claude-sonnet-4-6 | File-level implementation | Fast |
| Tester | claude-sonnet-4-6 | Test generation + execution | Fast |
| Reviewer Quality | claude-sonnet-4-6 | Readability + design review | Fast |
| Reviewer Security | claude-sonnet-4-6 | OWASP + secrets review | Fast |
| Reviewer Performance | claude-sonnet-4-6 | Efficiency review | Fast |
| Debugger | claude-sonnet-4-6 | Auto-fix retry loop | Fast |
| Rollback | claude-haiku-4-5-20251001 | Emergency recovery | Very Fast |
| DevOps | claude-haiku-4-5-20251001 | Branch/PR automation | Very Fast |
| Monitor | claude-haiku-4-5-20251001 | Continuous runtime watch | Very Fast |

## Human-in-the-Loop Approval Gates
FORGEMIND pauses after scope generation and posts Approve / Request Changes / Reject actions to Slack or Google Chat. No implementation begins until approval is explicit. Iteration requests route back to architecture scope regeneration.

## Environment Variables
| Variable | Purpose |
|---|---|
| ANTHROPIC_API_KEY | Claude API access |
| GITHUB_TOKEN | GitHub API and MCP access |
| GITHUB_OWNER / GITHUB_REPO | Repository target |
| GITHUB_DEFAULT_BRANCH | Base branch for PR |
| GITHUB_REVIEWERS | Reviewer assignment list |
| SLACK_BOT_TOKEN | Slack app token |
| SLACK_APP_TOKEN | Slack socket token |
| SLACK_SIGNING_SECRET | Webhook verification |
| SLACK_CHANNEL | Request channel |
| SLACK_ALERTS_CHANNEL | Alert channel |
| SLACK_PR_CHANNEL | PR notification channel |
| GOOGLE_CHAT_PROJECT_ID | Optional Google Chat app |
| GOOGLE_CHAT_SPACE_ID | Optional chat space |
| GOOGLE_CHAT_WEBHOOK_URL | Optional webhook URL |
| RUFLO_LICENSE_KEY | Ruflo runtime license |
| RUFLO_WEBHOOK_SECRET | Ruflo webhook validation |
| RUFLO_MAX_CONCURRENT_TASKS | Swarm concurrency |
| FORGEMIND_WEBHOOK_URL | Approval callback base URL |
| FORGEMIND_ENV | Runtime environment |
| FORGEMIND_LOG_LEVEL | Logging severity |
| FORGEMIND_TASK_TIMEOUT_MS | Task timeout budget |
| FORGEMIND_MAX_COST_PER_TASK_USD | Per-task spend cap |
| FORGEMIND_GATE_TIMEOUT_MS | Approval timeout |
| FORGEMIND_GATE_POLL_MS | Approval poll interval |
| COST_ALERT_THRESHOLD_USD | Cost alert threshold |
| COST_DAILY_LIMIT_USD | Daily cost cap |
| MONITOR_ENABLED | Runtime monitor toggle |
| MONITOR_CHECK_INTERVAL_MS | Monitor polling interval |
| MONITOR_P0_ERROR_RATE_THRESHOLD | Critical error threshold |
| MONITOR_P1_ERROR_RATE_THRESHOLD | Degraded error threshold |
| MONITOR_APM_URL | Optional APM endpoint |
| DATABASE_URL | Gate storage database URI |
| REDIS_URL | MessageBus pub/sub backend |
| WEBHOOK_SECRET | Generic webhook signature secret |
| ENCRYPTION_KEY | At-rest encryption key |

## Documentation Links
- [AGENTS.md](./AGENTS.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [VIBE_CODE_GUIDE.md](./VIBE_CODE_GUIDE.md)

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for extension patterns, coding standards, and PR process.

## License
MIT
