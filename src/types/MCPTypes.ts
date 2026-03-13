export interface MCPRequest {
  server: 'github' | 'filesystem' | 'ruflo';
  tool: string;
  input: Record<string, unknown>;
  requestId?: string;
}

export interface MCPResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  durationMs: number;
}

export interface MCPTrace {
  requestId: string;
  startedAt: string;
  finishedAt: string;
  server: string;
  tool: string;
}
