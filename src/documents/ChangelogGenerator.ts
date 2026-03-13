import type { Task } from '../types';

export class ChangelogGenerator {
  /** Creates one changelog entry block. */
  createEntry(task: Task, summary: string, prUrl: string): string {
    const date = new Date().toISOString().slice(0, 10);
    return `## [${date}] ${task.id}\n- Title: ${task.title}\n- Requested By: ${task.requestedBy}\n- Risk: ${task.riskLevel}\n- Summary: ${summary}\n- PR: ${prUrl}`;
  }
}
