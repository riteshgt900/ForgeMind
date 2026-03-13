export type SlackApprovalAction = 'approve' | 'reject' | 'iterate';

export interface SlackMessagePayload {
  channel: string;
  text: string;
  threadTs?: string;
  blocks?: unknown[];
}

export interface SlackApprovalPayload {
  gateId: string;
  action: SlackApprovalAction;
  comment?: string;
  userId?: string;
}

export interface FinalSummaryMeta {
  scopeDocPath?: string;
  scopeDocxPath?: string;
  testDocPath?: string;
  testDocxPath?: string;
  mentions?: string[];
  durationMs?: number;
  costUsd?: number;
}
