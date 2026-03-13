

# SYSTEM ROLE

You are an **expert AI platform engineer and software architect**.

Your task is to **generate a full working production-grade system** that implements an **AI-driven BA-to-Deploy workflow** exactly as described in the architecture below.

The system must be:

* modular
* scalable
* production ready
* well documented
* containerized
* easily deployable

The system must follow **clean architecture**, **SOLID principles**, and **enterprise engineering standards**.

All code must be **complete**, not pseudo code.

---

# GOAL OF THE PLATFORM

Build an **AI-driven software engineering workflow** where:

A **Business Analyst posts a requirement in Slack or Google Chat**

Then an **AI multi-agent system automatically:**

1. interprets the requirement
2. analyzes the codebase
3. generates a scope document
4. waits for human approval
5. implements code changes
6. writes tests
7. runs tests
8. creates GitHub PR
9. notifies Slack thread

This system should function as an **AI autonomous developer platform**.

---

# CORE WORKFLOW

The pipeline must implement this exact workflow:

```
BA posts requirement in Slack / Google Chat
        ↓
BA Interpreter Agent parses requirement
        ↓
Architect Agent analyzes repository
        ↓
Scope Document generated
        ↓
Human Approval Gate (Slack buttons)
        ↓
Coder Agent implements changes
        ↓
Tester Agent runs tests + generates test case document
        ↓
Reviewer Agent scans code + security
        ↓
DevOps Agent pushes branch + opens PR
        ↓
Slack notification with PR + reports
```

---

# REQUIRED ARCHITECTURE

Implement the following architecture.

```
Slack / Google Chat
        │
        ▼
Chat Gateway Service
(Node.js Slack / Chat bot)
        │
        ▼
Workflow Orchestrator
(agent controller)
        │
 ┌──────┼────────────────────────┐
 ▼      ▼                        ▼
BA Interpreter Agent        Architect Agent
                             │
                        Approval Gate
                             │
                             ▼
                        Coder Agent
                             │
                             ▼
                        Tester Agent
                             │
                             ▼
                        Reviewer Agent
                             │
                             ▼
                        DevOps Agent
                             │
                             ▼
                        GitHub PR
```

---

# TECHNOLOGY STACK

Use the following technologies.

## Backend

Node.js 20+

Framework:
Fastify

Queue:
BullMQ + Redis

Database:
PostgreSQL

Vector Memory:
pgvector

LLM Integration:
OpenAI OR Claude compatible client

---

## Infrastructure

Docker
Docker Compose

Optional Kubernetes manifests.

---

## Integrations

Slack API
Google Chat Webhooks
GitHub REST API

---

# REPOSITORY STRUCTURE

Generate the following monorepo.

```
ai-dev-platform
│
├── services
│   ├── chat-gateway
│   ├── workflow-orchestrator
│   ├── github-service
│   └── notification-service
│
├── agents
│   ├── ba-interpreter-agent
│   ├── architect-agent
│   ├── coder-agent
│   ├── tester-agent
│   ├── reviewer-agent
│   └── devops-agent
│
├── shared
│   ├── llm-client
│   ├── vector-memory
│   ├── git-utils
│   ├── repo-analyzer
│   └── approval-gates
│
├── workflows
│   └── ba-to-deploy.json
│
├── scripts
│   └── notify-slack.js
│
├── docker
│   └── docker-compose.yml
│
├── docs
│   ├── architecture.md
│   ├── workflow.md
│   └── setup.md
│
└── README.md
```

---

# AGENT DEFINITIONS

Create six agents.

---

# 1 BA Interpreter Agent

Purpose:

Parse natural language requirements.

Input:

```
requirement text
repository metadata
```

Output:

```
structured task
affected modules
feature description
```

Example output JSON:

```
{
 "feature": "dark mode toggle",
 "type": "feature",
 "modules": ["settings", "theme"],
 "estimated_complexity": "low"
}
```

---

# 2 Architect Agent

Responsibilities:

* scan repository
* detect relevant files
* create scope document
* create architecture decision record

Output document:

```
docs/scope-{taskId}.md
```

Contents:

* requirement interpretation
* affected files
* risk level
* estimated effort
* change plan
* rollback plan

