import { WebClient } from '@slack/web-api';
import fs from 'node:fs';
import { BaseChannel } from './BaseChannel';
import type { FinalSummaryMeta, PRResult, ScopeDocument, TestResult } from '../types';

interface MockMessage {
  channel: string;
  text: string;
  threadTs?: string;
  blocks?: unknown[];
}

export class SlackChannel extends BaseChannel {
  private readonly channel: string;
  private readonly alertsChannel: string;
  private readonly prChannel: string;
  private readonly client: WebClient | null;
  private readonly threadMap = new Map<string, string>();
  private readonly mock: MockMessage[] = [];

  /** Initializes Slack adapter with optional API token. */
  constructor() {
    super();
    this.channel = process.env.SLACK_CHANNEL ?? '#ai-dev-requests';
    this.alertsChannel = process.env.SLACK_ALERTS_CHANNEL ?? '#dev-alerts';
    this.prChannel = process.env.SLACK_PR_CHANNEL ?? this.channel;
    this.client = process.env.SLACK_BOT_TOKEN ? new WebClient(process.env.SLACK_BOT_TOKEN) : null;
  }

  /** Posts scope approval request message. */
  async postApprovalRequest(taskId: string, gateId: string, scope: ScopeDocument): Promise<void> {
    const base = process.env.FORGEMIND_WEBHOOK_URL ?? 'http://localhost:3000/webhooks';
    const approveUrl = `${base}/gate/${gateId}/approve`;
    const iterateUrl = `${base}/gate/${gateId}/iterate`;
    const rejectUrl = `${base}/gate/${gateId}/reject`;
    const ts = await this.send({
      channel: this.channel,
      text: `Scope ready for task ${taskId}: ${scope.title}\nApprove: ${approveUrl}\nRequest changes: ${iterateUrl}\nReject: ${rejectUrl}`,
      blocks: [
        { type: 'section', text: { type: 'mrkdwn', text: `*Task:* ${scope.title}` } },
        { type: 'section', text: { type: 'mrkdwn', text: `*Risk:* ${scope.riskLevel}\n*Estimated:* ${scope.estimatedHours}h` } },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              action_id: 'gate_approve',
              style: 'primary',
              text: { type: 'plain_text', text: 'Approve Scope' },
              value: JSON.stringify({ gateId, action: 'approve' }),
            },
            {
              type: 'button',
              action_id: 'gate_iterate',
              text: { type: 'plain_text', text: 'Request Changes' },
              value: JSON.stringify({ gateId, action: 'iterate' }),
            },
            {
              type: 'button',
              action_id: 'gate_reject',
              style: 'danger',
              text: { type: 'plain_text', text: 'Reject' },
              value: JSON.stringify({ gateId, action: 'reject' }),
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Fallback links: <${approveUrl}|Approve> | <${iterateUrl}|Iterate> | <${rejectUrl}|Reject>`,
          },
        },
      ],
    });
    this.threadMap.set(taskId, ts);
  }

  /** Posts progress update in task thread. */
  async postProgress(taskId: string, message: string): Promise<void> {
    await this.send({ channel: this.channel, threadTs: this.threadMap.get(taskId), text: message });
  }

  /** Posts final summary in task thread. */
  async postFinalSummary(
    taskId: string,
    pr: PRResult,
    testResult: TestResult,
    meta?: FinalSummaryMeta,
  ): Promise<void> {
    const channel = this.prChannel || this.channel;
    const mentions = (meta?.mentions ?? []).join(' ');
    const duration = typeof meta?.durationMs === 'number' ? ` | duration ${(meta.durationMs / 1000).toFixed(1)}s` : '';
    const cost = typeof meta?.costUsd === 'number' ? ` | est cost $${meta.costUsd.toFixed(4)}` : '';
    await this.send({
      channel,
      threadTs: this.threadMap.get(taskId),
      text: `Task complete: ${pr.url} | tests ${testResult.passed ? 'PASS' : 'FAIL'} | coverage ${testResult.coverage}%${duration}${cost}${mentions ? `\n${mentions}` : ''}`,
    });
    await this.uploadSummaryArtifacts(channel, this.threadMap.get(taskId), meta);
  }

  /** Posts alert message. */
  async postAlert(message: string): Promise<void> {
    await this.send({ channel: this.alertsChannel, text: message });
  }

  /** Posts plain message to default channel. */
  async postMessage(message: string): Promise<void> {
    await this.send({ channel: this.channel, text: message });
  }

  /** Exposes mock message history for tests. */
  getMockMessages(): MockMessage[] {
    return [...this.mock];
  }

  /** Sends message via Slack API or local mock sink. */
  private async send(message: MockMessage): Promise<string> {
    if (!this.client) {
      const ts = `${Date.now()}`;
      this.mock.push(message);
      return ts;
    }
    const res = await this.client.chat.postMessage({
      channel: message.channel,
      text: message.text,
      thread_ts: message.threadTs,
      blocks: message.blocks as never,
    });
    return (res.ts ?? `${Date.now()}`).toString();
  }

  /** Uploads generated scope/test artifacts into the task thread when available. */
  private async uploadSummaryArtifacts(
    channel: string,
    threadTs: string | undefined,
    meta: FinalSummaryMeta | undefined,
  ): Promise<void> {
    if (!this.client || !meta) return;
    const files = [
      meta.scopeDocPath,
      meta.scopeDocxPath,
      meta.testDocPath,
      meta.testDocxPath,
    ].filter((item): item is string => typeof item === 'string' && item.length > 0);
    for (const file of files) {
      if (!fs.existsSync(file)) continue;
      await this.client.files.uploadV2({
        channel_id: channel,
        thread_ts: threadTs,
        file: fs.createReadStream(file) as never,
        filename: file.split(/[\\/]/).pop(),
        title: file.split(/[\\/]/).pop(),
      } as never);
    }
  }
}
