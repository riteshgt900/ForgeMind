import fs from 'node:fs/promises';
import path from 'node:path';
import type { MCPResponse } from '../types';

export class FilesystemMCPClient {
  private readonly root: string;

  /** Sets root path boundary for file operations. */
  constructor(root = process.cwd()) {
    this.root = path.resolve(root);
  }

  /** Reads one UTF-8 file relative to root. */
  async readFile(relativePath: string): Promise<MCPResponse<string>> {
    const started = Date.now();
    try {
      const full = this.resolve(relativePath);
      const data = await fs.readFile(full, 'utf8');
      return { ok: true, data, durationMs: Date.now() - started };
    } catch (error: unknown) {
      return { ok: false, error: error instanceof Error ? error.message : String(error), durationMs: Date.now() - started };
    }
  }

  /** Writes one UTF-8 file relative to root. */
  async writeFile(relativePath: string, content: string): Promise<MCPResponse<void>> {
    const started = Date.now();
    try {
      const full = this.resolve(relativePath);
      await fs.mkdir(path.dirname(full), { recursive: true });
      await fs.writeFile(full, content, 'utf8');
      return { ok: true, data: undefined, durationMs: Date.now() - started };
    } catch (error: unknown) {
      return { ok: false, error: error instanceof Error ? error.message : String(error), durationMs: Date.now() - started };
    }
  }

  /** Lists names under one directory. */
  async listFiles(relativeDir = '.'): Promise<MCPResponse<string[]>> {
    const started = Date.now();
    try {
      const full = this.resolve(relativeDir);
      const rows = await fs.readdir(full, { withFileTypes: true });
      return { ok: true, data: rows.map((r) => r.name), durationMs: Date.now() - started };
    } catch (error: unknown) {
      return { ok: false, error: error instanceof Error ? error.message : String(error), durationMs: Date.now() - started };
    }
  }

  /** Deletes one file if it exists. */
  async deleteFile(relativePath: string): Promise<MCPResponse<void>> {
    const started = Date.now();
    try {
      const full = this.resolve(relativePath);
      await fs.rm(full, { force: true });
      return { ok: true, data: undefined, durationMs: Date.now() - started };
    } catch (error: unknown) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - started,
      };
    }
  }

  /** Returns true when file exists relative to root. */
  async exists(relativePath: string): Promise<boolean> {
    try {
      const full = this.resolve(relativePath);
      await fs.access(full);
      return true;
    } catch {
      return false;
    }
  }

  /** Resolves and validates path inside root boundary. */
  private resolve(relativePath: string): string {
    const full = path.resolve(this.root, relativePath);
    if (!full.startsWith(this.root)) {
      throw new Error(`Path escapes root: ${relativePath}`);
    }
    return full;
  }
}