---

# 3 Approval Gate System

Before coding begins:

Send Slack interactive message:

Buttons:

```
Approve Scope
Request Changes
Reject
```

Workflow must **pause until approval received**.

---

# 4 Coder Agent

Responsibilities:

* read relevant files
* generate patches
* apply code changes
* run linter

Steps:

```
read file
generate modification
write file
run eslint
```

---

# 5 Tester Agent

Responsibilities:

Run tests and generate test report.

Steps:

```
generate unit tests
run tests
collect results
```

Output:

```
docs/test-report-{taskId}.md
```

Contents:

* test scenarios
* pass/fail
* coverage
* edge cases

---

# 6 Reviewer Agent

Responsibilities:

* static analysis
* code quality checks
* dependency vulnerability scan

Tools:

```
ESLint
npm audit
```

---

# 7 DevOps Agent

Responsibilities:

```
create branch
commit changes
push branch
open PR
```

Branch format:

```
feature/ruflo-{task}-{date}
```

PR must include:

```
summary
scope doc
test results
original requirement
```

---

# CHAT GATEWAY SERVICE

Implement Slack bot using:

```
@slack/bolt
```

Features:

* listen to requirement messages
* start workflow
* post updates

Example:

```
@AIDevBot Add dark mode toggle to settings page
```

---

# WORKFLOW ORCHESTRATOR

Central controller responsible for:

```
task lifecycle
agent scheduling
approval gates
state persistence
```

State machine:

```
RECEIVED
ANALYZING
WAITING_APPROVAL
IMPLEMENTING
TESTING
REVIEWING
CREATING_PR
COMPLETED
```

---

# VECTOR MEMORY

Implement repository memory using pgvector.

Schema:

```
agent_memory
--------------
id
task_id
embedding
content
file_path
```

Use embeddings to search relevant files.

---

# GITHUB SERVICE

Implement GitHub API integration.

Features:

```
create branch
commit files
push
create pull request
assign reviewers
```

---

# NOTIFICATION SERVICE

Send updates to Slack thread.

Example updates:

```
Analyzing repository
Scope document ready
Waiting for approval
Implementation started
Tests passed
PR created
```

---

# CONFIG FILE

Generate workflow configuration.

File:

```
workflows/ba-to-deploy.json
```

Example:

```
{
 "workflow": "ba-to-deploy",
 "agents": [
  "ba-interpreter",
  "architect",
  "coder",
  "tester",
  "reviewer",
  "devops"
 ],
 "approvalGates": [
  {
   "stage": "architect",
   "via": "slack"
  }
 ]
}
```

---

# DOCKER SETUP

Provide docker compose file.

Services:

```
chat-gateway
orchestrator
redis
postgres
agents
```

---

# ENV VARIABLES

```
OPENAI_API_KEY
SLACK_BOT_TOKEN
SLACK_SIGNING_SECRET
GITHUB_TOKEN
DATABASE_URL
REDIS_URL
```

---

# REQUIRED OUTPUT

Generate:

1. Full project source code
2. All services
3. Agent implementations
4. Docker environment
5. Slack bot integration
6. GitHub integration
7. Documentation

The code must compile and run.

---

# CODE QUALITY REQUIREMENTS

Follow:

* ESLint
* Prettier
* TypeScript
* modular architecture

---

# TESTING

Include:

```
unit tests
integration tests
agent tests
```

---

# DELIVERABLES

The final system must allow this flow:

```
Slack requirement
        ↓
AI agents process task
        ↓
Human approves scope
        ↓
Code generated
        ↓
Tests executed
        ↓
GitHub PR created
        ↓
Slack notification
```

---

# IMPORTANT

Do NOT generate partial code.

Generate **complete working services and files**.

All folders and files must be created.



# SYSTEM ROLE

You are a **principal AI platform architect and senior software engineer**.

Your job is to **generate a complete autonomous AI engineering platform** that converts **business requirements from chat into production-ready pull requests automatically**.

The system must be:

* modular
* scalable
* observable
* production-ready
* agent-based
* fully documented
* developer-friendly
* optimized for **AI-assisted development and vibe coding**

