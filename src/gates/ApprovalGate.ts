import { SlackChannel } from '../channels/SlackChannel';
import { GoogleChatChannel } from '../channels/GoogleChatChannel';
import { GateStorage, type GateRecord, type GateStatus } from './GateStorage';
import { logger } from '../utils/logger';
import type { ScopeDocument } from '../types';

export class ApprovalGate {
  private readonly slack: SlackChannel;
  private readonly googleChat: GoogleChatChannel;
  private readonly storage: GateStorage;
  private readonly timeoutMs: number;
  private readonly pollMs: number;
  private readonly maxIterations = 5;

  /** Configures gate runtime settings and dependencies. */
  constructor(storage?: GateStorage, slack?: SlackChannel, googleChat?: GoogleChatChannel) {
    this.storage = storage ?? new GateStorage();
    this.slack = slack ?? new SlackChannel();
    this.googleChat = googleChat ?? new GoogleChatChannel();
    this.timeoutMs = Number.parseInt(process.env.FORGEMIND_GATE_TIMEOUT_MS ?? '86400000', 10);
    this.pollMs = Number.parseInt(process.env.FORGEMIND_GATE_POLL_MS ?? '5000', 10);
  }

  /** Requests human approval and waits for terminal status. */
  async requestApproval(
    taskId: string,
    scope: ScopeDocument,
    iteration = 0,
    channel: 'slack' | 'google-chat' = 'slack',
    requesterId?: string,
    threadRef?: string,
  ): Promise<boolean> {
    if (iteration > this.maxIterations) return false;

    const gateId = `gate_${taskId}_${Date.now()}`;
    const record: GateRecord = {
      gateId,
      taskId,
      scope,
      channel,
      requesterId,
      threadRef,
      status: 'PENDING',
      createdAt: Date.now(),
    };
    await this.storage.save(record);
    await this.postApproval(record);
    logger.info('approval-gate', `Gate created ${gateId}`, {
      logFile: 'logs/approval_gate.log',
      taskId,
      channel,
      iteration,
    });

    const status = await this.poll(gateId);
    if (status === 'ITERATION_REQUESTED') {
      return this.requestApproval(taskId, scope, iteration + 1, channel, requesterId, threadRef);
    }
    return status === 'APPROVED';
  }

  /** Resolves gate decision via webhook callback. */
  async resolve(gateId: string, decision: GateStatus, comment?: string): Promise<void> {
    const row = await this.storage.update(gateId, { status: decision, resolvedAt: Date.now(), comment });
    logger.info('approval-gate', `Gate resolved ${gateId} -> ${decision}`, {
      logFile: 'logs/approval_gate.log',
      taskId: row.taskId,
      channel: row.channel ?? 'slack',
      comment,
    });
  }

  /** Returns storage object for tests and diagnostics. */
  getStorage(): GateStorage {
    return this.storage;
  }

  /** Polls gate status until timeout or final decision. */
  private async poll(gateId: string): Promise<GateStatus> {
    const max = Math.max(1, Math.floor(this.timeoutMs / this.pollMs));
    for (let i = 0; i < max; i += 1) {
      await new Promise<void>((resolve) => setTimeout(resolve, this.pollMs));
      const gate = await this.storage.get(gateId);
      if (gate.status !== 'PENDING') return gate.status;
    }
    await this.resolve(gateId, 'TIMED_OUT', 'timeout');
    const gate = await this.storage.get(gateId);
    await this.postAlert(gate.channel ?? 'slack', `Approval gate timed out: ${gateId}`);
    return 'TIMED_OUT';
  }

  /** Sends approval request to channel adapter. */
  private async postApproval(record: GateRecord): Promise<void> {
    if (record.channel === 'google-chat') {
      await this.googleChat.postApprovalRequest(record.taskId, record.gateId, record.scope);
      return;
    }
    await this.slack.postApprovalRequest(record.taskId, record.gateId, record.scope);
  }

  /** Sends alert to the matching channel adapter. */
  private async postAlert(channel: 'slack' | 'google-chat', message: string): Promise<void> {
    if (channel === 'google-chat') {
      await this.googleChat.postAlert(message);
      return;
    }
    await this.slack.postAlert(message);
  }
}
