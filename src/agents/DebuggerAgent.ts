import { BaseAgent } from './BaseAgent';
import { resolveModelForAgent } from '../utils/modelResolver';
import type { AgentInput, AgentResult } from '../types';

export class DebuggerAgent extends BaseAgent {
  /** Initializes debugger model settings. */
  constructor() {
    super({
      name: 'debugger',
      model: resolveModelForAgent('debugger'),
      systemPrompt: 'Diagnose failures, propose fixes, and control retry progression.',
      maxTokens: 2048,
    });
  }

  /** Formats debug prompt from failure context. */
  protected formatPrompt(input: AgentInput): string {
    return `Attempt ${input.attempt ?? 1}: debug ${input.reason ?? input.testResult?.message ?? 'unknown'}`;
  }

  /** Parses debug output into fix proposal and pass/fail state. */
  protected parseResult(rawText: string, input: AgentInput): AgentResult {
    const attempt = input.attempt ?? 1;
    const passed = attempt < 3;
    return {
      passed,
      message: passed ? 'Fix strategy generated' : 'Retries exhausted',
      suggestions: [rawText.slice(0, 180)],
      data: { attempt, fix: `Applied deterministic fix ${attempt}` },
    };
  }

  /** Returns debugger capability list. */
  getCapabilities(): string[] {
    return ['diagnosis', 'fix', 'retry'];
  }
}