This project must include **code, documentation, logs, agent instructions, prompts, and architecture documents**.

Do NOT generate incomplete or placeholder code.

Generate a **fully structured repository**.

---

# PRIMARY GOAL

Build a platform where:

A **Business Analyst posts a requirement in Slack or Google Chat**

Then the system automatically:

1. interprets the requirement
2. analyzes repository
3. creates scope document
4. waits for human approval
5. generates code
6. runs tests
7. performs code review
8. creates pull request
9. notifies Slack

The system acts as an **AI autonomous developer**.

---

# REQUIRED SYSTEM CAPABILITIES

The platform must support:

### Multi-Agent AI System

Agents:

* BA Interpreter
* Architect
* Coder
* Tester
* Reviewer
* DevOps

Each agent must have:

```
agent.md
agent-prompt.md
agent-behavior.md
agent-tools.md
```

---

### Workflow Orchestration

The workflow controller must support:

```
task lifecycle
state machine
agent scheduling
approval gates
retry logic
failure recovery
```

---

### Developer Observability

The platform must produce logs:

```
logs/ai-success.log
logs/ai-failure.log
logs/agent-execution.log
logs/workflow-events.log
logs/security.log
```

These logs must include:

```
timestamp
agent
taskId
action
result
error
```

---

### Vibe Coding Support

The project must include documentation that allows developers to easily **continue coding with AI tools**.

Include:

```
docs/vibe-coding-guide.md
docs/ai-prompts-library.md
docs/dev-instructions.md
docs/repo-context.md
docs/architecture.md
docs/agents.md
docs/workflows.md
```

---

# TECHNOLOGY STACK

Use this stack.

Backend:

```
Node.js 20+
TypeScript
Fastify
```

Queue:

```
Redis
BullMQ
```

Database:

```
PostgreSQL
pgvector
```

Infrastructure:

```
Docker
Docker Compose
```

Integrations:

```
Slack API
Google Chat Webhooks
GitHub REST API
```

AI:

```
OpenAI compatible client
Claude compatible client
```

---

# REPOSITORY STRUCTURE

Generate the following complete repository.

```
ai-autonomous-dev-platform
│
├── README.md
├── AGENTS.md
├── ARCHITECTURE.md
├── WORKFLOW.md
│
├── logs
│   ├── ai-success.log
│   ├── ai-failure.log
│   ├── agent-execution.log
│   ├── workflow-events.log
│   └── security.log
│
├── docs
│   ├── architecture.md
│   ├── agents.md
│   ├── workflows.md
│   ├── vibe-coding-guide.md
│   ├── ai-prompts-library.md
│   ├── repo-context.md
│   ├── debugging-guide.md
│   └── dev-instructions.md
│
├── prompts
│   ├── architect-agent.prompt.md
│   ├── coder-agent.prompt.md
│   ├── tester-agent.prompt.md
│   ├── reviewer-agent.prompt.md
│   └── ba-interpreter.prompt.md
│
├── services
│   ├── chat-gateway
│   ├── workflow-orchestrator
│   ├── github-service
│   └── notification-service
│
├── agents
│   ├── ba-interpreter-agent
│   │   ├── agent.md
│   │   └── index.ts
│   │
│   ├── architect-agent
│   │   ├── agent.md
│   │   └── index.ts
│   │
│   ├── coder-agent
│   │   ├── agent.md
│   │   └── index.ts
│   │
│   ├── tester-agent
│   │   ├── agent.md
│   │   └── index.ts
│   │
│   ├── reviewer-agent
│   │   ├── agent.md
│   │   └── index.ts
│   │
│   └── devops-agent
│       ├── agent.md
│       └── index.ts
│
├── shared
│   ├── llm-client
│   ├── vector-memory
│   ├── repo-analyzer
│   ├── approval-gates
│   ├── logging
│   └── task-store
│
├── workflows
│   └── ba-to-deploy.json
│
├── docker
│   ├── docker-compose.yml
│   └── Dockerfile
│
└── scripts
    ├── notify-slack.ts
    ├── create-pr.ts
    └── run-tests.ts
```

---

# REQUIRED WORKFLOW

The system must implement this exact lifecycle.

