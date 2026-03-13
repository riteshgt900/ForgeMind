## ⚡ PRIME DIRECTIVE

You are **ForgemindBuilder** — an elite AI system architect. Your mission is to scaffold, implement, wire, test, and document a **complete, production-ready, fully autonomous AI developer system** called **FORGEMIND** in a single pass. Every file listed must be created with full, non-placeholder content. No `// TODO`. No `// implement later`. No stub functions. Every function must be implemented. Every config must be valid. Every agent must be wired.

This system is inspired by **Devin AI**, **OpenDevin**, **SWE-Agent**, and **AutoCodeRover** — but built on top of **Claude Code SDK**, **Ruflo v3 multi-agent swarm**, **GitHub MCP**, **Filesystem MCP**, and **Slack/Google Chat** as the human interface. It receives a plain-English requirement from a Business Analyst, autonomously builds production code, self-debugs, self-reviews, self-tests, auto-rolls back on failure, and opens a reviewed GitHub PR — all with human-in-the-loop approval gates.

---

## 🗂️ COMPLETE FILE TREE TO GENERATE

Generate **every single file** below with **full implementation**:

```
forgemind/
├── README.md                          ← Full project readme
├── AGENTS.md                          ← All agent roles, capabilities, prompts
├── ARCHITECTURE.md                    ← System design, data flow, topology
├── CONTRIBUTING.md                    ← How to extend agents
├── CHANGELOG.md                       ← Version history template
├── SECURITY.md                        ← Security policies
├── VISION.md                          ← Product vision and roadmap
├── VIBE_CODE_GUIDE.md                 ← Full vibe coding reference
├── PROMPT_LIBRARY.md                  ← All internal agent prompts
├── TROUBLESHOOTING.md                 ← Common errors and fixes
│
├── logs/
│   ├── ai_success.log                 ← Structured success log (auto-appended)
│   ├── ai_fail.log                    ← Structured failure log (auto-appended)
│   ├── agent_activity.log             ← Per-agent event log
│   ├── rollback.log                   ← All rollback events
│   ├── approval_gate.log              ← Human approval audit trail
│   └── cost_tracker.log               ← Token/API cost per task
│
├── .env.example                       ← All env vars documented
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── package.json
├── Makefile                           ← make dev, make test, make deploy
│
├── ruflo-workflow.json                ← Ruflo swarm topology config
├── CLAUDE.md                          ← Claude Code repo instructions
├── mcp-servers.json                   ← All MCP server configs
│
├── .github/
│   ├── workflows/
│   │   ├── forgemind-ci.yml           ← Main CI pipeline
│   │   ├── ruflo-notify.yml           ← PR notification workflow
│   │   ├── auto-rollback.yml          ← Rollback on test failure
│   │   ├── security-scan.yml          ← CVE + SAST scanning
│   │   └── cost-report.yml            ← Weekly cost summary
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── ai_task.md                 ← Special template for BA AI tasks
│   └── CODEOWNERS
│
├── src/
│   ├── index.ts                       ← Main entry point
│   │
│   ├── queen/
│   │   ├── QueenAgent.ts              ← Strategic orchestrator
│   │   ├── StateMachine.ts            ← Workflow state machine
│   │   ├── TaskRouter.ts              ← Routes tasks to correct agent
│   │   └── ConsensusEngine.ts         ← Byzantine fault-tolerant consensus
│   │
│   ├── agents/
│   │   ├── BaseAgent.ts               ← Abstract base class all agents extend
│   │   ├── BAInterpreterAgent.ts      ← Parses BA requirements
│   │   ├── ArchitectAgent.ts          ← Scope + ADR + impact analysis
│   │   ├── CoderAgent.ts              ← File-by-file implementation
│   │   ├── TesterAgent.ts             ← Test gen, execution, reporting
│   │   ├── ReviewerAgent.ts           ← Code review + security
│   │   ├── DevOpsAgent.ts             ← Git, PR, CI/CD
│   │   ├── DebuggerAgent.ts           ← Runtime error diagnosis + fix
│   │   ├── RollbackAgent.ts           ← Auto-rollback on failure
│   │   └── MonitorAgent.ts            ← Continuous runtime watcher
│   │
│   ├── swarm/
│   │   ├── SwarmCoordinator.ts        ← Agent lifecycle management
│   │   ├── AgentDB.ts                 ← HNSW vector memory store
│   │   ├── ContextAutopilot.ts        ← Auto context window management
│   │   ├── MessageBus.ts              ← Inter-agent pub/sub
│   │   └── SwarmMetrics.ts            ← Agent performance tracking
│   │
│   ├── gates/
│   │   ├── ApprovalGate.ts            ← Human approval gate controller
│   │   ├── GateStorage.ts             ← Persists pending approvals
│   │   └── GateWebhook.ts             ← Receives approve/reject callbacks
│   │
│   ├── mcp/
│   │   ├── GitHubMCPClient.ts         ← GitHub MCP wrapper
│   │   ├── FilesystemMCPClient.ts     ← Filesystem MCP wrapper
│   │   └── RufloMCPClient.ts          ← Ruflo MCP wrapper (215 tools)
│   │
│   ├── channels/
│   │   ├── SlackChannel.ts            ← Slack bot interface
│   │   ├── GoogleChatChannel.ts       ← Google Chat bridge
│   │   └── BaseChannel.ts             ← Abstract channel interface
│   │
│   ├── documents/
│   │   ├── ScopeDocGenerator.ts       ← ADR/Scope doc creator
│   │   ├── TestCaseDocGenerator.ts    ← Test case document builder
│   │   ├── PRBodyGenerator.ts         ← GitHub PR body generator
│   │   └── ChangelogGenerator.ts      ← Auto changelog entry
│   │
│   ├── monitoring/
│   │   ├── RuntimeMonitor.ts          ← Watches deployed code health
│   │   ├── ErrorClassifier.ts         ← Classifies error severity
│   │   ├── AlertRouter.ts             ← Routes alerts to correct agent
│   │   └── HealthDashboard.ts         ← JSON health status endpoint
│   │
│   ├── hooks/
│   │   ├── PostToolUseHook.ts         ← Runs after every MCP tool call
│   │   ├── LinterHook.ts              ← ESLint auto-fix on file write
│   │   ├── TestRunnerHook.ts          ← Runs tests after implementation
│   │   └── SlackProgressHook.ts       ← Posts progress to Slack thread
│   │
│   ├── utils/
│   │   ├── logger.ts                  ← Structured logger (success/fail logs)
│   │   ├── costTracker.ts             ← Token cost per agent per task
│   │   ├── retry.ts                   ← Exponential backoff retry wrapper
│   │   ├── tokenCounter.ts            ← Anthropic token estimator
│   │   ├── diffUtils.ts               ← Git diff parser + analyzer
│   │   └── secretsValidator.ts        ← Validates all env vars on startup
│   │
│   └── types/
│       ├── Task.ts                    ← Task type definitions
│       ├── Agent.ts                   ← Agent type definitions
│       ├── WorkflowState.ts           ← State machine types
│       ├── SlackTypes.ts              ← Slack API types
│       └── MCPTypes.ts                ← MCP protocol types
│
├── scripts/
│   ├── notify-slack.js                ← Slack notification from hooks
│   ├── create-pr.js                   ← GitHub PR creation script
│   ├── rollback.js                    ← Emergency rollback script
│   ├── health-check.js                ← System health checker
│   ├── cost-report.js                 ← Generate cost report
│   └── seed-agentdb.js                ← Initialize vector memory
│
├── tests/
│   ├── unit/
│   │   ├── QueenAgent.test.ts
│   │   ├── BAInterpreterAgent.test.ts
│   │   ├── ArchitectAgent.test.ts
│   │   ├── CoderAgent.test.ts
│   │   ├── TesterAgent.test.ts
│   │   ├── ApprovalGate.test.ts
│   │   ├── RollbackAgent.test.ts
│   │   └── AgentDB.test.ts
│   ├── integration/
│   │   ├── full-workflow.test.ts      ← End-to-end workflow test
│   │   ├── slack-webhook.test.ts
│   │   └── github-mcp.test.ts
│   └── fixtures/
│       ├── sample-ba-requirement.txt
│       └── mock-repo-structure.json
│
└── docker/
    ├── Dockerfile
    ├── docker-compose.yml
    └── docker-compose.prod.yml
```

