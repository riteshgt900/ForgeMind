import fs from 'node:fs';
import path from 'node:path';
import simpleGit from 'simple-git';
import { RollbackAgent } from '../../src/agents/RollbackAgent';

class MockSlack {
  async postAlert(): Promise<void> {}
  async postApprovalRequest(): Promise<void> {}
  async postMessage(): Promise<void> {}
  async postProgress(): Promise<void> {}
  async postFinalSummary(): Promise<void> {}
}

class MockGitHub {
  async createIssue(): Promise<{ ok: boolean; data: string }> {
    return { ok: true, data: 'https://github.com/mock/repo/issues/1' };
  }
}

describe('RollbackAgent', () => {
  test('fails gracefully outside git repo', async () => {
    const dir = path.join(process.cwd(), '.tmp', 'rollback-no-repo');
    fs.mkdirSync(dir, { recursive: true });
    const git = simpleGit(dir);
    const agent = new RollbackAgent(git, new MockSlack() as never, new MockGitHub() as never);
    const result = await agent.execute({ reason: 'test' });
    expect(result.passed).toBe(false);
    expect(result.blockers).toContain('not-a-git-repository');
  });
});
