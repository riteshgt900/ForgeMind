import { BaseAgent } from './BaseAgent';
import { resolveModelForAgent } from '../utils/modelResolver';
import type { AgentInput, AgentResult } from '../types';

export type ReviewerMode = 'quality' | 'security' | 'performance';

/** Reviewer agent variant that audits code quality, security, or performance. */
export class ReviewerAgent extends BaseAgent {
  private readonly mode: ReviewerMode;

  /** Creates reviewer instance for a specific review dimension. */
  constructor(mode: ReviewerMode) {
    const agentName = `reviewer-${mode}` as const;
    super({
      name: agentName,
      model: resolveModelForAgent(agentName),
      systemPrompt: `You are the ${mode} reviewer. Return clear blockers, suggestions, and a score from 0-10.`,
      maxTokens: 2048,
    });
    this.mode = mode;
  }

  /** Formats review prompt from implementation and test context. */
  protected formatPrompt(input: AgentInput): string {
    const files = input.implementation?.filesChanged?.join(', ') ?? 'unknown files';
    return `Review changed files for ${this.mode}: ${files}`;
  }

  /** Parses deterministic review output with score and blocker extraction. */
  protected parseResult(_rawText: string, input: AgentInput): AgentResult {
    const files = input.implementation?.filesChanged ?? [];
    const fileText = files.join(' ').toLowerCase();

    const blockers: string[] = [];
    const suggestions: string[] = [];
    let score = 9;

    if (this.mode === 'security' && fileText.includes('secret')) {
      blockers.push('Potential secret exposure detected in changed file names.');
      score = 4;
    }

    if (this.mode === 'performance' && fileText.includes('loop')) {
      suggestions.push('Review hot-loop complexity and memory allocations.');
      score = Math.min(score, 7);
    }

    if (this.mode === 'quality') {
      suggestions.push('Ensure public functions have concise JSDoc and explicit return types.');
    }

    return {
      passed: blockers.length === 0,
      message: `${this.mode} review complete`,
      blockers,
      suggestions,
      score,
      data: { mode: this.mode },
    };
  }

  /** Returns reviewer capabilities. */
  getCapabilities(): string[] {
    return [`${this.mode}-review`, 'scoring', 'blocker-detection'];
  }
}
