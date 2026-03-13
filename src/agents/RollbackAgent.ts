import simpleGit, { type SimpleGit } from 'simple-git';
import { BaseAgent } from './BaseAgent';
import { GitHubMCPClient } from '../mcp/GitHubMCPClient';
import { SlackChannel } from '../channels/SlackChannel';
import { logger } from '../utils/logger';
import { resolveModelForAgent } from '../utils/modelResolver';
import type { AgentInput, AgentResult } from '../types';

export class RollbackAgent extends BaseAgent {
  private readonly git: SimpleGit;
  private readonly github: GitHubMCPClient;
  private readonly slack: SlackChannel;

  /** Initializes rollback dependencies and model. */
  constructor(git?: SimpleGit, slack?: SlackChannel, github?: GitHubMCPClient) {
    super({
      name: 'rollback',
      model: resolveModelForAgent('rollback'),
      systemPrompt: 'Safely revert failing changes and report incidents.',
      maxTokens: 1024,
    });
    this.git = git ?? simpleGit();
    this.slack = slack ?? new SlackChannel();
    this.github = github ?? new GitHubMCPClient();
  }

  /** Formats rollback prompt. */
  protected formatPrompt(input: AgentInput): string {
    return `Rollback reason: ${input.reason ?? 'unknown'}`;
  }

  /** Parses baseline rollback output. */
  protected parseResult(rawText: string): AgentResult {
    return { passed: true, message: rawText.slice(0, 200) };
  }

  /** Executes git revert and incident notifications. */
  override async execute(input: AgentInput): Promise<AgentResult> {
    const base = await super.execute(input);
    const reason = input.reason ?? 'unknown';

    try {
      const isRepo = await this.git.checkIsRepo();
      if (!isRepo) {
        await this.slack.postAlert(`Rollback skipped: not a git repository. Reason=${reason}`);
        return { ...base, passed: false, message: 'Not a git repository', blockers: ['not-a-git-repository'] };
      }

      const from = (await this.git.revparse(['HEAD'])).trim();
      await this.git.raw(['revert', '--no-edit', 'HEAD']);
      const to = (await this.git.revparse(['HEAD'])).trim();

      const issue = await this.github.createIssue(
        'FORGEMIND rollback incident',
        `Reason: ${reason}\nFrom: ${from}\nTo: ${to}`,
      );

      logger.warn('rollback', `Rollback from ${from} to ${to}`, { logFile: 'logs/rollback.log', reason });
      await this.slack.postAlert(`Rollback completed: ${from} -> ${to}`);

      return {
        ...base,
        passed: true,
        message: `Rollback complete ${from} -> ${to}`,
        data: { revertedFromCommit: from, revertedToCommit: to, githubIssueUrl: issue.data ?? null },
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.fail('rollback', `Rollback failed: ${msg}`, { logFile: 'logs/rollback.log', reason });
      await this.slack.postAlert(`Rollback failed: ${msg}`);
      return { ...base, passed: false, message: `Rollback failed: ${msg}`, blockers: ['rollback-failed'] };
    }
  }

  /** Returns rollback capability list. */
  getCapabilities(): string[] {
    return ['git-revert', 'incident-reporting', 'issue-create'];
  }
}
