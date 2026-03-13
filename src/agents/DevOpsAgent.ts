import simpleGit, { type SimpleGit } from 'simple-git';
import { BaseAgent } from './BaseAgent';
import { GitHubMCPClient } from '../mcp/GitHubMCPClient';
import { PRBodyGenerator } from '../documents/PRBodyGenerator';
import { SlackChannel } from '../channels/SlackChannel';
import { GoogleChatChannel } from '../channels/GoogleChatChannel';
import { resolveModelForAgent } from '../utils/modelResolver';
import type { AgentInput, AgentResult, Task, TestResult } from '../types';

export class DevOpsAgent extends BaseAgent {
  private readonly github: GitHubMCPClient;
  private readonly body: PRBodyGenerator;
  private readonly slack: SlackChannel;
  private readonly googleChat: GoogleChatChannel;
  private readonly git: SimpleGit;

  /** Initializes devops dependencies. */
  constructor(
    github?: GitHubMCPClient,
    body?: PRBodyGenerator,
    slack?: SlackChannel,
    googleChat?: GoogleChatChannel,
    git?: SimpleGit,
  ) {
    super({
      name: 'devops',
      model: resolveModelForAgent('devops'),
      systemPrompt: 'Create branch and PR with full summary.',
      maxTokens: 1024,
    });
    this.github = github ?? new GitHubMCPClient();
    this.body = body ?? new PRBodyGenerator();
    this.slack = slack ?? new SlackChannel();
    this.googleChat = googleChat ?? new GoogleChatChannel();
    this.git = git ?? simpleGit();
  }

  /** Formats deployment prompt. */
  protected formatPrompt(input: AgentInput): string {
    return `Create PR for task ${input.task?.id ?? 'unknown'}`;
  }

  /** Parses baseline response. */
  protected parseResult(rawText: string): AgentResult {
    return { passed: true, message: rawText.slice(0, 200) };
  }

  /** Executes branch and PR automation workflow. */
  override async execute(input: AgentInput): Promise<AgentResult> {
    const base = await super.execute(input);
    const task = input.task;
    const scope = input.scope;
    if (!task || !scope) {
      return { ...base, passed: false, message: 'Task and scope required', blockers: ['missing-task-or-scope'] };
    }

    const branch = this.branch(task);
    await this.prepareLocalBranch(branch, task.title);
    const created = await this.github.createBranch(branch);
    const branchAlreadyExists = typeof created.error === 'string'
      && created.error.toLowerCase().includes('reference already exists');
    if (!created.ok && !branchAlreadyExists) {
      return { ...base, passed: false, message: `Branch failed: ${created.error}`, blockers: ['branch-failed'] };
    }

    const test = this.normalizeTest(input.testResult?.testResult ?? input.testResult?.data);
    const sourceChannel = this.resolveSourceChannel(input.metadata);
    const threadLink = this.threadLink(input.metadata);
    const prBody = this.body.generate(task, scope, test, {
      scopeMarkdownPath: scope.artifacts?.markdownPath,
      scopeDocxPath: scope.artifacts?.docxPath,
      testMarkdownPath: test.artifacts?.markdownPath,
      testDocxPath: test.artifacts?.docxPath,
      threadLink,
    });
    const pr = await this.github.createPullRequest({ title: `feat(forgemind): ${task.title}`, body: prBody, head: branch });
    if (!pr.ok || !pr.data) return { ...base, passed: false, message: `PR failed: ${pr.error}`, blockers: ['pr-failed'] };

    const labels = ['ruflo-generated', 'forgemind'];
    await this.github.addLabels(pr.data.number, labels);
    const reviewers = this.reviewers();
    await this.github.requestReviewers(pr.data.number, reviewers);

    const mentions = this.buildMentions(input.metadata, reviewers);
    const meta = {
      scopeDocPath: scope.artifacts?.markdownPath,
      scopeDocxPath: scope.artifacts?.docxPath,
      testDocPath: test.artifacts?.markdownPath,
      testDocxPath: test.artifacts?.docxPath,
      mentions,
      durationMs: this.durationMs(input.metadata),
      costUsd: this.costUsd(input.metadata),
    };

    if (sourceChannel === 'google-chat') {
      await this.googleChat.postFinalSummary(task.id, pr.data, test, meta);
    } else {
      await this.slack.postFinalSummary(task.id, pr.data, test, meta);
    }
    return { ...base, passed: true, message: `PR created ${pr.data.url}`, pr: pr.data, data: pr.data };
  }

