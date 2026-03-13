import { BaseAgent } from './BaseAgent';
import { GitHubMCPClient } from '../mcp/GitHubMCPClient';
import { ScopeDocGenerator } from '../documents/ScopeDocGenerator';
import { resolveModelForAgent } from '../utils/modelResolver';
import type { AgentInput, AgentResult, Task } from '../types';

export class ArchitectAgent extends BaseAgent {
  private readonly github: GitHubMCPClient;
  private readonly docs: ScopeDocGenerator;

  /** Initializes architect dependencies and model. */
  constructor(github?: GitHubMCPClient, docs?: ScopeDocGenerator) {
    super({
      name: 'architect',
      model: resolveModelForAgent('architect'),
      systemPrompt: 'Generate ADR scope with context, decision, consequences, file plan, rollback, and estimate.',
      maxTokens: 4096,
    });
    this.github = github ?? new GitHubMCPClient();
    this.docs = docs ?? new ScopeDocGenerator();
  }

  /** Formats architecture prompt from task input. */
  protected formatPrompt(input: AgentInput): string {
    const task = (input.interpretation as Task | undefined) ?? input.task;
    return `Create scope for task ${task?.id ?? 'unknown'} ${task?.title ?? ''}`;
  }

  /** Parses baseline result, overridden by execute. */
  protected parseResult(_rawText: string): AgentResult {
    return { passed: true, message: 'Scope generated' };
  }

  /** Generates scope document using repo context and heuristics. */
  override async execute(input: AgentInput): Promise<AgentResult> {
    const base = await super.execute(input);
    const task = (input.interpretation as Task | undefined) ?? input.task;
    if (!task) return { ...base, passed: false, message: 'Missing task', blockers: ['missing-task'] };

    const tree = await this.github.getRepoTree();
    const files = tree.ok ? tree.data ?? [] : [];
    
    // Improved heuristic: look for file names mentioned in the task or default to index.ts
    const taskContent = `${task.title} ${task.description}`.toLowerCase();
    let target = files.filter(f => {
      const parts = f.toLowerCase().split(/[\\/]/);
      const name = parts[parts.length - 1];
      return name && (taskContent.includes(name) || (name.includes('index') && taskContent.includes('route')));
    });

    if (target.length === 0) {
      target = ['src/index.ts'];
    }
    
    // Limit to 3 files for safety in free tier
    target = target.slice(0, 3);
    
    const changePlan = target.map((f) => ({ file: f, changeType: 'modify' as const, summary: `Update ${f} for ${task.title}` }));

    const scope = this.docs.generate(task, {
      context: `Requirement from ${task.requestedBy}`,
      decision: 'Implement bounded changes, add tests, run reviewer consensus, create PR.',
      consequences: ['Faster delivery', 'Auditability preserved', 'Requires explicit approval'],
      affectedFiles: target,
      changePlan,
      rollbackStrategy: 'RollbackAgent reverts latest commit and opens incident issue.',
      estimatedHours: this.estimate(task.estimatedComplexity, target.length),
    });
    const artifacts = await this.docs.writeArtifacts(scope);
    scope.artifacts = artifacts;

    return { ...base, passed: true, message: 'Scope document generated', scope, data: scope, filesChanged: target };
  }

  /** Returns architect capability list. */
  getCapabilities(): string[] {
    return ['scope', 'adr', 'impact-analysis'];
  }

  /** Estimates hours from complexity and file count. */
  private estimate(complexity: Task['estimatedComplexity'], fileCount: number): number {
    const base = { S: 2, M: 4, L: 8, XL: 14 }[complexity];
    return base + Math.ceil(fileCount / 3);
  }
}