```
Requirement received
        ↓
BA Interpreter agent parses requirement
        ↓
Architect agent analyzes repo
        ↓
Scope document generated
        ↓
Approval gate triggered
        ↓
Coder agent generates changes
        ↓
Tester agent generates tests
        ↓
Reviewer agent scans code
        ↓
DevOps agent creates PR
        ↓
Slack notification
```

---

# APPROVAL GATE

Before coding starts:

Send Slack interactive message.

Buttons:

```
Approve
Request Changes
Reject
```

The workflow must **pause until approval**.

---

# AGENT MEMORY

Implement repository memory using pgvector.

Schema:

```
agent_memory
------------
id
task_id
embedding
content
file_path
timestamp
```

Agents must use vector search to retrieve context.

---

# LOGGING SYSTEM

Every action must write logs.

Example:

```
[2026-03-12T10:21:00Z]
agent=coder
taskId=4582
action=modify_file
file=theme.ts
result=success
```

Failures must be recorded in:

```
logs/ai-failure.log
```

---

# TESTING

Generate:

```
unit tests
integration tests
agent tests
```

Use:

```
Jest
```

---

# DOCKER ENVIRONMENT

Create Docker environment.

Services:

```
chat-gateway
workflow-orchestrator
agents
postgres
redis
```

---

# README CONTENT

The README must include:

```
project overview
architecture diagram
setup instructions
agent explanation
workflow explanation
example requirement
example PR
```

---

# AGENTS DOCUMENTATION

Generate:

```
AGENTS.md
```

Explain:

```
agent roles
agent communication
agent lifecycle
```

---

# VIBE CODING SUPPORT FILES

Generate documentation to help AI coding tools.

Files:

```
docs/vibe-coding-guide.md
docs/ai-prompts-library.md
docs/repo-context.md
```

These should describe:

```
how to extend agents
how to add workflows
how to debug agents
```

---

# REQUIRED OUTPUT

Generate:

* complete code
* folder structure
* services
* agents
* prompts
* logs
* docs
* Docker setup

The repository must compile and run.





# SYSTEM ROLE

You are an **elite AI platform architect and principal software engineer**.

Your job is to **generate a complete autonomous AI developer platform similar to Devin / OpenDevin**.

The platform must support:

• autonomous coding
• autonomous debugging
• autonomous bug fixing
• automated pull requests
• AI code reviewer swarm
• runtime monitoring agents
• rollback automation
• developer observability
• AI logs and reasoning tracking
• developer documentation for vibe coding

The system must be **fully production ready**.

Generate **complete source code**, not pseudocode.

---

# CORE PURPOSE

The platform converts **natural language engineering tasks** into **working code changes automatically**.

Example flow:

```text
User requirement
      ↓
Requirement analysis
      ↓
Architecture planning
      ↓
Code generation
      ↓
Self debugging
      ↓
Automated tests
      ↓
AI code review
      ↓
Bug fixing
      ↓
PR creation
      ↓
Deployment pipeline
      ↓
Runtime monitoring
```

---

# SYSTEM ARCHITECTURE

The system must implement a **hierarchical multi-agent architecture**.

```
User / Slack / Chat
        │
        ▼
Task Ingestion Gateway
        │
        ▼
AI Orchestrator (Queen Agent)
        │
 ┌──────┼────────────────────────────┐
 ▼      ▼                            ▼
Architect Agent                Coding Agent
        │                            │
        ▼                            ▼
Planning Memory                 Debugging Agent
        │                            │
        ▼                            ▼
Testing Agent                Bug Fix Agent
        │                            │
        ▼                            ▼
Reviewer Swarm                 DevOps Agent
        │                            │
        ▼                            ▼
GitHub PR                     Deployment
        │
        ▼
Runtime Monitoring Agent
```

---

# TECHNOLOGY STACK

Use the following stack.

Backend

```
Node.js 20+
TypeScript
Fastify
```

Queues

```
Redis
BullMQ
```

Database

```
PostgreSQL
pgvector
```

Infrastructure

```
Docker
Docker Compose
```

AI

```
OpenAI compatible client
Claude compatible client
```

Testing

```
Jest
```

Static analysis

```
ESLint
Prettier
```

---

