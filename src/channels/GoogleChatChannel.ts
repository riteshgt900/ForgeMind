import axios from 'axios';
import { BaseChannel } from './BaseChannel';
import type { FinalSummaryMeta, PRResult, ScopeDocument, TestResult } from '../types';

export class GoogleChatChannel extends BaseChannel {
  private readonly webhook: string | undefined;
  private readonly mock: string[] = [];

  /** Initializes Google Chat channel adapter. */
  constructor() {
    super();
    this.webhook = process.env.GOOGLE_CHAT_WEBHOOK_URL;
  }

  /** Posts approval request. */
  async postApprovalRequest(taskId: string, gateId: string, scope: ScopeDocument): Promise<void> {
    const base = process.env.FORGEMIND_WEBHOOK_URL ?? 'http://localhost:3000/webhooks';
    const card = {
      cardsV2: [
        {
          cardId: `scope_${gateId}`,
          card: {
            header: {
              title: `Scope ready: ${scope.title}`,
              subtitle: `Risk ${scope.riskLevel} · ${scope.estimatedHours}h`,
            },
            sections: [
              {
                widgets: [
                  {
                    textParagraph: {
                      text: `Task ${taskId}<br/>Approve: ${base}/gate/${gateId}/approve`,
                    },
                  },
                  {
                    buttonList: {
                      buttons: [
                        {
                          text: 'Approve',
                          onClick: {
                            action: {
                              function: 'resolve_gate',
                              parameters: [
                                { key: 'gateId', value: gateId },
                                { key: 'decision', value: 'approve' },
                              ],
                            },
                          },
                        },
                        {
                          text: 'Request Changes',
                          onClick: {
                            action: {
                              function: 'resolve_gate',
                              parameters: [
                                { key: 'gateId', value: gateId },
                                { key: 'decision', value: 'iterate' },
                              ],
                            },
                          },
                        },
                        {
                          text: 'Reject',
                          onClick: {
                            action: {
                              function: 'resolve_gate',
                              parameters: [
                                { key: 'gateId', value: gateId },
                                { key: 'decision', value: 'reject' },
                              ],
                            },
                          },
                        },
                      ],
                    },
                  },
                  {
                    textParagraph: {
                      text: `Fallback links: ${base}/gate/${gateId}/approve`,
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
      text: `Scope for ${taskId}: ${scope.title}`,
    };
    await this.send(card);
  }

  /** Posts progress update. */
  async postProgress(taskId: string, message: string): Promise<void> {
    await this.send(`[${taskId}] ${message}`);
  }

  /** Posts final summary. */
  async postFinalSummary(
    taskId: string,
    pr: PRResult,
    testResult: TestResult,
    meta?: FinalSummaryMeta,
  ): Promise<void> {
    const duration = typeof meta?.durationMs === 'number' ? ` | duration ${(meta.durationMs / 1000).toFixed(1)}s` : '';
    const cost = typeof meta?.costUsd === 'number' ? ` | est cost $${meta.costUsd.toFixed(4)}` : '';
    const mentions = (meta?.mentions ?? []).join(' ');
    const message = `[${taskId}] complete ${pr.url} tests=${testResult.passed} coverage=${testResult.coverage}${duration}${cost}${mentions ? ` ${mentions}` : ''}`;
    await this.send({ text: message });
  }

  /** Posts alert message. */
  async postAlert(message: string): Promise<void> {
    await this.send(`ALERT: ${message}`);
  }

  /** Posts plain message. */
  async postMessage(message: string): Promise<void> {
    await this.send(message);
  }

  /** Returns mock messages. */
  getMockMessages(): string[] {
    return [...this.mock];
  }

  /** Sends text to webhook or mock sink. */
  private async send(payload: string | Record<string, unknown>): Promise<void> {
    const text =
      typeof payload === 'string'
        ? payload
        : typeof payload.text === 'string'
          ? payload.text
          : JSON.stringify(payload);
    if (!this.webhook) {
      this.mock.push(text);
      return;
    }
    if (typeof payload === 'string') {
      await axios.post(this.webhook, { text });
      return;
    }
    await axios.post(this.webhook, payload);
  }
}
