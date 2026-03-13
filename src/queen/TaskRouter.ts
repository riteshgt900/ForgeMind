import { BAInterpreterAgent } from '../agents/BAInterpreterAgent';
import { ArchitectAgent } from '../agents/ArchitectAgent';
import { CoderAgent } from '../agents/CoderAgent';
import { TesterAgent } from '../agents/TesterAgent';
import { ReviewerAgent } from '../agents/ReviewerAgent';
import { DevOpsAgent } from '../agents/DevOpsAgent';
import { DebuggerAgent } from '../agents/DebuggerAgent';
import { RollbackAgent } from '../agents/RollbackAgent';
import { MonitorAgent } from '../agents/MonitorAgent';
import type { AgentInput, AgentName, AgentResult } from '../types';

export class TaskRouter {
  private readonly agents: Record<AgentName, { execute(input: AgentInput): Promise<AgentResult> }>;

  /** Registers all built-in agents. */
  constructor() {
    this.agents = {
      'ba-interpreter': new BAInterpreterAgent(),
      architect: new ArchitectAgent(),
      coder: new CoderAgent(),
      tester: new TesterAgent(),
      'reviewer-quality': new ReviewerAgent('quality'),
      'reviewer-security': new ReviewerAgent('security'),
      'reviewer-performance': new ReviewerAgent('performance'),
      debugger: new DebuggerAgent(),
      rollback: new RollbackAgent(),
      devops: new DevOpsAgent(),
      monitor: new MonitorAgent(),
    };
  }

  /** Dispatches payload to agent by name. */
  async dispatch(agent: AgentName, input: AgentInput): Promise<AgentResult> {
    const target = this.agents[agent];
    if (!target) throw new Error(`Unknown agent ${agent}`);
    return target.execute(input);
  }
}