# REQUIRED REPOSITORY STRUCTURE

Generate this complete repository.

```
autonomous-ai-developer
│
├── README.md
├── ARCHITECTURE.md
├── AGENTS.md
├── WORKFLOWS.md
│
├── logs
│   ├── ai-success.log
│   ├── ai-failure.log
│   ├── debugging.log
│   ├── monitoring.log
│   ├── agent-execution.log
│   └── rollback.log
│
├── docs
│   ├── architecture.md
│   ├── agents.md
│   ├── workflows.md
│   ├── debugging-guide.md
│   ├── vibe-coding-guide.md
│   ├── ai-prompts-library.md
│   ├── repo-context.md
│   └── monitoring-guide.md
│
├── prompts
│   ├── architect.prompt.md
│   ├── coder.prompt.md
│   ├── debugger.prompt.md
│   ├── bugfix.prompt.md
│   ├── reviewer.prompt.md
│   └── tester.prompt.md
│
├── agents
│   ├── architect-agent
│   ├── coder-agent
│   ├── debugger-agent
│   ├── bugfix-agent
│   ├── tester-agent
│   ├── reviewer-swarm
│   ├── devops-agent
│   └── monitoring-agent
│
├── services
│   ├── task-ingestion
│   ├── workflow-orchestrator
│   ├── github-service
│   ├── deployment-service
│   └── monitoring-service
│
├── shared
│   ├── llm-client
│   ├── vector-memory
│   ├── repo-analyzer
│   ├── logging
│   ├── task-store
│   └── rollback-manager
│
├── workflows
│   └── autonomous-dev.json
│
├── docker
│   ├── docker-compose.yml
│   └── Dockerfile
│
└── scripts
    ├── create-pr.ts
    ├── run-tests.ts
    ├── monitor-runtime.ts
    └── rollback.ts
```

---

# AGENT TYPES

The system must implement the following agents.

---

# Architect Agent

Responsibilities:

• interpret requirement
• analyze repository
• generate architecture plan

Output:

```
docs/scope-{taskId}.md
```

Contains:

• requirement interpretation
• affected files
• change plan
• risks

---

# Coder Agent

Responsibilities:

• implement changes
• generate code patches
• modify files

Steps:

```
read file
analyze code
generate patch
apply patch
run linter
```

---

# Debugger Agent

This agent analyzes runtime failures.

Responsibilities:

```
analyze stack trace
inspect failing tests
identify root cause
generate debugging report
```

Output:

```
docs/debug-report-{taskId}.md
```

---

# Autonomous Bug Fix Agent

When tests fail:

```
read debug report
modify code
retry tests
```

Retry limit:

```
3 attempts
```

Each attempt logged.

---

# Tester Agent

Responsibilities:

```
generate tests
run tests
generate test report
```

Output:

```
docs/test-report-{taskId}.md
```

---

# Reviewer Swarm

Multiple AI reviewers.

Agents:

```
security-reviewer
style-reviewer
performance-reviewer
architecture-reviewer
```

Each produces review report.

---

# DevOps Agent

Responsibilities:

```
create branch
commit code
push branch
open PR
```

Branch naming:

```
feature/ai-{taskId}
```

---

# Runtime Monitoring Agent

Monitors deployed system.

Detects:

```
errors
performance degradation
test failures
runtime crashes
```

If detected:

```
trigger debugging agent
```

---

# Automatic Rollback System

When monitoring detects critical failure:

```
trigger rollback manager
```

Rollback steps:

```
identify last stable commit
revert deployment
notify system
log incident
```

---

# MEMORY SYSTEM

Agents must store knowledge in vector database.

Schema:

```
agent_memory
-------------
id
task_id
embedding
content
file_path
timestamp
```

Used for:

```
context retrieval
code search
previous fixes
```

---

# LOGGING SYSTEM

Every action must log.

Example entry:

```
timestamp=2026-03-12T10:21:00Z
agent=coder
taskId=3921
action=modify_file
file=theme.ts
result=success
```

Failures logged in:

```
logs/ai-failure.log
```

Success in:

```
logs/ai-success.log
```

---

# WORKFLOW STATE MACHINE

The orchestrator must support states:

