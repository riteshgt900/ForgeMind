import { CoderAgent } from '../../src/agents/CoderAgent';
import type { ScopeDocument, Task } from '../../src/types';

describe('CoderAgent', () => {
  test('returns changed files from scope', async () => {
    const task: Task = {
      id: 'task_c_1',
      title: 'Title',
      description: 'Desc',
      acceptanceCriteria: ['one'],
      estimatedComplexity: 'S',
      affectedDomains: ['backend'],
      riskLevel: 'LOW',
      requestedBy: 'ba@test.com',
      rawRequirement: 'Req',
      createdAt: new Date().toISOString(),
    };
    const scope: ScopeDocument = {
      taskId: task.id,
      title: task.title,
      context: 'c',
      decision: 'd',
      consequences: [],
      affectedFiles: ['src/index.ts'],
      changePlan: [{ file: 'src/index.ts', changeType: 'modify', summary: 'update' }],
      rollbackStrategy: 'revert',
      estimatedHours: 1,
      riskLevel: 'LOW',
      markdown: '# Scope Document',
    };
    const agent = new CoderAgent();
    const result = await agent.execute({ task, scope });
    expect(result.passed).toBe(true);
    expect(result.filesChanged).toEqual(['src/index.ts']);
  });
});
