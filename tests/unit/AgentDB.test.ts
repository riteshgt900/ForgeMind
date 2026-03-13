import { AgentDB } from '../../src/swarm/AgentDB';

describe('AgentDB', () => {
  test('stores and searches', async () => {
    const db = AgentDB.getInstance();
    db.clear();
    await db.store('task1', 'architect', 'Create scope', { cost: 0.1 });
    await db.store('task1', 'tester', 'Run tests', { cost: 0.2 });
    const rows = await db.search('scope', 2);
    expect(rows.length).toBeGreaterThan(0);
    const cost = await db.getCost('task1');
    expect(cost).toBeCloseTo(0.3, 5);
  });
});
