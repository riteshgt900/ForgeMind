export interface AgentMetric {
  agent: string;
  durationMs: number;
  success: boolean;
  timestamp: string;
}

export class SwarmMetrics {
  private readonly metrics: AgentMetric[] = [];

  /** Records a metric sample. */
  record(agent: string, durationMs: number, success: boolean): void {
    this.metrics.push({ agent, durationMs, success, timestamp: new Date().toISOString() });
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }
  }

  /** Returns metrics for one agent. */
  byAgent(agent: string): AgentMetric[] {
    return this.metrics.filter((m) => m.agent === agent);
  }

  /** Returns overall success rate. */
  successRate(): number {
    if (this.metrics.length === 0) {
      return 1;
    }
    const success = this.metrics.filter((m) => m.success).length;
    return success / this.metrics.length;
  }

  /** Returns snapshot of metrics. */
  snapshot(): AgentMetric[] {
    return [...this.metrics];
  }
}
