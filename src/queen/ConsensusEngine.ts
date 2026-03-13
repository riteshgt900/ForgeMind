import type { AgentResult } from '../types';

export interface ConsensusResult {
  approved: boolean;
  blockerCount: number;
  mergedBlockers: string[];
  mergedSuggestions: string[];
  averageScore: number;
}

export class ConsensusEngine {
  /** Merges review results with blocker majority rules. */
  merge(results: AgentResult[]): ConsensusResult {
    const blockers = results.flatMap((r) => r.blockers ?? []);
    const suggestions = results.flatMap((r) => r.suggestions ?? []);
    const scores = results.map((r) => r.score ?? 0);
    const freq = blockers.reduce<Record<string, number>>((acc, block) => {
      acc[block] = (acc[block] ?? 0) + 1;
      return acc;
    }, {});
    const mergedBlockers = Object.entries(freq)
      .filter(([, count]) => count >= 2)
      .map(([block]) => block);
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return {
      approved: mergedBlockers.length === 0,
      blockerCount: mergedBlockers.length,
      mergedBlockers,
      mergedSuggestions: [...new Set(suggestions)],
      averageScore: avg,
    };
  }
}
