import type { PRResult, ScopeDocument, Task, TestResult } from './Task';

export type AgentName =
  | 'ba-interpreter'
  | 'architect'
  | 'coder'
  | 'tester'
  | 'reviewer-quality'
  | 'reviewer-security'
  | 'reviewer-performance'
  | 'debugger'
  | 'rollback'
  | 'devops'
  | 'monitor';

export interface AgentUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface AgentInput {
  task?: Task;
  interpretation?: Task;
  scope?: ScopeDocument;
  implementation?: AgentResult;
  testResult?: AgentResult;
  review?: AgentResult;
  attempt?: number;
  reason?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface AgentResult {
  passed: boolean;
  message: string;
  data?: unknown;
  blockers?: string[];
  suggestions?: string[];
  score?: number;
  usage?: AgentUsage;
  testResult?: TestResult;
  pr?: PRResult;
  scope?: ScopeDocument;
  interpretation?: Task;
  filesChanged?: string[];
}

export interface AgentConfig {
  name: string;
  model: string;
  systemPrompt: string;
  maxTokens?: number;
}