---

## 📋 DETAILED IMPLEMENTATION SPECS FOR EVERY FILE

---

### `README.md` — Must Include:
- Project banner with ASCII art of FORGEMIND
- One-liner: "The world's first open-source Devin alternative built on Claude Code + Ruflo"
- Architecture diagram in ASCII
- Quick start in 5 commands
- Full feature list with emoji bullets
- Agent roster table (name, model, role, speed)
- Human-in-the-loop approval gates explained
- All environment variables table
- Link to AGENTS.md, ARCHITECTURE.md, VIBE_CODE_GUIDE.md
- Badge row: CI status, License, Node version, Claude version
- Contributing section
- License: MIT

---

### `AGENTS.md` — Must Include:

Document EVERY agent with:
- Agent name + emoji
- Primary responsibility
- Claude model used (Opus for strategic, Sonnet for implementation, Haiku for fast ops)
- Full system prompt used internally (verbatim, complete, detailed — 200+ words each)
- Input schema (what it receives from the Queen)
- Output schema (what it returns)
- MCP tools it uses
- Failure modes + what happens on failure
- How it communicates with other agents via MessageBus

**Agents to document:**

#### 👑 Queen Agent
- Model: `claude-opus-4-6`
- Runs the state machine, routes tasks, manages gates, writes to AgentDB
- System prompt must include: think step-by-step, plan before acting, log every decision, halt on ambiguity, request clarification via Slack

#### 🧠 BA Interpreter Agent
- Model: `claude-sonnet-4-6`
- Converts natural language BA requirements into structured `Task` objects with: title, description, acceptance criteria, estimated complexity (S/M/L/XL), affected_domains[], risk_level

#### 🏛️ Architect Agent
- Model: `claude-opus-4-6`
- Reads repo via GitHub MCP, creates ADR (Architecture Decision Record) with: context, decision, consequences, affected_files[], change_plan (per-file), rollback_strategy, estimated_hours
- Outputs full Scope Document in Markdown

#### 💻 Coder Agent
- Model: `claude-sonnet-4-6`
- Implements changes file-by-file per the approved scope plan
- Uses Filesystem MCP for all writes
- After each file: PostToolUse hook runs linter and reports to Slack
- Writes concise, readable code with inline comments
- Never modifies files outside the approved scope plan

#### 🧪 Tester Agent
- Model: `claude-sonnet-4-6`
- Reads all changed files, generates unit tests and integration tests
- Runs test suite, captures output
- Generates Test Case Document with: scenario, preconditions, steps, expected result, actual result, status (PASS/FAIL), severity
- Triggers DebuggerAgent if tests fail

#### 🔍 Reviewer Agent (Swarm of 3)
- Model: `claude-sonnet-4-6` × 3 parallel instances
- Reviewer 1: Code quality (readability, complexity, DRY principles)
- Reviewer 2: Security (injection, auth, OWASP Top 10, secrets exposure)
- Reviewer 3: Performance (N+1 queries, memory leaks, unnecessary re-renders)
- Results merged by Queen via consensus engine
- Posts review summary as GitHub PR review comment

#### 🐛 Debugger Agent
- Model: `claude-sonnet-4-6`
- Triggered by: TesterAgent failure, MonitorAgent alert, CI pipeline failure
- Reads error output, stack trace, affected files
- Applies fix, re-runs tests
- Max 3 auto-fix attempts before escalating to human via Slack
- Logs every attempt in `ai_fail.log`

#### ⏮️ Rollback Agent
- Model: `claude-haiku-4-5-20251001`
- Triggered if: DebuggerAgent exhausts retries, CI fails on main, MonitorAgent reports P0 error in production
- Reverts to last known good commit using `git revert`
- Notifies Slack channel with rollback reason
- Writes detailed entry in `rollback.log`
- Creates a GitHub issue documenting the rollback

#### 🚀 DevOps Agent
- Model: `claude-haiku-4-5-20251001`
- Creates feature branch `feature/forgemind-{task-id}-{YYYYMMDD}`
- Commits with conventional commit format
- Pushes to remote
- Opens PR using GitHub MCP with full auto-generated body
- Assigns reviewers
- Adds labels: `forgemind-generated`, `awaiting-review`
- Posts final Slack summary with PR link + all document links

#### 📡 Monitor Agent
- Model: `claude-haiku-4-5-20251001`
- Runs continuously in background as a daemon
- Watches: application error rate, response times, log anomalies
- Classifies errors: P0 (production down), P1 (degraded), P2 (warning)
- P0 → immediately triggers RollbackAgent
- P1 → triggers DebuggerAgent + Slack alert
- P2 → logs + Slack warning

---

### `ARCHITECTURE.md` — Must Include:
- Full ASCII system architecture diagram (as detailed as the one in Vision.html)
- State machine diagram showing all workflow states and transitions
- Data flow diagram: BA message → Queen → Agents → GitHub → Notification
- Agent communication topology (hierarchical with message bus)
- Memory architecture: HNSW vector store + how embeddings are created
- Approval gate state machine (PENDING → APPROVED/REJECTED/ITERATION_REQUESTED)
- Token budget management strategy
- Cost optimization strategies
- Failure cascade diagram (what fails when, what triggers what)

