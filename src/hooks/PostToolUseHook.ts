import { LinterHook } from './LinterHook';
import { TestRunnerHook } from './TestRunnerHook';
import { SlackProgressHook } from './SlackProgressHook';

export class PostToolUseHook {
  private readonly linter: LinterHook;
  private readonly tester: TestRunnerHook;
  private readonly slack: SlackProgressHook;

  /** Creates post tool hook with dependencies. */
  constructor(linter?: LinterHook, tester?: TestRunnerHook, slack?: SlackProgressHook) {
    this.linter = linter ?? new LinterHook();
    this.tester = tester ?? new TestRunnerHook();
    this.slack = slack ?? new SlackProgressHook();
  }

  /** Runs lint and optional tests then posts progress. */
  async run(input: { taskId: string; phase: string; changedFiles: string[]; runTests?: boolean }): Promise<{ lintSuccess: boolean; testSuccess: boolean; lintOutput: string; testOutput: string }> {
    const lint = await this.linter.run(input.changedFiles);
    const test = input.runTests ? await this.tester.run() : { passed: true, output: 'Skipped' };
    await this.slack.run(input.taskId, input.phase, `Lint ${lint.success ? 'ok' : 'failed'}, tests ${test.passed ? 'ok' : 'failed'}`);
    return {
      lintSuccess: lint.success,
      testSuccess: test.passed,
      lintOutput: lint.output,
      testOutput: test.output,
    };
  }
}
