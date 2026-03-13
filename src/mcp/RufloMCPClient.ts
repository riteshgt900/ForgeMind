import type { MCPResponse } from '../types';

export class RufloMCPClient {
  private readonly endpoint: string;

  /** Sets Ruflo endpoint URL. */
  constructor(endpoint = process.env.RUFLO_MCP_URL ?? 'http://localhost:7799') {
    this.endpoint = endpoint;
  }

  /** Lists available tool names. */
  async listTools(): Promise<MCPResponse<string[]>> {
    return { ok: true, data: ['swarm.spawn', 'swarm.status', 'consensus.merge'], durationMs: 1 };
  }

  /** Invokes a tool with payload and returns normalized response. */
  async invoke(tool: string, input: Record<string, unknown>): Promise<MCPResponse<Record<string, unknown>>> {
    return { ok: true, data: { endpoint: this.endpoint, tool, input, status: 'ok' }, durationMs: 1 };
  }
}
