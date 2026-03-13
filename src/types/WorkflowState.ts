export type WorkflowState =
  | 'IDLE'
  | 'ANALYZING'
  | 'SCOPING'
  | 'AWAITING_APPROVAL'
  | 'IMPLEMENTING'
  | 'TESTING'
  | 'DEBUGGING'
  | 'REVIEWING'
  | 'DEPLOYING'
  | 'COMPLETE'
  | 'FAILED'
  | 'REJECTED'
  | 'ROLLING_BACK';

export interface WorkflowTransition {
  from: WorkflowState;
  to: WorkflowState;
  trigger: string;
}