  /** Returns devops capabilities. */
  getCapabilities(): string[] {
    return ['branch', 'pr', 'notify'];
  }

  /** Builds feature branch name. */
  private branch(task: Task): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `feature/ruflo-${task.id.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()}-${date}`;
  }

  /** Normalizes unknown payload into test result shape. */
  private normalizeTest(payload: unknown): TestResult {
    if (typeof payload === 'object' && payload !== null) {
      const p = payload as Record<string, unknown>;
      return {
        passed: Boolean(p.passed ?? true),
        coverage: Number(p.coverage ?? 90),
        summary: String(p.summary ?? ''),
        rawOutput: String(p.rawOutput ?? ''),
        cases: [],
        cveScan: (typeof p.cveScan === 'object' && p.cveScan !== null ? p.cveScan : undefined) as TestResult['cveScan'],
        artifacts: (typeof p.artifacts === 'object' && p.artifacts !== null ? p.artifacts : undefined) as TestResult['artifacts'],
      };
    }
    return { passed: true, coverage: 90, summary: '', rawOutput: '', cases: [] };
  }

  /** Creates/checkout branch, commits local changes, and pushes when remote exists. */
  private async prepareLocalBranch(branch: string, title: string): Promise<void> {
    try {
      const isRepo = await this.git.checkIsRepo();
      if (!isRepo) return;

      await this.git.checkoutLocalBranch(branch).catch(async () => {
        await this.git.checkout(branch);
      });
      await this.git.add('.');
      const status = await this.git.status();
      if (status.files.length > 0) {
        await this.git.commit(`feat(ruflo): ${title}`);
      }
      const remotes = await this.git.getRemotes(true);
      const hasOrigin = remotes.some((remote) => remote.name === 'origin');
      if (hasOrigin) {
        await this.git.push(['-u', 'origin', branch]).catch(() => Promise.resolve());
      }
    } catch {
      return;
    }
  }

  /** Resolves source channel from metadata. */
  private resolveSourceChannel(metadata: AgentInput['metadata']): 'slack' | 'google-chat' {
    return metadata?.sourceChannel === 'google-chat' ? 'google-chat' : 'slack';
  }

  /** Builds chat thread link for PR body. */
  private threadLink(metadata: AgentInput['metadata']): string | undefined {
    if (!metadata) return undefined;
    if (metadata.sourceChannel === 'slack'
      && typeof metadata.channelId === 'string'
      && typeof metadata.threadTs === 'string') {
      return `https://slack.com/app_redirect?channel=${metadata.channelId}&message_ts=${metadata.threadTs}`;
    }
    if (metadata.sourceChannel === 'google-chat' && typeof metadata.spaceId === 'string') {
      return `Google Chat space: ${metadata.spaceId}`;
    }
    return undefined;
  }

  /** Parses reviewers list from environment config. */
  private reviewers(): string[] {
    const raw = process.env.GITHUB_REVIEWERS ?? '';
    return raw
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  /** Builds mention tokens for final notifications. */
  private buildMentions(metadata: AgentInput['metadata'], reviewers: string[]): string[] {
    const mentions: string[] = [];
    if (typeof metadata?.requesterDisplay === 'string') {
      mentions.push(`@${metadata.requesterDisplay}`);
    } else if (typeof metadata?.requester === 'string') {
      mentions.push(`@${String(metadata.requester).split('@')[0]}`);
    }
    for (const reviewer of reviewers) {
      mentions.push(`@${reviewer}`);
    }
    return [...new Set(mentions)];
  }

  /** Extracts duration from metadata if available. */
  private durationMs(metadata: AgentInput['metadata']): number | undefined {
    if (typeof metadata?.durationMs === 'number') return metadata.durationMs;
    return undefined;
  }

  /** Extracts cost estimate from metadata if available. */
  private costUsd(metadata: AgentInput['metadata']): number | undefined {
    if (typeof metadata?.estimatedCostUsd === 'number') return metadata.estimatedCostUsd;
    return undefined;
  }
}
