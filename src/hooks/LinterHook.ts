import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import path from 'node:path';

const execAsync = promisify(exec);

export class LinterHook {
  /** Runs lint command for changed files. */
  async run(filePaths: string[]): Promise<{ success: boolean; output: string }> {
    if (filePaths.length === 0) {
      return { success: true, output: 'No files provided.' };
    }
    try {
      const args = filePaths.map((p) => `"${path.relative(process.cwd(), p)}"`).join(' ');
      const bin = path.join(process.cwd(), 'node_modules', '.bin', 'eslint.cmd');
      const { stdout, stderr } = await execAsync(`"${bin}" ${args}`);
      return { success: true, output: `${stdout}${stderr}`.trim() };
    } catch (error: unknown) {
      return { success: false, output: error instanceof Error ? error.message : String(error) };
    }
  }
}
