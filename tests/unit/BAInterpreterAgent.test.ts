import { BAInterpreterAgent } from '../../src/agents/BAInterpreterAgent';

describe('BAInterpreterAgent', () => {
  test('parses requirement into task', async () => {
    const agent = new BAInterpreterAgent();
    const result = await agent.execute({
      metadata: { requirement: 'Add dark mode toggle and persist preference.' },
    });
    expect(result.passed).toBe(true);
    expect(result.interpretation).toBeDefined();
    expect(result.interpretation?.acceptanceCriteria.length).toBeGreaterThan(0);
  });
});
