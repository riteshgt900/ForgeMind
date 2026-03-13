import { BaseAgent } from './BaseAgent';
import { resolveModelForAgent } from '../utils/modelResolver';
import type { AgentInput, AgentResult, Task } from '../types';

export class BAInterpreterAgent extends BaseAgent {
  /** Initializes BA interpreter config. */
  constructor() {
    super({
      name: 'ba-interpreter',
      model: resolveModelForAgent('ba-interpreter'),
      systemPrompt: 'Convert business requirement text to structured task output.',
      maxTokens: 2048,
    });
  }

  /** Formats parser prompt text. */
  protected formatPrompt(input: AgentInput): string {
    const text = typeof input.metadata?.requirement === 'string'
      ? input.metadata.requirement
      : input.task?.rawRequirement ?? input.task?.description ?? '';
    return `Parse requirement:\n${text}`;
  }

  /** Parses output and returns deterministic task interpretation. */
  protected parseResult(_rawText: string, input: AgentInput): AgentResult {
    const req = typeof input.metadata?.requirement === 'string'
      ? input.metadata.requirement
      : input.task?.rawRequirement ?? input.task?.description ?? '';

    const task: Task = {
      id: input.task?.id ?? `task_${Date.now()}`,
      title: req.slice(0, 80),
      description: req,
      acceptanceCriteria: this.criteria(req),
      estimatedComplexity: req.length > 300 ? 'L' : 'M',
      affectedDomains: ['application'],
      riskLevel: req.toLowerCase().includes('security') ? 'HIGH' : 'MEDIUM',
      requestedBy: input.task?.requestedBy ?? 'unknown@local',
      rawRequirement: req,
      createdAt: new Date().toISOString(),
      source: input.task?.source,
    };

    return { passed: true, message: 'Requirement interpreted', interpretation: task, data: task };
  }

  /** Returns BA interpreter capabilities. */
  getCapabilities(): string[] {
    return ['requirement-parsing', 'task-structuring'];
  }

  /** Derives acceptance criteria lines from requirement text. */
  private criteria(requirement: string): string[] {
    const lines = requirement
      .split(/[\n.;]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    if (lines.length === 0) {
      return ['Implement requirement as specified'];
    }
    return lines.slice(0, 8);
  }
}
