import axios from 'axios';
import type { MCPResponse, PRResult } from '../types';

interface UpdateFile {
  path: string;
  content: string;
  message: string;
}

export class GitHubMCPClient {
  private readonly owner: string;
  private readonly repo: string;
  private readonly token: string | undefined;

  /** Initializes repository coordinates and auth token. */
  constructor() {
    this.owner = process.env.GITHUB_OWNER ?? 'mock-owner';
    this.repo = process.env.GITHUB_REPO ?? 'mock-repo';
    this.token = process.env.GITHUB_TOKEN;
  }

  /** Reads repository tree from GitHub API or deterministic mock output. */
  async getRepoTree(ref = process.env.GITHUB_DEFAULT_BRANCH ?? 'main'): Promise<MCPResponse<string[]>> {
    const started = Date.now();
    if (!this.token) {
      return {
        ok: true,
        data: ['src/index.ts', 'README.md', 'package.json'],
        durationMs: Date.now() - started,
      };
    }
    try {
      const b = await axios.get(
        `https://api.github.com/repos/${this.owner}/${this.repo}/branches/${ref}`,
        { headers: this.headers() },
      );
      const sha = b.data.commit.sha as string;
      const t = await axios.get(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/trees/${sha}?recursive=1`,
        { headers: this.headers() },
      );
      const files = (t.data.tree as Array<{ path: string; type: string }>)
        .filter((x) => x.type === 'blob')
        .map((x) => x.path);
      return { ok: true, data: files, durationMs: Date.now() - started };
    } catch (error: unknown) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - started,
      };
    }
  }

  /** Creates feature branch from default branch head commit. */
  async createBranch(branch: string): Promise<MCPResponse<string>> {
    const started = Date.now();
    if (!this.token) {
      return { ok: true, data: branch, durationMs: Date.now() - started };
    }
    try {
      const base = process.env.GITHUB_DEFAULT_BRANCH ?? 'main';
      const b = await axios.get(
        `https://api.github.com/repos/${this.owner}/${this.repo}/branches/${base}`,
        { headers: this.headers() },
      );
      await axios.post(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/refs`,
        { ref: `refs/heads/${branch}`, sha: b.data.commit.sha as string },
        { headers: this.headers() },
      );
      return { ok: true, data: branch, durationMs: Date.now() - started };
    } catch (error: unknown) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - started,
      };
    }
  }

  /** Commits file updates to branch or returns mock count. */
  async commitFiles(branch: string, updates: UpdateFile[]): Promise<MCPResponse<number>> {
    const started = Date.now();
    if (!this.token) {
      return { ok: true, data: updates.length, durationMs: Date.now() - started };
    }
    try {
      for (const u of updates) {
        await axios.put(
          `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${u.path}`,
          {
            message: u.message,
            content: Buffer.from(u.content, 'utf8').toString('base64'),
            branch,
          },
          { headers: this.headers() },
        );
      }
      return { ok: true, data: updates.length, durationMs: Date.now() - started };
    } catch (error: unknown) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - started,
      };
    }
  }

  /** Creates pull request and returns normalized PR result. */
  async createPullRequest(params: {
    title: string;
    body: string;
    head: string;
    base?: string;
  }): Promise<MCPResponse<PRResult>> {
    const started = Date.now();
    const base = params.base ?? process.env.GITHUB_DEFAULT_BRANCH ?? 'main';
    if (!this.token) {
      return {
        ok: true,
        data: {
          number: 1,
          url: `https://github.com/${this.owner}/${this.repo}/pull/1`,
          branch: params.head,
          baseBranch: base,
          title: params.title,
          body: params.body,
          filesChanged: 0,
        },
        durationMs: Date.now() - started,
      };
    }
    try {
      const pr = await axios.post(
        `https://api.github.com/repos/${this.owner}/${this.repo}/pulls`,
        {
          title: params.title,
          body: params.body,
          head: params.head,
          base,
        },
        { headers: this.headers() },
      );
      return {
        ok: true,
        data: {
          number: pr.data.number as number,
          url: pr.data.html_url as string,
          branch: params.head,
          baseBranch: base,
          title: params.title,
          body: params.body,
          filesChanged: 0,
        },
        durationMs: Date.now() - started,
      };
    } catch (error: unknown) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - started,
      };
    }
  }

  /** Applies labels to one pull request issue. */
  async addLabels(prNumber: number, labels: string[]): Promise<MCPResponse<number>> {
    const started = Date.now();
    if (labels.length === 0) {
      return { ok: true, data: 0, durationMs: Date.now() - started };
    }
    if (!this.token) {
      return { ok: true, data: labels.length, durationMs: Date.now() - started };
    }
    try {
      await axios.post(
        `https://api.github.com/repos/${this.owner}/${this.repo}/issues/${prNumber}/labels`,
        { labels },
        { headers: this.headers() },
      );
      return { ok: true, data: labels.length, durationMs: Date.now() - started };
    } catch (error: unknown) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - started,
      };
    }
  }

  /** Requests reviewers for one pull request. */
  async requestReviewers(prNumber: number, reviewers: string[]): Promise<MCPResponse<number>> {
    const started = Date.now();
    if (reviewers.length === 0) {
      return { ok: true, data: 0, durationMs: Date.now() - started };
    }
    if (!this.token) {
      return { ok: true, data: reviewers.length, durationMs: Date.now() - started };
    }
    try {
      await axios.post(
        `https://api.github.com/repos/${this.owner}/${this.repo}/pulls/${prNumber}/requested_reviewers`,
        { reviewers },
        { headers: this.headers() },
      );
      return { ok: true, data: reviewers.length, durationMs: Date.now() - started };
    } catch (error: unknown) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - started,
      };
    }
  }

  /** Creates issue and returns URL. */
  async createIssue(title: string, body: string): Promise<MCPResponse<string>> {
    const started = Date.now();
    if (!this.token) {
      return {
        ok: true,
        data: `https://github.com/${this.owner}/${this.repo}/issues/1`,
        durationMs: Date.now() - started,
      };
    }
    try {
      const issue = await axios.post(
        `https://api.github.com/repos/${this.owner}/${this.repo}/issues`,
        { title, body },
        { headers: this.headers() },
      );
      return {
        ok: true,
        data: issue.data.html_url as string,
        durationMs: Date.now() - started,
      };
    } catch (error: unknown) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - started,
      };
    }
  }

  /** Builds GitHub API headers when token is available. */
  private headers(): Record<string, string> {
    if (!this.token) {
      return {};
    }
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }
}
