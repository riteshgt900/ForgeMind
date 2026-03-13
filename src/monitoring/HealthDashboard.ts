import type { RuntimeMetric } from './ErrorClassifier';

export interface HealthPayload {
  service: string;
  status: 'ok' | 'degraded';
  environment: string;
  uptimeSeconds: number;
  monitorEnabled: boolean;
  queue: { size: number; pending: number };
  latestMetric: RuntimeMetric | null;
}

export class HealthDashboard {
  /** Creates health response payload. */
  render(input: {
    queueSize: number;
    queuePending: number;
    latestMetric: RuntimeMetric | null;
    monitorEnabled: boolean;
  }): HealthPayload {
    const degraded = input.latestMetric
      ? input.latestMetric.errorRate > 0.1 || input.latestMetric.avgResponseMs > 3000
      : false;

    return {
      service: 'forgemind',
      status: degraded ? 'degraded' : 'ok',
      environment: process.env.FORGEMIND_ENV ?? 'development',
      uptimeSeconds: Math.floor(process.uptime()),
      monitorEnabled: input.monitorEnabled,
      queue: { size: input.queueSize, pending: input.queuePending },
      latestMetric: input.latestMetric,
    };
  }
}
