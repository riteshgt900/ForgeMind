import { GitHubMCPClient } from '../../src/mcp/GitHubMCPClient';

describe('github-mcp integration', () => {
  test('creates mock PR in no-token mode', async () => {
    delete process.env.GITHUB_TOKEN;
    const client = new GitHubMCPClient();
    const result = await client.createPullRequest({ title: 'Test PR', body: 'Body', head: 'feature/test' });
    expect(result.ok).toBe(true);
    expect(result.data?.url).toContain('/pull/1');
  });
});
