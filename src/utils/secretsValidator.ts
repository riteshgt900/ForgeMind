import { z } from 'zod';

const schema = z.object({
  FORGEMIND_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  FORGEMIND_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  FORGEMIND_MAX_COST_PER_TASK_USD: z.string().default('5.00'),
  AI_PROVIDER: z.enum(['anthropic', 'gemini']).optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  SLACK_BOT_TOKEN: z.string().optional(),
  REDIS_URL: z.string().optional(),
  DATABASE_URL: z.string().optional(),
});

/** Validates startup environment and returns normalized values. */
export function validateSecrets(): z.infer<typeof schema> {
  const result = schema.safeParse(process.env);
  if (!result.success) {
    const msg = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Environment validation failed: ${msg}`);
  }
  if (result.data.AI_PROVIDER === 'anthropic' && !result.data.ANTHROPIC_API_KEY) {
    throw new Error('Environment validation failed: ANTHROPIC_API_KEY is required when AI_PROVIDER=anthropic');
  }
  if (result.data.AI_PROVIDER === 'gemini' && !result.data.GEMINI_API_KEY) {
    throw new Error('Environment validation failed: GEMINI_API_KEY is required when AI_PROVIDER=gemini');
  }
  return result.data;
}
