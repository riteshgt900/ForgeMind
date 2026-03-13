import axios from 'axios';
import { AlertRouter } from './AlertRouter';
import { ErrorClassifier, type RuntimeMetric } from './ErrorClassifier';
import { SlackChannel } from '../channels/SlackChannel';

export class RuntimeMonitor {
  private readonly alertRouter: AlertRouter;
  private readonly classifier: ErrorClassifier;
  private readonly slack: SlackChannel;
  private readonly metrics: RuntimeMetric[] = [];
  private readonly intervalMs: number;
  private running = false;

  /** Initializes monitor with dependencies and interval config. */
  constructor(alertRouter?: AlertRouter, classifier?: ErrorClassifier, slack?: SlackChannel) {
    this.alertRouter = alertRouter ?? new AlertRouter();
    this.classifier = classifier ?? new ErrorClassifier();
    this.slack = slack ?? new SlackChannel();
    this.intervalMs = Number.parseInt(process.env.MONITOR_CHECK_INTERVAL_MS ?? '30000', 10);
  }

  /** Starts monitoring loop. */
  async start(): Promise<void> {
    if (this.running) return;
    this.running = true;
    while (this.running) {
      await this.check();
      await new Promise<void>((resolve) => setTimeout(resolve, this.intervalMs));
    }
  }

  /** Stops monitoring loop. */
  stop(): void {
    this.running = false;
  }

  /** Returns latest metric sample. */
  latestMetric(): RuntimeMetric | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] ?? null : null;
  }

  /** Performs one metric check and routes resulting alert action. */
  private async check(): Promise<void> {
    const metric = await this.collect();
    this.metrics.push(metric);
    if (this.metrics.length > 100) this.metrics.shift();

    const priority = this.classifier.classify(metric, this.metrics.slice(-3));
    if (!priority) return;

    if (priority === 'P0') {
      await this.slack.postAlert('P0 critical runtime error detected. Triggering rollback.');
      await this.alertRouter.triggerRollback(`P0 error rate ${(metric.errorRate * 100).toFixed(1)}%`);
      return;
    }
    if (priority === 'P1') {
      await this.slack.postAlert('P1 degraded runtime detected. Triggering debugger.');
      await this.alertRouter.triggerDebugger('P1 high error rate');
      return;
    }
    await this.slack.postAlert(`P2 warning latency=${metric.avgResponseMs.toFixed(0)}ms`);
  }

  /** Collects runtime metrics from APM endpoint or local fallback. */
  private async collect(): Promise<RuntimeMetric> {
    const apm = process.env.MONITOR_APM_URL;
    if (apm) {
      const res = await axios.get(apm, { timeout: 2500 });
      const d = res.data as Partial<RuntimeMetric>;
      return {
        errorRate: Number(d.errorRate ?? 0),
        avgResponseMs: Number(d.avgResponseMs ?? 0),
        memoryUsageMb: Number(d.memoryUsageMb ?? 0),
        timestamp: Number(d.timestamp ?? Date.now()),
      };
    }
    return {
      errorRate: Math.random() * 0.02,
      avgResponseMs: 150 + Math.random() * 120,
      memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
      timestamp: Date.now(),
    };
  }
}
