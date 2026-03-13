import type { ScopeDocument, Task, TestResult } from '../types';

export class PRBodyGenerator {
  /** Generates PR body markdown from task, scope, and test result. */
  generate(
    task: Task,
    scope: ScopeDocument,
    testResult: TestResult,
    links?: {
      scopeMarkdownPath?: string;
      scopeDocxPath?: string;
      testMarkdownPath?: string;
      testDocxPath?: string;
      threadLink?: string;
    },
  ): string {
    const cveSummary = testResult.cveScan?.summary ?? 'Not executed';
    const scopeLinks = [
      links?.scopeMarkdownPath ? `- Markdown: \`${links.scopeMarkdownPath}\`` : '',
      links?.scopeDocxPath ? `- DOCX: \`${links.scopeDocxPath}\`` : '',
    ].filter((line) => line.length > 0);
    const testLinks = [
      links?.testMarkdownPath ? `- Markdown: \`${links.testMarkdownPath}\`` : '',
      links?.testDocxPath ? `- DOCX: \`${links.testDocxPath}\`` : '',
    ].filter((line) => line.length > 0);

    return [
      '## Summary',
      `${task.title}: ${task.description}`,
      '',
      '## Changes',
      ...scope.affectedFiles.map((f) => `- ${f}`),
      '',
      '## Test Results',
      `- Status: ${testResult.passed ? 'PASS' : 'FAIL'}`,
      `- Coverage: ${testResult.coverage}%`,
      `- CVE Scan: ${cveSummary}`,
      '',
      '## Scope Documents',
      ...(scopeLinks.length > 0 ? scopeLinks : ['- Not provided']),
      '',
      '## Test Case Documents',
      ...(testLinks.length > 0 ? testLinks : ['- Not provided']),
      '',
      '## Originating Slack Thread Link',
      links?.threadLink ? `- ${links.threadLink}` : '- Not provided',
      '',
      '## Breaking Changes',
      'None',
    ].join('\n');
  }
}