---

### `VISION.md` — Must Include:
- The product vision: "Make every developer 10x more productive by automating the full software delivery loop"
- Phase 1: BA to PR (current)
- Phase 2: Autonomous monitoring + self-healing (6 months)
- Phase 3: Predictive development — agent proactively spots future bugs (12 months)
- Phase 4: Full autonomous software company (18 months)
- Competitive landscape: Devin, OpenDevin, Copilot Workspace, Cursor
- Why FORGEMIND wins: open source, self-hostable, Ruflo-powered multi-agent swarm, full audit trail

---

### `VIBE_CODE_GUIDE.md` — Must Include:
This is the MOST IMPORTANT documentation file for future vibe coding sessions. It must contain:

#### Section 1: What is Vibe Coding with FORGEMIND?
Explain the philosophy: you describe what you want in plain English, FORGEMIND does it. You review and approve. You never write code manually.

#### Section 2: The Magic Trigger Phrases
List all phrases that trigger specific agents:
- "Add a feature to..." → Full BA→PR workflow
- "Fix the bug where..." → DebuggerAgent directly
- "Refactor the..." → CoderAgent + ReviewerAgent
- "Write tests for..." → TesterAgent directly
- "Roll back to..." → RollbackAgent directly
- "Review the PR..." → Reviewer swarm

#### Section 3: Vibe Coding Session Checklist
Step-by-step guide for a successful vibe coding session with FORGEMIND

#### Section 4: Reading the Logs
How to read `ai_success.log`, `ai_fail.log`, `rollback.log`, `cost_tracker.log`

#### Section 5: Prompt Templates for BA Requirements
10 example prompt templates for common scenarios:
1. New API endpoint
2. UI component
3. Database migration
4. Bug fix
5. Performance optimization
6. Security patch
7. Documentation update
8. Dependency upgrade
9. Refactoring
10. Adding tests

#### Section 6: Extending FORGEMIND
How to add a new custom agent, how to add a new MCP server, how to add a new communication channel

---

### `PROMPT_LIBRARY.md` — Must Include:
The COMPLETE internal system prompts for every agent, verbatim, ready to copy. This is the "nuclear codes" file. Every prompt must be:
- 300-500 words minimum
- Include: role definition, behavior rules, output format spec, error handling instructions, communication style, what to do when uncertain

Include prompts for:
1. Queen Agent master orchestration prompt
2. BA Interpreter structured extraction prompt
3. Architect scope document generation prompt
4. Coder implementation prompt (with CLAUDE.md conventions)
5. Tester test generation prompt
6. Reviewer Code Quality prompt
7. Reviewer Security prompt
8. Reviewer Performance prompt
9. Debugger diagnosis + fix prompt
10. Rollback decision prompt
11. Monitor anomaly detection prompt
12. PR body generation prompt
13. Slack notification formatting prompt

---

### `logs/ai_success.log` — Format Spec:
Every successful task appends one JSON entry:
```json
{
  "timestamp": "2026-03-12T10:32:00Z",
  "task_id": "task_abc123",
  "task_title": "Add dark mode toggle",
  "requested_by": "sarah@company.com",
  "agents_used": ["ba-interpreter", "architect", "coder", "tester", "reviewer", "devops"],
  "duration_minutes": 21,
  "tokens_used": { "input": 45000, "output": 12000, "total": 57000 },
  "estimated_cost_usd": 0.42,
  "pr_url": "https://github.com/org/repo/pull/247",
  "test_coverage": "94%",
  "files_changed": 4,
  "lines_added": 87,
  "lines_removed": 12,
  "approval_gate_wait_minutes": 8,
  "reviewer_scores": { "quality": 9, "security": 10, "performance": 8 },
  "status": "SUCCESS"
}
```

### `logs/ai_fail.log` — Format Spec:
```json
{
  "timestamp": "2026-03-12T11:15:00Z",
  "task_id": "task_def456",
  "task_title": "Migrate database schema",
  "agent": "tester",
  "failure_type": "TEST_FAILURE",
  "error_message": "TypeError: Cannot read property 'id' of undefined at migrations/v2.ts:47",
  "debug_attempts": 2,
  "auto_fixed": false,
  "escalated_to_human": true,
  "rollback_triggered": false,
  "slack_thread": "https://slack.com/archives/C012345/p1234567",
  "tokens_used_before_failure": 23000,
  "status": "FAILED_ESCALATED"
}
```

### `logs/rollback.log` — Format Spec:
```json
{
  "timestamp": "2026-03-12T14:22:00Z",
  "rollback_id": "rollback_ghi789",
  "triggered_by": "monitor-agent",
  "trigger_reason": "P0: Error rate exceeded 50% for 3 consecutive minutes",
  "reverted_from_commit": "a1b2c3d",
  "reverted_to_commit": "e4f5g6h",
  "branch": "main",
  "github_issue_url": "https://github.com/org/repo/issues/312",
  "slack_notification_sent": true,
  "duration_seconds": 8,
  "status": "ROLLBACK_SUCCESS"
}
```

---

### `src/queen/QueenAgent.ts` — Full Implementation:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { StateMachine } from './StateMachine';
import { TaskRouter } from './TaskRouter';
import { AgentDB } from '../swarm/AgentDB';
import { MessageBus } from '../swarm/MessageBus';
import { ApprovalGate } from '../gates/ApprovalGate';
import { logger } from '../utils/logger';
import { costTracker } from '../utils/costTracker';
import { Task, WorkflowState, AgentResult } from '../types';

export class QueenAgent {
  private client: Anthropic;
  private stateMachine: StateMachine;
  private router: TaskRouter;
  private memory: AgentDB;
  private bus: MessageBus;
  private gate: ApprovalGate;

  constructor() {
    this.client = new Anthropic();
    this.stateMachine = new StateMachine();
    this.router = new TaskRouter();
    this.memory = AgentDB.getInstance();
    this.bus = MessageBus.getInstance();
    this.gate = new ApprovalGate();
  }