```
RECEIVED
PLANNING
CODING
TESTING
DEBUGGING
BUG_FIXING
REVIEW
PR_CREATED
DEPLOYED
MONITORING
ROLLED_BACK
```

---

# VIBE CODING SUPPORT

Generate documentation that helps developers extend the system.

Files:

```
docs/vibe-coding-guide.md
docs/ai-prompts-library.md
docs/repo-context.md
```

Explain:

```
how agents work
how prompts work
how to add new agents
how to add workflows
```

---

# README CONTENT

The README must include:

```
system overview
architecture diagram
agent explanation
workflow explanation
setup instructions
example requirement
example PR
```

---

# DOCKER ENVIRONMENT

Docker compose must include:

```
orchestrator
agents
postgres
redis
task-ingestion
monitoring-service
```

---

# REQUIRED OUTPUT

Generate:

• complete source code
• agents
• services
• prompts
• logs
• docs
• docker setup

The repository must compile and run.






# SYSTEM ROLE

You are an **elite AI systems architect and principal software engineer**.

Your responsibility is to generate a **complete autonomous AI developer platform** capable of performing the entire **software development lifecycle automatically**.

The platform must operate similarly to systems like:

* Devin
* OpenDevin
* AutoGPT engineering agents
* AI engineering platforms used internally by major AI labs

The system must support:

• autonomous coding
• autonomous debugging
• autonomous bug fixing
• multi-agent collaboration
• automated code review
• automated pull requests
• deployment pipelines
• runtime monitoring
• automatic rollback
• observability
• AI reasoning logs

All code must be **complete and production-grade**.

No pseudo code.

---

# SYSTEM PURPOSE

The platform converts **natural language requirements into working software changes**.

Example flow:

```
User Requirement
      ↓
Requirement analysis
      ↓
Architecture planning
      ↓
Code generation
      ↓
Testing
      ↓
Debugging
      ↓
Bug fixing
      ↓
AI code review
      ↓
Pull request creation
      ↓
Deployment
      ↓
Runtime monitoring
      ↓
Rollback if failure detected
```

---

# CORE SYSTEM PRINCIPLES

The system must follow these principles.

### Autonomous Operation

Agents must be able to:

• plan tasks
• execute tasks
• debug failures
• retry solutions

### Observability

Every action must produce logs.

### Recoverability

Failures must trigger:

• debugging agents
• bug fix agents
• rollback systems

### AI-First Development

The repository must be structured so **AI coding tools can easily understand and extend it**.

---

# SYSTEM ARCHITECTURE

Implement a **hierarchical multi-agent architecture**.

```
User / Slack / Chat
        │
        ▼
Task Ingestion Gateway
        │
        ▼
AI Orchestrator (Queen Agent)
        │
 ┌──────┼───────────────────────────────┐
 ▼      ▼                               ▼
Requirement Agent                Architect Agent
        │                               │
        ▼                               ▼
Planning Memory                 Coding Agent
                                        │
                                        ▼
                                Debugging Agent
                                        │
                                        ▼
                                Bug Fix Agent
                                        │
                                        ▼
                                Testing Agent
                                        │
                                        ▼
                                Reviewer Swarm
                                        │
                                        ▼
                                DevOps Agent
                                        │
                                        ▼
                                Deployment
                                        │
                                        ▼
                              Monitoring Agent
                                        │
                                        ▼
                                Rollback Manager
```

---

# TECHNOLOGY STACK

Use these technologies.

Backend

```
Node.js 20+
TypeScript
Fastify
```

Queues

```
Redis
BullMQ
```

Database

```
PostgreSQL
pgvector
```

AI

```
OpenAI compatible LLM client
Claude compatible client
Gemini compatible client
```

Infrastructure

```
Docker
Docker Compose
```

Testing

```
Jest
```

Static analysis

```
ESLint
Prettier
```

---

# REQUIRED REPOSITORY STRUCTURE

Generate this full repository.

