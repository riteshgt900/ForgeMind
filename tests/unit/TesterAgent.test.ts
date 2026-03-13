import { TesterAgent } from '../../src/agents/TesterAgent';

describe('TesterAgent', () => {
  test('produces testResult', async () => {
    const agent = new TesterAgent();
    const result = await agent.execute({
      implementation: { passed: true, message: 'done', filesChanged: ['src/index.ts'] },
    });
    expect(result.passed).toBe(true);
    expect(result.testResult).toBeDefined();
    expect(result.testResult?.cases.length).toBeGreaterThan(0);
  });
});