  async orchestrate(task: Task): Promise<void> {
    logger.success('queen', `Starting orchestration for task: ${task.id}`);
    await this.memory.store(task.id, 'task', task);

    try {
      // Phase 1: Analysis
      await this.stateMachine.transition('ANALYZING');
      const interpretation = await this.router.dispatch('ba-interpreter', task);
      const scope = await this.router.dispatch('architect', { task, interpretation });
      await this.memory.store(task.id, 'scope', scope);

      // Phase 2: Human Approval Gate
      await this.stateMachine.transition('AWAITING_APPROVAL');
      const approved = await this.gate.requestApproval(task.id, scope);
      if (!approved) {
        await this.stateMachine.transition('REJECTED');
        logger.fail('queen', `Task ${task.id} rejected by human`);
        return;
      }

      // Phase 3: Implementation
      await this.stateMachine.transition('IMPLEMENTING');
      const implementation = await this.router.dispatch('coder', { task, scope });

      // Phase 4: Testing
      await this.stateMachine.transition('TESTING');
      const testResult = await this.router.dispatch('tester', { task, implementation });

      if (!testResult.passed) {
        const fixed = await this.attemptAutoFix(task, testResult);
        if (!fixed) {
          await this.stateMachine.transition('FAILED');
          return;
        }
      }

      // Phase 5: Review Swarm
      await this.stateMachine.transition('REVIEWING');
      const review = await this.runReviewerSwarm(task, implementation);

      // Phase 6: Deploy PR
      await this.stateMachine.transition('DEPLOYING');
      const pr = await this.router.dispatch('devops', { task, scope, testResult, review });

      // Phase 7: Complete
      await this.stateMachine.transition('COMPLETE');
      await this.memory.store(task.id, 'pr', pr);
      logger.success('queen', `Task ${task.id} complete. PR: ${pr.url}`);
      costTracker.record(task.id, await this.memory.getCost(task.id));

    } catch (err) {
      await this.stateMachine.transition('FAILED');
      logger.fail('queen', `Orchestration failed: ${err}`);
      await this.router.dispatch('rollback', { task, reason: String(err) });
    }
  }

  private async attemptAutoFix(task: Task, testResult: AgentResult): Promise<boolean> {
    for (let attempt = 1; attempt <= 3; attempt++) {
      logger.info('queen', `Auto-fix attempt ${attempt}/3 for task ${task.id}`);
      const fix = await this.router.dispatch('debugger', { task, testResult, attempt });
      const retest = await this.router.dispatch('tester', { task, implementation: fix });
      if (retest.passed) return true;
    }
    await this.bus.publish('slack', { type: 'ESCALATE', task, reason: 'Auto-fix exhausted 3 attempts' });
    return false;
  }

  private async runReviewerSwarm(task: Task, implementation: AgentResult): Promise<AgentResult> {
    const [quality, security, performance] = await Promise.all([
      this.router.dispatch('reviewer-quality', { task, implementation }),
      this.router.dispatch('reviewer-security', { task, implementation }),
      this.router.dispatch('reviewer-performance', { task, implementation }),
    ]);
    return this.mergeReviews([quality, security, performance]);
  }

  private mergeReviews(reviews: AgentResult[]): AgentResult {
    // Byzantine fault-tolerant merge — majority wins on blockers
    const blockers = reviews.flatMap(r => r.blockers || []);
    const suggestions = reviews.flatMap(r => r.suggestions || []);
    const scores = reviews.map(r => r.score || 0);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    return { passed: blockers.length === 0, blockers, suggestions, score: avgScore };
  }
}
```

---

### `src/agents/BaseAgent.ts` — Full Abstract Class:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../utils/logger';
import { costTracker } from '../utils/costTracker';
import { retry } from '../utils/retry';
import { AgentConfig, AgentInput, AgentResult } from '../types';

export abstract class BaseAgent {
  protected client: Anthropic;
  protected model: string;
  protected name: string;
  protected systemPrompt: string;
  protected maxTokens: number;

  constructor(config: AgentConfig) {
    this.client = new Anthropic();
    this.model = config.model;
    this.name = config.name;
    this.systemPrompt = config.systemPrompt;
    this.maxTokens = config.maxTokens ?? 8192;
  }

  async execute(input: AgentInput): Promise<AgentResult> {
    logger.info(this.name, `Executing with input: ${JSON.stringify(input).slice(0, 100)}...`);
    const startMs = Date.now();

    try {
      const result = await retry(() => this.callClaude(input), { retries: 3, backoffMs: 1000 });
      const durationMs = Date.now() - startMs;
      costTracker.addUsage(this.name, result.usage);
      logger.success(this.name, `Completed in ${durationMs}ms`);
      return this.parseResult(result);
    } catch (err) {
      logger.fail(this.name, `Failed: ${err}`);
      throw err;
    }
  }

  protected async callClaude(input: AgentInput): Promise<Anthropic.Message> {
    return this.client.messages.create({
      model: this.model,
      max_tokens: this.maxTokens,
      system: this.systemPrompt,
      messages: [{ role: 'user', content: this.formatPrompt(input) }],
    });
  }

  protected abstract formatPrompt(input: AgentInput): string;
  protected abstract parseResult(response: Anthropic.Message): AgentResult;
  abstract getCapabilities(): string[];
}
```

---

### `src/swarm/AgentDB.ts` — HNSW Vector Memory:

```typescript
// Full implementation of HNSW vector store for agent memory
// Uses hnswlib-node for 150x faster similarity search vs brute force
import HNSWLib from 'hnswlib-node';
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../utils/logger';

interface MemoryEntry {
  taskId: string;
  agentName: string;
  content: string;
  metadata: Record<string, unknown>;
  timestamp: number;
}

export class AgentDB {
  private static instance: AgentDB;
  private index: HNSWLib.HierarchicalNSW;
  private entries: Map<number, MemoryEntry> = new Map();
  private client: Anthropic;
  private dim = 1536; // text-embedding-3-small dimensions
  private nextId = 0;

  private constructor() {
    this.client = new Anthropic();
    this.index = new HNSWLib.HierarchicalNSW('cosine', this.dim);
    this.index.initIndex(10000); // max 10k entries
  }

  static getInstance(): AgentDB {
    if (!AgentDB.instance) AgentDB.instance = new AgentDB();
    return AgentDB.instance;
  }

  async store(taskId: string, agentName: string, content: unknown): Promise<void> {
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    const embedding = await this.embed(text);
    const id = this.nextId++;
    this.index.addPoint(embedding, id);
    this.entries.set(id, { taskId, agentName, content: text, metadata: {}, timestamp: Date.now() });
    logger.info('agentdb', `Stored memory #${id} for task ${taskId}`);
  }

  async search(query: string, k = 5): Promise<MemoryEntry[]> {
    const embedding = await this.embed(query);
    const result = this.index.searchKnn(embedding, k);
    return result.neighbors.map(id => this.entries.get(id)!).filter(Boolean);
  }

  async getCost(taskId: string): Promise<number> {
    // Sum all stored cost metadata for task
    let total = 0;
    for (const entry of this.entries.values()) {
      if (entry.taskId === taskId && entry.metadata.cost) {
        total += entry.metadata.cost as number;
      }
    }
    return total;
  }

  private async embed(text: string): Promise<number[]> {
    // Use Anthropic embeddings or fallback to simple hash-based vector for dev
    const truncated = text.slice(0, 8000);
    // In production: call OpenAI text-embedding-3-small
    // For now: deterministic pseudo-embedding for testing
    return Array.from({ length: this.dim }, (_, i) =>
      Math.sin(truncated.charCodeAt(i % truncated.length) * (i + 1)) * 0.1
    );
  }
}
```

---

### `src/gates/ApprovalGate.ts` — Full Human Gate Implementation:

```typescript
import { SlackChannel } from '../channels/SlackChannel';
import { GateStorage } from './GateStorage';
import { logger } from '../utils/logger';
import { ScopeDocument } from '../types';

type GateStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ITERATION_REQUESTED' | 'TIMED_OUT';

export class ApprovalGate {
  private slack: SlackChannel;
  private storage: GateStorage;
  private timeoutMs = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.slack = new SlackChannel();
    this.storage = new GateStorage();
  }

  async requestApproval(taskId: string, scope: ScopeDocument): Promise<boolean> {
    logger.info('approval-gate', `Requesting approval for task ${taskId}`);

    const gateId = `gate_${taskId}_${Date.now()}`;
    await this.storage.save(gateId, { taskId, scope, status: 'PENDING', createdAt: Date.now() });

    // Post Slack interactive message with buttons
    await this.slack.postApprovalRequest(taskId, gateId, scope);

    // Log approval request
    logger.info('approval-gate', `Gate ${gateId} created. Awaiting human decision...`, {
      logFile: 'logs/approval_gate.log'
    });

    // Poll for decision
    const result = await this.pollForDecision(gateId);

    if (result === 'ITERATION_REQUESTED') {
      // Agent will revise scope and re-request
      return this.requestApproval(taskId, scope); // recursive with updated scope
    }

    return result === 'APPROVED';
  }

  private async pollForDecision(gateId: string): Promise<GateStatus> {
    const interval = 5000; // check every 5 seconds
    const maxAttempts = this.timeoutMs / interval;

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, interval));
      const gate = await this.storage.get(gateId);
      if (gate.status !== 'PENDING') {
        logger.info('approval-gate', `Gate ${gateId} resolved: ${gate.status}`);
        return gate.status;
      }
    }

    logger.fail('approval-gate', `Gate ${gateId} timed out after 24h`);
    await this.slack.postMessage(`⏰ Approval gate timed out for task. Auto-rejected.`);
    return 'TIMED_OUT';
  }

  // Called by webhook when human clicks button in Slack
  async resolve(gateId: string, decision: GateStatus, comment?: string): Promise<void> {
    await this.storage.update(gateId, { status: decision, resolvedAt: Date.now(), comment });
    logger.info('approval-gate', `Gate ${gateId} manually resolved: ${decision}`);
  }
}
```

---

### `src/monitoring/RuntimeMonitor.ts` — Full Autonomous Monitor:

```typescript
import { AlertRouter } from './AlertRouter';
import { ErrorClassifier } from './ErrorClassifier';
import { logger } from '../utils/logger';
import { SlackChannel } from '../channels/SlackChannel';

type Priority = 'P0' | 'P1' | 'P2';

interface Metric {
  errorRate: number;
  avgResponseMs: number;
  memoryUsageMb: number;
  timestamp: number;
}

export class RuntimeMonitor {
  private alertRouter: AlertRouter;
  private classifier: ErrorClassifier;
  private slack: SlackChannel;
  private isRunning = false;
  private metrics: Metric[] = [];
  private p0Threshold = 0.5; // 50% error rate
  private p1Threshold = 0.1; // 10% error rate
  private checkIntervalMs = 30_000; // 30 second checks

  constructor() {
    this.alertRouter = new AlertRouter();
    this.classifier = new ErrorClassifier();
    this.slack = new SlackChannel();
  }

  async start(): Promise<void> {
    this.isRunning = true;
    logger.info('monitor', 'Runtime monitor started');

    while (this.isRunning) {
      try {
        await this.check();
      } catch (err) {
        logger.fail('monitor', `Monitor check failed: ${err}`);
      }
      await new Promise(r => setTimeout(r, this.checkIntervalMs));
    }
  }

  stop(): void {
    this.isRunning = false;
    logger.info('monitor', 'Runtime monitor stopped');
  }

  private async check(): Promise<void> {
    const metric = await this.collectMetrics();
    this.metrics.push(metric);
    if (this.metrics.length > 100) this.metrics.shift(); // rolling window

    const priority = this.classify(metric);
    if (!priority) return;

    logger.info('monitor', `Alert triggered: ${priority}`, { metric });

    if (priority === 'P0') {
      await this.slack.postAlert('🚨 P0: Production critical — triggering automatic rollback');
      await this.alertRouter.triggerRollback(`P0: Error rate ${(metric.errorRate * 100).toFixed(1)}%`);
    } else if (priority === 'P1') {
      await this.slack.postAlert(`⚠️ P1: Degraded service — triggering debugger agent`);
      await this.alertRouter.triggerDebugger(`P1: High error rate detected`);
    } else {
      await this.slack.postAlert(`📊 P2: Warning — error rate ${(metric.errorRate * 100).toFixed(1)}%`);
    }
  }

  private classify(m: Metric): Priority | null {
    const recent = this.metrics.slice(-3); // last 3 checks
    const avgError = recent.reduce((s, r) => s + r.errorRate, 0) / recent.length;
    if (avgError >= this.p0Threshold) return 'P0';
    if (avgError >= this.p1Threshold) return 'P1';
    if (m.avgResponseMs > 5000) return 'P2';
    return null;
  }

  private async collectMetrics(): Promise<Metric> {
    // In production: pull from your APM (Datadog, New Relic, CloudWatch)
    // This is a stub — replace with actual metric collection
    return {
      errorRate: Math.random() * 0.05, // mock: 0-5% error rate
      avgResponseMs: 200 + Math.random() * 100,
      memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
      timestamp: Date.now(),
    };
  }
}
```

---

### `src/channels/SlackChannel.ts` — Full Slack Implementation:

```typescript
import { WebClient } from '@slack/web-api';
import { ScopeDocument, TestResult, PRResult } from '../types';

export class SlackChannel {
  private client: WebClient;
  private channel: string;
  private threadCache: Map<string, string> = new Map();

  constructor() {
    this.client = new WebClient(process.env.SLACK_BOT_TOKEN!);
    this.channel = process.env.SLACK_CHANNEL ?? '#ai-dev-requests';
  }

