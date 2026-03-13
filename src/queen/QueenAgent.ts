import { StateMachine } from './StateMachine';
import { TaskRouter } from './TaskRouter';
import { ConsensusEngine } from './ConsensusEngine';
import { AgentDB } from '../swarm/AgentDB';
import { MessageBus } from '../swarm/MessageBus';
import { ApprovalGate } from '../gates/ApprovalGate';
import { logger } from '../utils/logger';
import { costTracker } from '../utils/costTracker';
import type { AgentResult, Task } from '../types';

export class QueenAgent {
  private readonly stateMachine: StateMachine;
  private readonly router: TaskRouter;
  private readonly memory: AgentDB;
  private readonly bus: MessageBus;
  private readonly gate: ApprovalGate;
  private readonly consensus: ConsensusEngine;

  /** Initializes queen orchestration dependencies. */
  constructor(
    stateMachine?: StateMachine,
    router?: TaskRouter,
    memory?: AgentDB,
    bus?: MessageBus,
    gate?: ApprovalGate,
    consensus?: ConsensusEngine,
  ) {
    this.stateMachine = stateMachine ?? new StateMachine();
    this.router = router ?? new TaskRouter();
    this.memory = memory ?? AgentDB.getInstance();
    this.bus = bus ?? MessageBus.getInstance();
    this.gate = gate ?? new ApprovalGate();
    this.consensus = consensus ?? new ConsensusEngine();
  }

