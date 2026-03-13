import type { AgentName } from '../types';

export type AIProvider = 'anthropic' | 'gemini';

const MODEL_ENV_KEYS: Record<AgentName, string[]> = {
  'ba-interpreter': ['FORGEMIND_MODEL_BA_INTERPRETER'],
  architect: ['FORGEMIND_MODEL_ARCHITECT'],
  coder: ['FORGEMIND_MODEL_CODER'],
  tester: ['FORGEMIND_MODEL_TESTER'],
  'reviewer-quality': ['FORGEMIND_MODEL_REVIEWER_QUALITY', 'FORGEMIND_MODEL_REVIEWER'],
  'reviewer-security': ['FORGEMIND_MODEL_REVIEWER_SECURITY', 'FORGEMIND_MODEL_REVIEWER'],
  'reviewer-performance': ['FORGEMIND_MODEL_REVIEWER_PERFORMANCE', 'FORGEMIND_MODEL_REVIEWER'],
  debugger: ['FORGEMIND_MODEL_DEBUGGER'],
  rollback: ['FORGEMIND_MODEL_ROLLBACK'],
  devops: ['FORGEMIND_MODEL_DEVOPS'],
  monitor: ['FORGEMIND_MODEL_MONITOR'],
};

/** Resolves active AI provider from explicit env value or available API keys. */
export function resolveAIProvider(): AIProvider | null {
  const preferred = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (preferred === 'anthropic' || preferred === 'gemini') return preferred;
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  return null;
}

/** Resolves model id for the given agent using env overrides and provider defaults. */
export function resolveModelForAgent(agentName: AgentName): string {
  const configured = firstConfiguredModel(MODEL_ENV_KEYS[agentName]);
  if (configured) return configured;

  const provider = resolveAIProvider();
  const providerKey = provider === 'gemini'
    ? 'FORGEMIND_MODEL_DEFAULT_GEMINI'
    : 'FORGEMIND_MODEL_DEFAULT_ANTHROPIC';
  const providerDefault = process.env[providerKey]?.trim();
  if (providerDefault) return providerDefault;

  const fallback = process.env.FORGEMIND_MODEL_DEFAULT?.trim();
  if (fallback) return fallback;

  return 'unset-model';
}

/** Returns the first non-empty model override across a key priority list. */
function firstConfiguredModel(keys: string[]): string | null {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return null;
}
