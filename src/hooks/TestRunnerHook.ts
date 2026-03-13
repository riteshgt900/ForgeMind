import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export class TestRunnerHook {
  /** Runs tests and returns pass/fail output. */
  async run(command = 'npm.cmd test -- --passWithNoTests'): Promise<{ passed: boolean; output: string }> {
    try {
      const { stdout, stderr } = await execAsync(command);
      return { passed: true, output: `${stdout}${stderr}`.trim() };
    } catch (error: unknown) {
      return { passed: false, output: error instanceof Error ? error.message : String(error) };
    }
  }
}
