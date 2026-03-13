export interface RuntimeMetric {
  errorRate: number;
  avgResponseMs: number;
  memoryUsageMb: number;
  timestamp: number;
}

export type AlertPriority = 'P0' | 'P1' | 'P2' | null;

export class ErrorClassifier {
  private readonly p0: number;
  private readonly p1: number;

  /** Loads threshold configuration. */
  constructor() {
    this.p0 = Number.parseFloat(process.env.MONITOR_P0_ERROR_RATE_THRESHOLD ?? '0.5');
    this.p1 = Number.parseFloat(process.env.MONITOR_P1_ERROR_RATE_THRESHOLD ?? '0.1');
  }

  /** Classifies metric plus recent samples into priority level. */
  classify(metric: RuntimeMetric, recent: RuntimeMetric[]): AlertPriority {
    const sample = recent.length > 0 ? recent : [metric];
    const avgErr = sample.reduce((s, m) => s + m.errorRate, 0) / sample.length;
    if (avgErr >= this.p0) return 'P0';
    if (avgErr >= this.p1) return 'P1';
    if (metric.avgResponseMs > 5000) return 'P2';
    return null;
  }
}
