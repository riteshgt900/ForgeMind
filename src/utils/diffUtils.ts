export interface DiffFileSummary {
  file: string;
  additions: number;
  deletions: number;
}

/** Parses unified diff into per-file summaries. */
export function parseUnifiedDiff(diff: string): DiffFileSummary[] {
  const lines = diff.split(/\r?\n/);
  const out: DiffFileSummary[] = [];
  let cur: DiffFileSummary | null = null;
  for (const line of lines) {
    if (line.startsWith('+++ b/')) {
      if (cur) {
        out.push(cur);
      }
      cur = { file: line.replace('+++ b/', ''), additions: 0, deletions: 0 };
      continue;
    }
    if (!cur) {
      continue;
    }
    if (line.startsWith('+') && !line.startsWith('+++')) {
      cur.additions += 1;
    }
    if (line.startsWith('-') && !line.startsWith('---')) {
      cur.deletions += 1;
    }
  }
  if (cur) {
    out.push(cur);
  }
  return out;
}

/** Computes aggregate totals from diff summaries. */
export function summarizeDiff(files: DiffFileSummary[]): { filesChanged: number; linesAdded: number; linesRemoved: number } {
  return {
    filesChanged: files.length,
    linesAdded: files.reduce((s, f) => s + f.additions, 0),
    linesRemoved: files.reduce((s, f) => s + f.deletions, 0),
  };
}
