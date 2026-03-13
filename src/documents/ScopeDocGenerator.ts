import fs from 'node:fs/promises';
import path from 'node:path';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import type { ScopeDocument, Task } from '../types';

export class ScopeDocGenerator {
  /** Generates scope document object and markdown. */
  generate(
    task: Task,
    input: {
      context: string;
      decision: string;
      consequences: string[];
      affectedFiles: string[];
      changePlan: ScopeDocument['changePlan'];
      rollbackStrategy: string;
      estimatedHours: number;
    },
  ): ScopeDocument {
    return {
      taskId: task.id,
      title: task.title,
      context: input.context,
      decision: input.decision,
      consequences: input.consequences,
      affectedFiles: input.affectedFiles,
      changePlan: input.changePlan,
      rollbackStrategy: input.rollbackStrategy,
      estimatedHours: input.estimatedHours,
      riskLevel: task.riskLevel,
      markdown: this.toMarkdown(task, input),
    };
  }

  /** Renders scope markdown for approval review. */
  toMarkdown(
    task: Task,
    input: {
      context: string;
      decision: string;
      consequences: string[];
      affectedFiles: string[];
      changePlan: ScopeDocument['changePlan'];
      rollbackStrategy: string;
      estimatedHours: number;
    },
  ): string {
    const consequences = input.consequences.map((c) => `- ${c}`).join('\n');
    const files = input.affectedFiles.map((f) => `- ${f}`).join('\n');
    const plan = input.changePlan.map((p) => `- ${p.changeType.toUpperCase()} ${p.file}: ${p.summary}`).join('\n');
    return `# Scope Document: ${task.title}\n\n## Context\n${input.context}\n\n## Decision\n${input.decision}\n\n## Consequences\n${consequences || '- None'}\n\n## Affected Files\n${files || '- None'}\n\n## Change Plan\n${plan || '- None'}\n\n## Rollback Strategy\n${input.rollbackStrategy}\n\nEstimated Hours: ${input.estimatedHours}`;
  }

  /** Writes scope markdown and DOCX artifacts to disk. */
  async writeArtifacts(
    scope: ScopeDocument,
    dir = path.join(process.cwd(), '.tmp', 'artifacts'),
  ): Promise<{ markdownPath: string; docxPath: string }> {
    const taskDir = path.join(dir, scope.taskId);
    await fs.mkdir(taskDir, { recursive: true });

    const markdownPath = path.join(taskDir, 'scope.md');
    await fs.writeFile(markdownPath, scope.markdown, 'utf8');

    const doc = new Document({
      sections: [{
        children: this.docxParagraphs(scope),
      }],
    });
    const buffer = await Packer.toBuffer(doc);
    const docxPath = path.join(taskDir, 'scope.docx');
    await fs.writeFile(docxPath, buffer);

    return { markdownPath, docxPath };
  }

  /** Converts scope object to docx paragraph blocks. */
  private docxParagraphs(scope: ScopeDocument): Paragraph[] {
    const paragraphs: Paragraph[] = [
      new Paragraph({
        text: `Scope Document: ${scope.title}`,
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({ children: [new TextRun(`Task: ${scope.taskId}`)] }),
      new Paragraph({ children: [new TextRun(`Risk: ${scope.riskLevel}`)] }),
      new Paragraph({ children: [new TextRun(`Estimated Hours: ${scope.estimatedHours}`)] }),
      new Paragraph({ text: '' }),
      new Paragraph({ text: 'Context', heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: scope.context }),
      new Paragraph({ text: 'Decision', heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: scope.decision }),
      new Paragraph({ text: 'Affected Files', heading: HeadingLevel.HEADING_2 }),
    ];
    for (const file of scope.affectedFiles) {
      paragraphs.push(new Paragraph({ text: `- ${file}` }));
    }
    paragraphs.push(new Paragraph({ text: 'Change Plan', heading: HeadingLevel.HEADING_2 }));
    for (const item of scope.changePlan) {
      paragraphs.push(new Paragraph({ text: `- ${item.changeType.toUpperCase()} ${item.file}: ${item.summary}` }));
    }
    paragraphs.push(new Paragraph({ text: 'Rollback Strategy', heading: HeadingLevel.HEADING_2 }));
    paragraphs.push(new Paragraph({ text: scope.rollbackStrategy }));
    return paragraphs;
  }
}
