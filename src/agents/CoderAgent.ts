import path from 'node:path';
import { BaseAgent } from './BaseAgent';
import { FilesystemMCPClient } from '../mcp/FilesystemMCPClient';
import { PostToolUseHook } from '../hooks/PostToolUseHook';
import { resolveModelForAgent } from '../utils/modelResolver';
import type { AgentInput, AgentResult, ScopeDocument, Task } from '../types';

/** Implements scope-approved changes while enforcing file-boundary guardrails. */
export class CoderAgent extends BaseAgent {
  private readonly fsClient: FilesystemMCPClient;
  private readonly postToolHook: PostToolUseHook;

  /** Configures model and local filesystem hook integrations. */
  constructor(fsClient?: FilesystemMCPClient, postToolHook?: PostToolUseHook) {
    super({
      name: 'coder',
      model: resolveModelForAgent('coder'),
      systemPrompt:
        'You implement approved scope file-by-file, never touching out-of-scope files. Keep code concise, readable, and testable.',
      maxTokens: 4096,
    });
    this.fsClient = fsClient ?? new FilesystemMCPClient();
    this.postToolHook = postToolHook ?? new PostToolUseHook();
  }

  /** Builds implementation prompt from scope change plan. */
  protected formatPrompt(input: AgentInput): string {
    const scope = input.scope;
    const changePlan = scope?.changePlan.map((item) => `${item.changeType}:${item.file}`).join(', ') ?? 'none';
    return `Implement approved change plan for task ${input.task?.id ?? 'unknown'} using files ${changePlan}`;
  }

  /** Parses model output into a structured implementation result envelope. */
  protected parseResult(rawText: string, input: AgentInput): AgentResult {
    const scope = input.scope;
    const changedFiles = scope?.changePlan.map((item) => item.file) ?? [];
    return {
      passed: true,
      message: 'Implementation prepared',
      data: {
        implementationSummary: rawText,
        changedFiles,
      },
      filesChanged: changedFiles,
    };
  }

  /** Executes implementation flow and emits hook side effects. */
  override async execute(input: AgentInput): Promise<AgentResult> {
    const scope = input.scope;
    if (!scope) {
      return {
        passed: false,
        message: 'Scope is required for coder execution',
        blockers: ['missing-scope'],
      };
    }

    this.validateScope(scope);
    const base = await super.execute(input);
    const changedFiles = await this.applyApprovedChanges(
      input.task,
      scope,
      typeof base.data === 'object' && base.data !== null
        ? String((base.data as { implementationSummary?: string }).implementationSummary ?? '')
        : '',
      input,
    );
    await this.writeImplementationRecord(input.task?.id ?? 'unknown-task', base, changedFiles);

    const skipHooks = input.metadata?.skipHooks === true || process.env.NODE_ENV === 'test';
    if (!skipHooks) {
      for (const file of changedFiles) {
        await this.postToolHook.run({
          taskId: input.task?.id ?? 'unknown-task',
          phase: 'IMPLEMENTING',
          changedFiles: [file],
          runTests: false,
        });
      }
    }

    return { ...base, filesChanged: changedFiles };
  }

  /** Returns supported capabilities for routing and diagnostics. */
  getCapabilities(): string[] {
    return ['file-implementation', 'scope-enforcement', 'post-tool-hook'];
  }

  /** Validates that scope change plan contains safe relative file paths. */
  private validateScope(scope: ScopeDocument): void {
    for (const item of scope.changePlan) {
      const normalized = path.normalize(item.file);
      if (path.isAbsolute(normalized) || normalized.startsWith('..')) {
        throw new Error(`Unsafe scope path detected: ${item.file}`);
      }
    }
  }

  /** Writes implementation summary artifact for traceability and tests. */
  private async writeImplementationRecord(
    taskId: string,
    result: AgentResult,
    changedFiles: string[],
  ): Promise<void> {
    const payload = {
      taskId,
      timestamp: new Date().toISOString(),
      message: result.message,
      changedFiles,
      data: result.data,
    };
    await this.fsClient.writeFile(`.tmp/implementation-${taskId}.json`, JSON.stringify(payload, null, 2));
  }

  /** Applies scope change plan to repository files with deterministic safe edits. */
  private async applyApprovedChanges(
    task: Task | undefined,
    scope: ScopeDocument,
    implementationSummary: string,
    input: AgentInput,
  ): Promise<string[]> {
    const skipApply = input.metadata?.applyChanges === false || process.env.NODE_ENV === 'test';
    const changedFiles = scope.changePlan.map((item) => item.file);
    if (skipApply) {
      return changedFiles;
    }

    for (const item of scope.changePlan) {
      if (item.changeType === 'delete') {
        await this.fsClient.deleteFile(item.file);
        continue;
      }

      if (item.changeType === 'create') {
        const body = this.buildTemplate(task, item.file, item.summary, implementationSummary);
        await this.fsClient.writeFile(item.file, body);
        continue;
      }

      const existing = await this.fsClient.readFile(item.file);
      if (!existing.ok || typeof existing.data !== 'string') {
        const body = this.buildTemplate(task, item.file, item.summary, implementationSummary);
        await this.fsClient.writeFile(item.file, body);
        continue;
      }
      const updated = this.injectChange(existing.data, task, item.summary);
      await this.fsClient.writeFile(item.file, updated);
    }
    return changedFiles;
  }

  /** Creates deterministic content for newly generated files. */
  private buildTemplate(
    task: Task | undefined,
    filePath: string,
    summary: string,
    implementationSummary: string,
  ): string {
    if (filePath.endsWith('.md')) {
      return [
        `# ${task?.title ?? 'FORGEMIND Generated File'}`,
        '',
        `Task: ${task?.id ?? 'unknown-task'}`,
        `Summary: ${summary}`,
        '',
        implementationSummary || 'Generated by FORGEMIND CoderAgent.',
        '',
      ].join('\n');
    }
    return [
      `// Generated by FORGEMIND for task ${task?.id ?? 'unknown-task'}`,
      `// Summary: ${summary}`,
      '',
      'export const forgemindGenerated = true;',
      '',
    ].join('\n');
  }

  /** Injects a reversible implementation block at file tail for scoped modifications. */
  private injectChange(existing: string, task: Task | undefined, summary: string): string {
    const marker = `FORGEMIND_CHANGE_${task?.id ?? 'unknown-task'}`;
    if (existing.includes(marker)) return existing;
    const footer = [
      '',
      `/* ${marker}`,
      ` * ${summary}`,
      ` * Generated at ${new Date().toISOString()}`,
      ' */',
      '',
    ].join('\n');
    return `${existing.trimEnd()}\n${footer}`;
  }
}