  async postApprovalRequest(taskId: string, gateId: string, scope: ScopeDocument): Promise<void> {
    const webhookBase = process.env.FORGEMIND_WEBHOOK_URL!;
    const res = await this.client.chat.postMessage({
      channel: this.channel,
      text: `📄 Scope Document Ready for Review — Task ${taskId}`,
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: '📄 FORGEMIND Scope Document' } },
        { type: 'section', fields: [
          { type: 'mrkdwn', text: `*Task:* ${scope.title}` },
          { type: 'mrkdwn', text: `*Risk:* ${scope.riskLevel}` },
          { type: 'mrkdwn', text: `*Files:* ${scope.affectedFiles.length}` },
          { type: 'mrkdwn', text: `*Estimate:* ${scope.estimatedHours}h` },
        ]},
        { type: 'section', text: { type: 'mrkdwn', text: `*Change Plan:*\n${scope.changePlan}` } },
        { type: 'actions', elements: [
          { type: 'button', text: { type: 'plain_text', text: '✅ Approve' }, style: 'primary',
            url: `${webhookBase}/gate/${gateId}/approve` },
          { type: 'button', text: { type: 'plain_text', text: '✏️ Request Changes' },
            url: `${webhookBase}/gate/${gateId}/iterate` },
          { type: 'button', text: { type: 'plain_text', text: '❌ Reject' }, style: 'danger',
            url: `${webhookBase}/gate/${gateId}/reject` },
        ]},
      ],
    });
    this.threadCache.set(taskId, res.ts as string);
  }

  async postProgress(taskId: string, message: string): Promise<void> {
    const threadTs = this.threadCache.get(taskId);
    await this.client.chat.postMessage({
      channel: this.channel,
      thread_ts: threadTs,
      text: message,
    });
  }

  async postFinalSummary(taskId: string, pr: PRResult, testResult: TestResult): Promise<void> {
    const threadTs = this.threadCache.get(taskId);
    await this.client.chat.postMessage({
      channel: this.channel,
      thread_ts: threadTs,
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: '🎉 FORGEMIND Task Complete!' } },
        { type: 'section', fields: [
          { type: 'mrkdwn', text: `*PR:* <${pr.url}|#${pr.number}>` },
          { type: 'mrkdwn', text: `*Tests:* ${testResult.passed ? '✅ All Passing' : '❌ Failed'}` },
          { type: 'mrkdwn', text: `*Coverage:* ${testResult.coverage}%` },
          { type: 'mrkdwn', text: `*Files Changed:* ${pr.filesChanged}` },
        ]},
      ],
    });
  }

  async postAlert(message: string): Promise<void> {
    await this.client.chat.postMessage({ channel: process.env.SLACK_ALERTS_CHANNEL ?? '#dev-alerts', text: message });
  }

  async postMessage(message: string): Promise<void> {
    await this.client.chat.postMessage({ channel: this.channel, text: message });
  }
}
```

---

### `ruflo-workflow.json` — Full Ruflo Swarm Config:

```json
{
  "name": "forgemind-ba-to-deploy",
  "version": "3.0.0",
  "description": "Autonomous BA-to-Deploy pipeline with self-healing agents",
  "swarm": {
    "topology": "hierarchical",
    "maxAgents": 12,
    "memoryBackend": "agentdb-hnsw",
    "contextAutopilot": true,
    "consensusAlgorithm": "byzantine-fault-tolerant",
    "agentTimeoutMs": 300000,
    "retryPolicy": { "maxRetries": 3, "backoffMs": 2000, "exponential": true }
  },
  "agents": [
    { "name": "queen", "type": "strategic", "model": "claude-opus-4-6", "singleton": true },
    { "name": "ba-interpreter", "type": "analyst", "model": "claude-sonnet-4-6" },
    { "name": "architect", "type": "architect", "model": "claude-opus-4-6" },
    { "name": "coder", "type": "coder", "model": "claude-sonnet-4-6" },
    { "name": "tester", "type": "tester", "model": "claude-sonnet-4-6" },
    { "name": "reviewer-quality", "type": "reviewer", "model": "claude-sonnet-4-6" },
    { "name": "reviewer-security", "type": "reviewer", "model": "claude-sonnet-4-6" },
    { "name": "reviewer-performance", "type": "reviewer", "model": "claude-sonnet-4-6" },
    { "name": "debugger", "type": "debugger", "model": "claude-sonnet-4-6", "maxAutoFixes": 3 },
    { "name": "rollback", "type": "rollback", "model": "claude-haiku-4-5-20251001" },
    { "name": "devops", "type": "devops", "model": "claude-haiku-4-5-20251001" },
    { "name": "monitor", "type": "monitor", "model": "claude-haiku-4-5-20251001", "daemon": true }
  ],
  "approvalGates": [
    {
      "name": "scope-sign-off",
      "after": "architect",
      "before": "coder",
      "via": ["slack", "google-chat"],
      "timeoutHours": 24,
      "allowIteration": true,
      "maxIterations": 5,
      "requiredApprovers": 1
    }
  ],
  "stateMachine": {
    "initialState": "IDLE",
    "states": ["IDLE","ANALYZING","SCOPING","AWAITING_APPROVAL","IMPLEMENTING","TESTING","DEBUGGING","REVIEWING","DEPLOYING","COMPLETE","FAILED","ROLLING_BACK"],
    "transitions": [
      { "from": "IDLE", "to": "ANALYZING", "trigger": "task_received" },
      { "from": "ANALYZING", "to": "SCOPING", "trigger": "interpretation_complete" },
      { "from": "SCOPING", "to": "AWAITING_APPROVAL", "trigger": "scope_ready" },
      { "from": "AWAITING_APPROVAL", "to": "IMPLEMENTING", "trigger": "approved" },
      { "from": "AWAITING_APPROVAL", "to": "SCOPING", "trigger": "iteration_requested" },
      { "from": "AWAITING_APPROVAL", "to": "FAILED", "trigger": "rejected" },
      { "from": "IMPLEMENTING", "to": "TESTING", "trigger": "implementation_complete" },
      { "from": "TESTING", "to": "REVIEWING", "trigger": "tests_passed" },
      { "from": "TESTING", "to": "DEBUGGING", "trigger": "tests_failed" },
      { "from": "DEBUGGING", "to": "TESTING", "trigger": "fix_applied" },
      { "from": "DEBUGGING", "to": "FAILED", "trigger": "max_retries_exceeded" },
      { "from": "REVIEWING", "to": "DEPLOYING", "trigger": "review_approved" },
      { "from": "DEPLOYING", "to": "COMPLETE", "trigger": "pr_created" },
      { "from": "FAILED", "to": "ROLLING_BACK", "trigger": "rollback_triggered" }
    ]
  },
  "mcpServers": ["ruflo", "github", "filesystem"],
  "hooks": {
    "PostToolUse": [
      { "matcher": "Write|Edit|MultiEdit", "command": "npm run lint:fix -- $CLAUDE_FILE_PATHS 2>&1 | head -30" },
      { "matcher": "Write|Edit|MultiEdit", "command": "node scripts/notify-slack.js --phase=$FORGEMIND_PHASE" }
    ],
    "Stop": [
      { "command": "node scripts/notify-slack.js --phase=complete" },
      { "command": "node scripts/cost-report.js --task=$FORGEMIND_TASK_ID" }
    ],
    "PreToolUse": [
      { "matcher": "Bash", "command": "node scripts/security-check.js --command=$CLAUDE_TOOL_INPUT" }
    ]
  },
  "notifications": {
    "slack": {
      "requestChannel": "#ai-dev-requests",
      "alertsChannel": "#dev-alerts",
      "prChannel": "#dev-prs"
    },
    "googleChat": {
      "spaceId": "${GOOGLE_CHAT_SPACE_ID}"
    }
  },
  "costLimits": {
    "perTaskUsd": 5.00,
    "dailyUsd": 100.00,
    "alertThresholdUsd": 3.00
  }
}
```

---

### `CLAUDE.md` — Repo Instructions:

```markdown
# FORGEMIND — Claude Code Instructions

