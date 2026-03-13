import type { FinalSummaryMeta, PRResult, ScopeDocument, TestResult } from '../types';

export abstract class BaseChannel {
  /** Posts a plain channel message. */
  abstract postMessage(message: string): Promise<void>;

  /** Posts an alert channel message. */
  abstract postAlert(message: string): Promise<void>;

  /** Posts approval request with gate actions. */
  abstract postApprovalRequest(taskId: string, gateId: string, scope: ScopeDocument): Promise<void>;

  /** Posts task progress update. */
  abstract postProgress(taskId: string, message: string): Promise<void>;

  /** Posts final task summary. */
  abstract postFinalSummary(
    taskId: string,
    pr: PRResult,
    testResult: TestResult,
    meta?: FinalSummaryMeta,
  ): Promise<void>;
}
