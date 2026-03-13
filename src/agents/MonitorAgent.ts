import { BaseAgent } from './BaseAgent';
import { RuntimeMonitor } from '../monitoring/RuntimeMonitor';
import { resolveModelForAgent } from '../utils/modelResolver';
import type { AgentInput, AgentResult } from '../types';

export class MonitorAgent extends BaseAgent {
  private readonly monitor: RuntimeMonitor;

  /** Initializes monitor agent. */
  constructor(monitor?: RuntimeMonitor) {
    super({
      name: 'monitor',
      model: resolveModelForAgent('monitor'),
      systemPrompt: 'Monitor runtime metrics and route alerts by severity.',
      maxTokens: 512,
    });
    this.monitor = monitor ?? new RuntimeMonitor();
  }

  /** Formats monitor control prompt. */
  protected formatPrompt(input: AgentInput): string {
    return `Monitor action ${(input.metadata?.action as string | undefined) ?? 'start'}`;
  }

  /** Parses monitor action output. */
  protected parseResult(_rawText: string, input: AgentInput): AgentResult {
    const action = (input.metadata?.action as string | undefined) ?? 'start';
    return { passed: true, message: `Monitor action ${action}` };
  }

  /** Starts or stops monitor loop. */
  override async execute(input: AgentInput): Promise<AgentResult> {
    const base = await super.execute(input);
    const action = (input.metadata?.action as string | undefined) ?? 'start';
    if (action === 'stop') {
      this.monitor.stop();
      return { ...base, message: 'Runtime monitor stopped' };
    }
    void this.monitor.start();
    return { ...base, message: 'Runtime monitor started' };
  }

  /** Returns monitor capabilities. */
  getCapabilities(): string[] {
    return ['monitoring', 'alert-routing', 'daemon-control'];
  }
}
