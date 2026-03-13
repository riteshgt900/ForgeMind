import { ArchitectAgent } from '../../src/agents/ArchitectAgent';
import type { Task } from '../../src/types';

describe('ArchitectAgent', () => {
  test('generates scope', async () => {
    const task: Task = {
      id: 'task_a_1',
      title: 'Add endpoint',
      description: 'Add a health endpoint',
      acceptanceCriteria: ['Returns status'],
      estimatedComplexity: 'M',
      affectedDomains: ['backend'],
      riskLevel: 'LOW',
      requestedBy: 'ba@test.com',
      rawRequirement: 'Add endpoint',
      createdAt: new Date().toISOString(),
    };
    const agent = new ArchitectAgent();
    const result = await agent.execute({ task, interpretation: task });
    expect(result.passed).toBe(true);
    expect(result.scope).toBeDefined();
    expect(result.scope?.affectedFiles.length).toBeGreaterThan(0);
  });
});
