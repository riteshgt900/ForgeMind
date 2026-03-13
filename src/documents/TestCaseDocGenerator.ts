import fs from 'node:fs/promises';
import path from 'node:path';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import type { TestCase, TestResult } from '../types';

export class TestCaseDocGenerator {
  /** Generates test case markdown document. */
  generate(testResult: TestResult): string {
    return [
      '# Test Case Document',
      '',
      `Status: ${testResult.passed ? 'PASS' : 'FAIL'}`,
      `Coverage: ${testResult.coverage}%`,
      `Summary: ${testResult.summary}`,
      '',
      ...testResult.cases.map((c, i) => this.renderCase(c, i + 1)),
    ].join('\n');
  }

  /** Writes markdown and docx test case artifacts to target directory. */
  async writeArtifacts(
    taskId: string,
    testResult: TestResult,
    dir = path.join(process.cwd(), '.tmp', 'artifacts'),
  ): Promise<{ markdownPath: string; docxPath: string }> {
    const taskDir = path.join(dir, taskId);
    await fs.mkdir(taskDir, { recursive: true });

    const markdown = this.generate(testResult);
    const markdownPath = path.join(taskDir, 'test-cases.md');
    await fs.writeFile(markdownPath, markdown, 'utf8');

    const doc = new Document({
      sections: [{
        children: this.docxLines(testResult),
      }],
    });
    const buffer = await Packer.toBuffer(doc);
    const docxPath = path.join(taskDir, 'test-cases.docx');
    await fs.writeFile(docxPath, buffer);
    return { markdownPath, docxPath };
  }

  /** Renders one test case section. */
  private renderCase(testCase: TestCase, index: number): string {
    const pre = testCase.preconditions.map((p) => `- ${p}`).join('\n');
    const steps = testCase.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
    return `## Case ${index}: ${testCase.scenario}\nStatus: ${testCase.status}\nSeverity: ${testCase.severity}\n\n### Preconditions\n${pre}\n\n### Steps\n${steps}\n\n### Expected\n${testCase.expectedResult}\n\n### Actual\n${testCase.actualResult}`;
  }

  /** Builds document paragraphs for DOCX export. */
  private docxLines(testResult: TestResult): Paragraph[] {
    const paragraphs: Paragraph[] = [
      new Paragraph({
        text: 'Test Case Document',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({ children: [new TextRun(`Status: ${testResult.passed ? 'PASS' : 'FAIL'}`)] }),
      new Paragraph({ children: [new TextRun(`Coverage: ${testResult.coverage}%`)] }),
      new Paragraph({ children: [new TextRun(`Summary: ${testResult.summary}`)] }),
      new Paragraph({ text: '' }),
    ];
    for (let i = 0; i < testResult.cases.length; i += 1) {
      const testCase = testResult.cases[i];
      if (!testCase) continue;
      paragraphs.push(new Paragraph({
        text: `Case ${i + 1}: ${testCase.scenario}`,
        heading: HeadingLevel.HEADING_2,
      }));
      paragraphs.push(new Paragraph({ text: `Status: ${testCase.status} | Severity: ${testCase.severity}` }));
      paragraphs.push(new Paragraph({ text: `Expected: ${testCase.expectedResult}` }));
      paragraphs.push(new Paragraph({ text: `Actual: ${testCase.actualResult}` }));
      paragraphs.push(new Paragraph({ text: '' }));
    }
    return paragraphs;
  }
}
