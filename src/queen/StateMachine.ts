import type { WorkflowState, WorkflowTransition } from '../types';

const transitions: WorkflowTransition[] = [
  { from: 'IDLE', to: 'ANALYZING', trigger: 'task_received' },
  { from: 'ANALYZING', to: 'SCOPING', trigger: 'interpretation_complete' },
  { from: 'SCOPING', to: 'AWAITING_APPROVAL', trigger: 'scope_ready' },
  { from: 'AWAITING_APPROVAL', to: 'IMPLEMENTING', trigger: 'approved' },
  { from: 'AWAITING_APPROVAL', to: 'SCOPING', trigger: 'iteration_requested' },
  { from: 'AWAITING_APPROVAL', to: 'REJECTED', trigger: 'rejected' },
  { from: 'IMPLEMENTING', to: 'TESTING', trigger: 'implementation_complete' },
  { from: 'TESTING', to: 'DEBUGGING', trigger: 'tests_failed' },
  { from: 'TESTING', to: 'REVIEWING', trigger: 'tests_passed' },
  { from: 'DEBUGGING', to: 'TESTING', trigger: 'fix_applied' },
  { from: 'DEBUGGING', to: 'FAILED', trigger: 'max_retries_exceeded' },
  { from: 'REVIEWING', to: 'DEPLOYING', trigger: 'review_approved' },
  { from: 'DEPLOYING', to: 'COMPLETE', trigger: 'pr_created' },
  { from: 'FAILED', to: 'ROLLING_BACK', trigger: 'rollback_triggered' },
];

export class StateMachine {
  private state: WorkflowState = 'IDLE';

  /** Returns current workflow state. */
  getState(): WorkflowState {
    return this.state;
  }

  /** Applies state transition after validation. */
  async transition(next: WorkflowState): Promise<void> {
    if (this.state === next) return;
    const valid = transitions.some((t) => t.from === this.state && t.to === next);
    if (!valid) throw new Error(`Invalid transition ${this.state} -> ${next}`);
    this.state = next;
  }

  /** Resets workflow state to IDLE. */
  reset(): void {
    this.state = 'IDLE';
  }
}