## Core Principles
- NEVER write placeholder code. Always implement fully.
- NEVER modify files outside the approved scope plan.
- ALWAYS run tests after implementing changes.
- ALWAYS use conventional commits: feat:, fix:, test:, docs:, refactor:, chore:

## Branch Convention
feature/forgemind-{kebab-task-title}-{YYYYMMDD}

## Commit Message Format
type(scope): short description

feat(auth): add JWT refresh token rotation
fix(api): handle null user in getProfile endpoint
test(auth): add unit tests for token expiry

## PR Requirements
Every PR body must include:
- ## Summary (2-3 sentences)
- ## Changes (bullet list of files)
- ## Test Results (pass/fail + coverage %)
- ## Scope Document Link
- ## Originating Slack Thread Link
- ## Breaking Changes (or "None")

## Testing Standards
- Minimum 80% coverage on changed files
- All existing tests must remain passing
- New functions require new tests

## Code Style
- TypeScript strict mode
- ESLint + Prettier (auto-run via hooks)
- Max function length: 50 lines
- Max file length: 300 lines
- Prefer composition over inheritance
- Prefer async/await over callbacks

## Forbidden Actions
- Never commit to main or develop directly
- Never store secrets in code
- Never import packages not in package.json
- Never skip error handling

## Log Everything
- Append to logs/ai_success.log on task completion
- Append to logs/ai_fail.log on any failure
- Append to logs/rollback.log on any rollback
```

---

### `.github/workflows/forgemind-ci.yml` — Full CI Pipeline:

```yaml
name: FORGEMIND CI Pipeline

on:
  push:
    branches: ['feature/forgemind-*']
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20.x'

jobs:
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    name: Test Suite
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'npm' }
      - run: npm ci
      - run: npm test -- --coverage --passWithNoTests
      - name: Coverage Gate
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'CRITICAL,HIGH'

  notify-success:
    name: Notify Slack on Success
    needs: [test, security]
    if: success() && startsWith(github.head_ref, 'feature/forgemind-')
    runs-on: ubuntu-latest
    steps:
      - uses: slackapi/slack-github-action@v2
        with:
          channel-id: '#dev-prs'
          payload: |
            {"text":"✅ CI passed for PR #${{ github.event.pull_request.number }}. Ready for review!",
             "attachments":[{"color":"good","fields":[
               {"title":"PR","value":"${{ github.event.pull_request.html_url }}"},
               {"title":"Branch","value":"${{ github.head_ref }}"}
             ]}]}
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}

  auto-rollback:
    name: Auto Rollback on Main Failure
    needs: test
    if: failure() && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 5 }
      - name: Trigger Rollback Agent
        run: node scripts/rollback.js --reason="CI failure on main"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

---

### `.env.example` — All Environment Variables:

```bash
# ─── Anthropic ───────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...

# ─── GitHub ──────────────────────────────────────────────────────────────────
GITHUB_TOKEN=ghp_...                    # Fine-grained PAT
GITHUB_OWNER=your-org
GITHUB_REPO=your-repo
GITHUB_DEFAULT_BRANCH=main
GITHUB_REVIEWERS=tech-lead,senior-dev  # Comma-separated

# ─── Slack ───────────────────────────────────────────────────────────────────
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...
SLACK_SIGNING_SECRET=...
SLACK_CHANNEL=#ai-dev-requests
SLACK_ALERTS_CHANNEL=#dev-alerts
SLACK_PR_CHANNEL=#dev-prs

# ─── Google Chat (optional) ──────────────────────────────────────────────────
GOOGLE_CHAT_PROJECT_ID=your-gcp-project
GOOGLE_CHAT_SPACE_ID=spaces/XXXXXX
GOOGLE_APPLICATION_CREDENTIALS=./gcp-service-account.json

# ─── Ruflo ───────────────────────────────────────────────────────────────────
RUFLO_LICENSE_KEY=...
RUFLO_WEBHOOK_SECRET=...
RUFLO_MAX_CONCURRENT_TASKS=3

# ─── Forgemind ───────────────────────────────────────────────────────────────
FORGEMIND_WEBHOOK_URL=https://your-server.com/webhooks
FORGEMIND_ENV=production           # development | staging | production
FORGEMIND_LOG_LEVEL=info           # debug | info | warn | error
FORGEMIND_TASK_TIMEOUT_MS=3600000  # 1 hour
FORGEMIND_MAX_COST_PER_TASK_USD=5.00

# ─── Cost Tracking ───────────────────────────────────────────────────────────
COST_ALERT_THRESHOLD_USD=3.00
COST_DAILY_LIMIT_USD=100.00

# ─── Monitoring ──────────────────────────────────────────────────────────────
MONITOR_ENABLED=true
MONITOR_CHECK_INTERVAL_MS=30000
MONITOR_P0_ERROR_RATE_THRESHOLD=0.5
MONITOR_P1_ERROR_RATE_THRESHOLD=0.1
MONITOR_APM_URL=                   # Optional: Datadog/New Relic endpoint

# ─── Database (for GateStorage) ──────────────────────────────────────────────
DATABASE_URL=postgresql://user:pass@localhost:5432/forgemind
# Or for SQLite in dev:
DATABASE_URL=file:./forgemind.db

# ─── Redis (for MessageBus) ──────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ─── Security ────────────────────────────────────────────────────────────────
WEBHOOK_SECRET=...                 # For GitHub webhook verification
ENCRYPTION_KEY=...                 # 32-char key for sensitive data at rest
```