  /** Orchestrates end-to-end task workflow from BA interpretation to PR. */
  async orchestrate(task: Task): Promise<void> {
    const startedAt = Date.now();
    logger.success('queen', `Starting task ${task.id}`);
    await this.memory.store(task.id, 'queen', task);

    try {
      await this.stateMachine.transition('ANALYZING');
      await this.bus.publish('workflow.milestone', { taskId: task.id, state: 'ANALYZING' });

      const [interpretation, scopeSeed] = await Promise.all([
        this.router.dispatch('ba-interpreter', {
          task,
          metadata: { requirement: task.rawRequirement, source: task.source?.channel ?? 'api' },
        }),
        this.router.dispatch('architect', {
          task,
          metadata: { parallelStage: 'analysis' },
        }),
      ]);

      const interpreted = interpretation.interpretation ?? task;
      const scopeResult = scopeSeed.scope
        ? scopeSeed
        : await this.router.dispatch('architect', {
            task,
            interpretation: interpreted,
            metadata: { parallelStage: 'scoping' },
          });

      if (!scopeResult.scope) {
        throw new Error('Missing scope');
      }

      await this.stateMachine.transition('SCOPING');
      await this.bus.publish('workflow.milestone', { taskId: task.id, state: 'SCOPING' });
      await this.stateMachine.transition('AWAITING_APPROVAL');
      await this.bus.publish('workflow.milestone', { taskId: task.id, state: 'AWAITING_APPROVAL' });
      const channel = task.source?.channel === 'google-chat' ? 'google-chat' : 'slack';
      const approved = await this.gate.requestApproval(
        task.id,
        scopeResult.scope,
        0,
        channel,
        task.source?.requesterId,
        task.source?.threadTs ?? task.source?.spaceId,
      );
      if (!approved) {
        await this.stateMachine.transition('REJECTED');
        logger.fail('queen', `Task ${task.id} rejected`);
        await this.bus.publish('workflow.milestone', { taskId: task.id, state: 'REJECTED' });
        return;
      }

      await this.stateMachine.transition('IMPLEMENTING');
      await this.bus.publish('workflow.milestone', { taskId: task.id, state: 'IMPLEMENTING' });
      const implementation = await this.router.dispatch('coder', {
        task,
        scope: scopeResult.scope,
        metadata: {
          sourceChannel: task.source?.channel ?? 'api',
          threadTs: task.source?.threadTs,
          requesterId: task.source?.requesterId,
        },
      });

      await this.stateMachine.transition('TESTING');
      await this.bus.publish('workflow.milestone', { taskId: task.id, state: 'TESTING' });
      let testResult = await this.router.dispatch('tester', {
        task,
        implementation,
        metadata: {
          runTests: true,
          runCveScan: true,
          sourceChannel: task.source?.channel ?? 'api',
        },
      });
      if (!testResult.passed) {
        await this.stateMachine.transition('DEBUGGING');
        await this.bus.publish('workflow.milestone', { taskId: task.id, state: 'DEBUGGING' });
        const fixed = await this.autoFix(task, testResult, implementation);
        if (!fixed.fixed || !fixed.testResult) {
          await this.stateMachine.transition('FAILED');
          await this.router.dispatch('rollback', { task, reason: 'Auto-fix exhausted' });
          return;
        }
        await this.stateMachine.transition('TESTING');
        testResult = fixed.testResult;
      }

      await this.stateMachine.transition('REVIEWING');
      await this.bus.publish('workflow.milestone', { taskId: task.id, state: 'REVIEWING' });
      const review = await this.runReview(task, implementation);
      if (!review.passed) {
        await this.stateMachine.transition('FAILED');
        return;
      }

      await this.stateMachine.transition('DEPLOYING');
      await this.bus.publish('workflow.milestone', { taskId: task.id, state: 'DEPLOYING' });
      const usage = costTracker.getTaskUsage(task.id);
      const pr = await this.router.dispatch('devops', {
        task,
        scope: scopeResult.scope,
        implementation,
        testResult,
        review,
        metadata: {
          sourceChannel: task.source?.channel ?? 'api',
          requester: task.requestedBy,
          requesterDisplay: task.source?.requesterDisplay,
          requesterId: task.source?.requesterId,
          channelId: task.source?.channelId,
          threadTs: task.source?.threadTs,
          spaceId: task.source?.spaceId,
          durationMs: Date.now() - startedAt,
          estimatedCostUsd: usage.estimatedCostUsd,
        },
      });
      if (!pr.passed) {
        throw new Error(pr.message);
      }

      await this.stateMachine.transition('COMPLETE');
      await this.bus.publish('workflow.milestone', { taskId: task.id, state: 'COMPLETE', pr: pr.pr });
      await this.memory.store(task.id, 'devops', pr.data ?? pr.message);
      costTracker.record(task.id);
      logger.success('queen', `Task ${task.id} complete`);
    } catch (error: unknown) {
      logger.fail(
        'queen',
        `Orchestration failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      if (this.stateMachine.getState() !== 'FAILED') {
        await this.stateMachine.transition('FAILED').catch(() => Promise.resolve());
      }
      await this.router.dispatch('rollback', {
        task,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /** Attempts debugger and re-test loop up to three times. */
  private async autoFix(
    task: Task,
    testResult: AgentResult,
    implementation: AgentResult,
  ): Promise<{ fixed: boolean; testResult?: AgentResult }> {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const fix = await this.router.dispatch('debugger', {
        task,
        testResult,
        implementation,
        attempt,
      });
      const retest = await this.router.dispatch('tester', {
        task,
        implementation: {
          ...implementation,
          data: { implementation: implementation.data, fix: fix.data },
        },
        metadata: { runTests: true, runCveScan: true },
      });
      if (retest.passed) {
        return { fixed: true, testResult: retest };
      }
    }
    await this.bus.publish('slack', {
      type: 'ESCALATE',
      taskId: task.id,
      reason: 'Auto-fix exhausted',
    });
    return { fixed: false };
  }

  /** Runs reviewer swarm and merges consensus result. */
  private async runReview(task: Task, implementation: AgentResult): Promise<AgentResult> {
    const [quality, security, performance] = await Promise.all([
      this.router.dispatch('reviewer-quality', { task, implementation }),
      this.router.dispatch('reviewer-security', { task, implementation }),
      this.router.dispatch('reviewer-performance', { task, implementation }),
    ]);
    const merged = this.consensus.merge([quality, security, performance]);
    return {
      passed: merged.approved,
      message: merged.approved ? 'Review approved' : 'Review blocked',
      blockers: merged.mergedBlockers,
      suggestions: merged.mergedSuggestions,
      score: merged.averageScore,
      data: merged,
    };
  }
}