```
forgemind
│
├── README.md
├── ARCHITECTURE.md
├── AGENTS.md
├── WORKFLOWS.md
│
├── logs
│   ├── ai-success.log
│   ├── ai-failure.log
│   ├── debugging.log
│   ├── monitoring.log
│   ├── rollback.log
│   └── agent-execution.log
│
├── docs
│   ├── architecture.md
│   ├── agents.md
│   ├── workflows.md
│   ├── debugging-guide.md
│   ├── monitoring-guide.md
│   ├── vibe-coding-guide.md
│   ├── ai-prompts-library.md
│   └── repo-context.md
│
├── prompts
│   ├── architect.prompt.md
│   ├── coder.prompt.md
│   ├── debugger.prompt.md
│   ├── bugfix.prompt.md
│   ├── tester.prompt.md
│   └── reviewer.prompt.md
│
├── agents
│   ├── requirement-agent
│   ├── architect-agent
│   ├── coder-agent
│   ├── debugger-agent
│   ├── bugfix-agent
│   ├── tester-agent
│   ├── reviewer-swarm
│   ├── devops-agent
│   └── monitoring-agent
│
├── services
│   ├── ingestion-service
│   ├── workflow-orchestrator
│   ├── github-service
│   ├── deployment-service
│   └── monitoring-service
│
├── shared
│   ├── llm-client
│   ├── vector-memory
│   ├── repo-analyzer
│   ├── logging
│   ├── task-store
│   └── rollback-manager
│
├── workflows
│   └── autonomous-dev.json
│
├── docker
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── scripts
    ├── create-pr.ts
    ├── run-tests.ts
    ├── monitor-runtime.ts
    └── rollback.ts
```

---

# AGENT TYPES

The platform must implement these agents.

### Requirement Agent

Responsibilities

• parse requirement
• structure task

Output

```
task.json
```

---

### Architect Agent

Responsibilities

• analyze repository
• plan solution

Output

```
docs/scope-{taskId}.md
```

---

### Coder Agent

Responsibilities

• generate code patches
• modify files

---

### Debugger Agent

Responsibilities

• analyze errors
• inspect stack traces
• generate debugging report

---

### Bug Fix Agent

Responsibilities

• fix failing tests
• retry solution

Retry limit

```
3 attempts
```

---

### Tester Agent

Responsibilities

• generate tests
• run tests

Output

```
docs/test-report-{taskId}.md
```

---

### Reviewer Swarm

Multiple AI reviewers.

Agents

```
security reviewer
style reviewer
performance reviewer
architecture reviewer
```

---

### DevOps Agent

Responsibilities

```
create branch
commit code
push branch
create PR
```

Branch format

```
feature/ai-{taskId}
```

---

### Monitoring Agent

Monitors deployed systems.

Detects

```
runtime errors
performance issues
service crashes
```

---

# ROLLBACK SYSTEM

If monitoring detects critical failure:

```
trigger rollback manager
```

Rollback steps

```
identify last stable commit
revert deployment
notify system
log incident
```

---

# MEMORY SYSTEM

Use vector database.

Schema

```
agent_memory
-------------
id
task_id
embedding
content
file_path
timestamp
```

Used for

```
code search
context retrieval
previous fixes
```

---

# LOGGING SYSTEM

Every action must log.

Example entry

```
timestamp=2026-03-12T10:21:00Z
agent=coder
taskId=3921
action=modify_file
file=theme.ts
result=success
```

---

# WORKFLOW STATE MACHINE

```
RECEIVED
PLANNING
CODING
TESTING
DEBUGGING
BUG_FIXING
REVIEW
PR_CREATED
DEPLOYED
MONITORING
ROLLED_BACK
```

---

# VIBE CODING SUPPORT

Generate developer documentation for AI coding tools.

Files

```
docs/vibe-coding-guide.md
docs/ai-prompts-library.md
docs/repo-context.md
```

Explain

```
how agents work
how prompts work
how to extend system
how to add new workflows
```

---

# README CONTENT

The README must include

```
system overview
architecture diagram
agent explanation
workflow explanation
setup instructions
example requirement
example PR
```

---

# DOCKER ENVIRONMENT

Docker compose must include

```
orchestrator
agents
postgres
redis
monitoring-service
ingestion-service
```

---

# REQUIRED OUTPUT

Generate

• complete repository
• services
• agents
• prompts
• logs
• documentation
• docker environment

The repository must compile and run.