---

### `package.json` — Full with All Scripts:

```json
{
  "name": "forgemind",
  "version": "1.0.0",
  "description": "Autonomous AI Developer System — Devin alternative built on Claude Code + Ruflo",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc --project tsconfig.json",
    "start": "node dist/index.js",
    "start:monitor": "node dist/index.js --daemon",
    "test": "jest --forceExit",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --forceExit",
    "lint": "eslint src/**/*.ts tests/**/*.ts",
    "lint:fix": "eslint src/**/*.ts tests/**/*.ts --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write src/**/*.ts tests/**/*.ts",
    "swarm:init": "npx ruflo swarm init --topology hierarchical --config ruflo-workflow.json",
    "swarm:start": "npx ruflo hive-mind spawn FORGEMIND --config ruflo-workflow.json",
    "swarm:status": "npx ruflo status --watch",
    "swarm:stop": "npx ruflo daemon stop",
    "logs:success": "tail -f logs/ai_success.log | jq .",
    "logs:fail": "tail -f logs/ai_fail.log | jq .",
    "logs:rollback": "tail -f logs/rollback.log | jq .",
    "logs:cost": "node scripts/cost-report.js --period=today",
    "health": "node scripts/health-check.js",
    "seed": "node scripts/seed-agentdb.js",
    "migrate": "npx prisma migrate deploy",
    "generate": "npx prisma generate",
    "docker:dev": "docker-compose up --build",
    "docker:prod": "docker-compose -f docker-compose.prod.yml up -d"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "@slack/web-api": "^7.0.0",
    "@slack/bolt": "^3.0.0",
    "@modelcontextprotocol/sdk": "^1.0.0",
    "hnswlib-node": "^3.0.0",
    "express": "^4.18.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "ioredis": "^5.0.0",
    "zod": "^3.22.0",
    "winston": "^3.11.0",
    "dotenv": "^16.4.0",
    "node-cron": "^3.0.0",
    "axios": "^1.6.0",
    "js-yaml": "^4.1.0",
    "handlebars": "^4.7.0",
    "marked": "^11.0.0",
    "docx": "^8.0.0",
    "simple-git": "^3.22.0",
    "semver": "^7.6.0",
    "p-queue": "^8.0.0",
    "p-retry": "^6.0.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "ts-node-dev": "^2.0.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "prettier": "^3.0.0",
    "supertest": "^6.3.0",
    "@types/supertest": "^6.0.0"
  },
  "engines": { "node": ">=20.0.0" },
  "license": "MIT"
}
```

---

### `Makefile` — Developer Convenience:

```makefile
.PHONY: dev test build lint clean docker setup logs health

setup:
	npm install
	cp .env.example .env
	npx prisma migrate dev
	node scripts/seed-agentdb.js
	npm run swarm:init
	@echo "✅ FORGEMIND ready. Edit .env then run: make dev"

dev:
	npm run dev

build:
	npm run build

test:
	npm run test:coverage

lint:
	npm run lint:fix

clean:
	rm -rf dist coverage node_modules/.cache

docker:
	docker-compose up --build

logs:
	npm run logs:success &
	npm run logs:fail

health:
	node scripts/health-check.js

cost:
	node scripts/cost-report.js

swarm:
	npm run swarm:start
	npm run swarm:status
```

---

### `TROUBLESHOOTING.md` — Must Include:

Every common error with exact cause, fix command, and prevention:

1. `ApprovalGate timeout after 24h` — how to manually resolve + extend timeout
2. `DebuggerAgent max retries exceeded` — how to manually resume
3. `HNSW index corruption` — how to rebuild AgentDB
4. `Slack webhook signature invalid` — env var fix
5. `GitHub MCP 403 Forbidden` — PAT permissions checklist
6. `Ruflo daemon not responding` — restart commands
7. `Cost limit exceeded` — how to raise limits safely
8. `RollbackAgent failed to revert` — manual git revert steps
9. `MonitorAgent false positives` — threshold tuning
10. `Tests failing in CI but passing locally` — Docker env parity fix

---

### `CONTRIBUTING.md` — Must Include:
- How to add a new Agent (step-by-step, extending BaseAgent.ts)
- How to add a new MCP server
- How to add a new communication channel (extending BaseChannel.ts)
- How to add a new approval gate type
- How to write tests for agents
- PR process for FORGEMIND contributors
- Agent naming conventions
- System prompt writing guidelines

---

## 🎯 QUALITY GATES — Every File Must Pass

Before considering the build complete, verify:

- [ ] `npm run type-check` passes with zero errors
- [ ] `npm test` passes with >80% coverage  
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run build` produces valid dist/ output
- [ ] `node scripts/health-check.js` exits 0
- [ ] `node scripts/seed-agentdb.js` runs without error
- [ ] All log files exist and are writable
- [ ] `.env.example` documents every env var used anywhere in code
- [ ] Every `// TODO` comment is a build failure
- [ ] Every function has a JSDoc comment
- [ ] README renders correctly in GitHub

---

## 🚀 FINAL INITIALIZATION SEQUENCE

After all files are generated, run this exact sequence:

```bash
# 1. Install all dependencies
npm install

# 2. Validate TypeScript
npm run type-check

# 3. Run all tests
npm run test:coverage

# 4. Initialize FORGEMIND
make setup

# 5. Start the swarm
npm run swarm:start

# 6. Verify health
make health

# 7. Start development server
make dev

# System is ready. Post a requirement in Slack to #ai-dev-requests
# and watch FORGEMIND autonomously build it.
```

---

## 📊 SUCCESS CRITERIA

The build is complete when a BA can type this in Slack:

> `@ForgemindBot Add a password strength indicator to the registration form. It should show weak/medium/strong in real time and block form submission if weak.`

And FORGEMIND autonomously:
1. ✅ Interprets the requirement into a structured task
2. ✅ Analyzes the codebase and identifies affected files
3. ✅ Posts a scope document with Approve/Reject buttons
4. ✅ Waits for human approval (paused state)
5. ✅ On approval: implements the feature on a feature branch
6. ✅ Writes and runs tests (with ≥80% coverage)
7. ✅ Runs 3 parallel reviewer agents (quality, security, performance)
8. ✅ Opens a GitHub PR with full documentation
9. ✅ Posts summary to Slack with PR link + all attached docs
10. ✅ Logs the full task in ai_success.log

**This is FORGEMIND. Build it completely. Build it now.**

