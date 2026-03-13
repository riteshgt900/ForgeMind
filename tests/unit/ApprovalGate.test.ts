import { GateStorage } from '../../src/gates/GateStorage';
import { ApprovalGate } from '../../src/gates/ApprovalGate';
import type { ScopeDocument } from '../../src/types';

class MockSlack {
  async postApprovalRequest(): Promise<void> {}
  async postAlert(): Promise<void> {}
  async postMessage(): Promise<void> {}
  async postProgress(): Promise<void> {}
  async postFinalSummary(): Promise<void> {}
}

describe('ApprovalGate', () => {
  test('returns true when gate approved', async () => {
    process.env.FORGEMIND_GATE_TIMEOUT_MS = '250';
    process.env.FORGEMIND_GATE_POLL_MS = '50';

    const storage = new GateStorage('.tmp/test-gates.json');
    storage.clear();
    const gate = new ApprovalGate(storage, new MockSlack() as never);

    const scope: ScopeDocument = {
      taskId: 'task-g-1',
      title: 'Scope',
      context: 'ctx',
      decision: 'dec',
      consequences: [],
      affectedFiles: ['src/index.ts'],
      changePlan: [],
      rollbackStrategy: 'revert',
      estimatedHours: 1,
      riskLevel: 'LOW',
      markdown: '# Scope Document',
    };

    const pending = gate.requestApproval('task-g-1', scope);
    await new Promise((resolve) => setTimeout(resolve, 60));
    const rows = await storage.list();
    expect(rows.length).toBe(1);
    const first = rows[0];
    if (!first) {
      throw new Error('Expected one gate record');
    }
    await gate.resolve(first.gateId, 'APPROVED');
    await expect(pending).resolves.toBe(true);
  });
});
