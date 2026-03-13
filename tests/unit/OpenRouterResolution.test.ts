import { resolveAIProvider } from '../../src/utils/modelResolver';

describe('OpenRouter Provider Resolution', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('resolves openrouter when AI_PROVIDER is set explicitly', () => {
    process.env.AI_PROVIDER = 'openrouter';
    expect(resolveAIProvider()).toBe('openrouter');
  });

  test('resolves openrouter when OPENROUTER_API_KEY is present and no preference set', () => {
    delete process.env.AI_PROVIDER;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GEMINI_API_KEY;
    process.env.OPENROUTER_API_KEY = 'test-key';
    expect(resolveAIProvider()).toBe('openrouter');
  });

  test('prioritizes anthropic over openrouter by default if both keys present', () => {
    delete process.env.AI_PROVIDER;
    process.env.ANTHROPIC_API_KEY = 'anthropic-key';
    process.env.OPENROUTER_API_KEY = 'openrouter-key';
    expect(resolveAIProvider()).toBe('anthropic');
  });
});
