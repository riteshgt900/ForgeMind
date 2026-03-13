import fs from 'node:fs';
import type { AgentUsage } from '../types';
import { logger } from './logger';

interface TaskUsage {
  input: number;
  output: number;
  total: number;
  estimatedCostUsd: number;
  perAgent: Record<string, AgentUsage>;
}

const COST_PER_1K_INPUT = 0.003;
const COST_PER_1K_OUTPUT = 0.015;

class CostTracker {
  private readonly usage = new Map<string, TaskUsage>();

  /** Adds token usage for one agent and task. */
  addUsage(taskId: string, agent: string, usage: AgentUsage): void {
    const row = this.usage.get(taskId) ?? {
      input: 0,
      output: 0,
      total: 0,
      estimatedCostUsd: 0,
      perAgent: {},
    };
    row.input += usage.inputTokens;
    row.output += usage.outputTokens;
    row.total += usage.totalTokens;
    row.perAgent[agent] = usage;
    row.estimatedCostUsd = this.estimate(row.input, row.output);
    this.usage.set(taskId, row);
  }

  /** Returns aggregate usage for task. */
  getTaskUsage(taskId: string): TaskUsage {
    return this.usage.get(taskId) ?? {
      input: 0,
      output: 0,
      total: 0,
      estimatedCostUsd: 0,
      perAgent: {},
    };
  }

  /** Records final task usage in cost tracker log. */
  record(taskId: string): void {
    const row = this.getTaskUsage(taskId);
    const payload = {
      timestamp: new Date().toISOString(),
      task_id: taskId,
      tokens_used: { input: row.input, output: row.output, total: row.total },
      estimated_cost_usd: Number(row.estimatedCostUsd.toFixed(6)),
      per_agent: row.perAgent,
      status: 'RECORDED',
    };
    const costFile = logger.files().cost ?? 'logs/cost_tracker.log';
    fs.appendFileSync(costFile, `${JSON.stringify(payload)}\n`, 'utf8');
  }

  /** Estimates USD cost from token totals. */
  estimate(inputTokens: number, outputTokens: number): number {
    return (inputTokens / 1000) * COST_PER_1K_INPUT + (outputTokens / 1000) * COST_PER_1K_OUTPUT;
  }
}

export const costTracker = new CostTracker();
