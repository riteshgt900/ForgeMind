import { QueenAgent } from '../../src/queen/QueenAgent';
import type { AgentInput, AgentResult, ScopeDocument, Task } from '../../src/types';

class MockStateMachine {
  private state = 'IDLE';
  async transition(next: string): Promise<void> {
    this.state = next;
  }
  getState(): string {
    return this.state;
  }
}

class MockRouter {
  async dispatch(agent: string, input: AgentInput): Promise<AgentResult> {
    if (agent === 'ba-interpreter') return { passed: true, message: 'ok', interpretation: input.task };
    if (agent === 'architect') {
      const scope: ScopeDocument = {
        taskId: input.task?.id ?? 'task',
        title: 'scope',
        context: 'ctx',
        decision: 'dec',
        consequences: [],
        affectedFiles: ['src/index.ts'],
        changePlan: [{ file: 'src/index.ts', changeType: 'modify', summary: 'change' }],
        rollbackStrategy: 'revert',
        estimatedHours: 1,
        riskLevel: 'LOW',
        markdown: '# Scope Document',
      };
      return { passed: true, message: 'scope', scope };
    }
    if (agent === 'coder') return { passed: true, message: 'implemented', filesChanged: ['src/index.ts'] };
    if (agent === 'tester') return { passed: true, message: 'tests', testResult: { passed: true, coverage: 90, summary: '', rawOutput: '', cases: [] } };
    if (agent.startsWith('reviewer-')) return { passed: true, message: 'review', blockers: [], suggestions: [], score: 9 };
    if (agent === 'devops') return { passed: true, message: 'pr', data: { url: 'https://github.com/mock/repo/pull/1' } };
    if (agent === 'rollback') return { passed: true, message: 'rollback' };
    if (agent === 'debugger') return { passed: true, message: 'debug' };
    throw new Error(`Unexpected agent ${agent}`);
  }
}

class MockMemory {
  async store(): Promise<void> {}
  async getCost(): Promise<number> { return 0; }
}

class MockBus {
  async publish(): Promise<void> {}
}

class MockGate {
  async requestApproval(): Promise<boolean> { return true; }
}

class MockConsensus {
  merge(): { approved: boolean; blockerCount: number; mergedBlockers: string[]; mergedSuggestions: string[]; averageScore: number } {
    return { approved: true, blockerCount: 0, mergedBlockers: [], mergedSuggestions: [], averageScore: 9 };
  }
}

describe('QueenAgent', () => {
  test('orchestrates happy path', async () => {
    const task: Task = {
      id: 'task_q_1',
      title: 'Title',
      description: 'Desc',
      acceptanceCriteria: ['one'],
      estimatedComplexity: 'M',
      affectedDomains: ['app'],
      riskLevel: 'LOW',
      requestedBy: 'ba@test.com',
      rawRequirement: 'Req',
      createdAt: new Date().toISOString(),
    };
    const queen = new QueenAgent(
      new MockStateMachine() as never,
      new MockRouter() as never,
      new MockMemory() as never,
      new MockBus() as never,
      new MockGate() as never,
      new MockConsensus() as never,
    );
    await expect(queen.orchestrate(task)).resolves.toBeUndefined();
  });
});
