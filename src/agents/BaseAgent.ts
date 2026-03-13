import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../utils/logger';
import { costTracker } from '../utils/costTracker';
import { retry } from '../utils/retry';
import { resolveAIProvider, type AIProvider } from '../utils/modelResolver';
import { estimateUsage } from '../utils/tokenCounter';
import type { AgentConfig, AgentInput, AgentResult, AgentUsage } from '../types';

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiGenerateContentResponse {
  candidates?: GeminiCandidate[];
}

/** Abstract base class for all FORGEMIND agents. */
export abstract class BaseAgent {
  protected readonly anthropicClient: Anthropic | null;
  protected readonly provider: AIProvider | null;
  protected readonly geminiApiKey: string | null;
  protected readonly model: string;
  protected readonly name: string;
  protected readonly systemPrompt: string;
  protected readonly maxTokens: number;

  /** Initializes agent runtime and optional Anthropic/Gemini clients. */
  constructor(config: AgentConfig) {
    this.model = config.model;
    this.name = config.name;
    this.systemPrompt = config.systemPrompt;
    this.maxTokens = config.maxTokens ?? 4096;
    this.provider = resolveAIProvider();
    this.geminiApiKey = process.env.GEMINI_API_KEY ?? null;
    this.anthropicClient = process.env.ANTHROPIC_API_KEY
      ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      : null;
  }

  /** Executes the agent with retry, usage accounting, and structured result parsing. */
  async execute(input: AgentInput): Promise<AgentResult> {
    const startedAt = Date.now();
    logger.info(this.name, `Executing agent ${this.name}`);

    const result = await retry(async () => {
      const prompt = this.formatPrompt(input);
      const rawText = await this.generateText(prompt, input);
      const usage = this.buildUsage(prompt, rawText);
      const parsed = this.parseResult(rawText, input);
      parsed.usage = usage;
      return parsed;
    }, { retries: 2, backoffMs: 500, exponential: true });

    const taskId = input.task?.id ?? 'unknown-task';
    if (result.usage) {
      costTracker.addUsage(taskId, this.name, result.usage);
    }
    logger.success(this.name, `Completed in ${Date.now() - startedAt}ms`);
    return result;
  }

  /** Formats user/context data into the effective user prompt string. */
  protected abstract formatPrompt(input: AgentInput): string;

  /** Parses raw model output into normalized AgentResult object. */
  protected abstract parseResult(rawText: string, input: AgentInput): AgentResult;

  /** Returns declared capabilities used for routing and diagnostics. */
  abstract getCapabilities(): string[];

  /** Generates textual output via Anthropic/Gemini call or deterministic local simulation. */
  protected async generateText(prompt: string, input: AgentInput): Promise<string> {
    if (this.provider === 'anthropic' && this.anthropicClient) {
      return this.generateAnthropicText(prompt);
    }
    if (this.provider === 'gemini' && this.geminiApiKey) {
      return this.generateGeminiText(prompt);
    }
    return this.simulateText(prompt, input);
  }

  /** Generates deterministic fallback response used in offline test runs. */
  protected simulateText(prompt: string, _input: AgentInput): string {
    return `SIMULATED_RESPONSE:${this.name}:${prompt.slice(0, 600)}`;
  }

  /** Calls Anthropic messages API and extracts text content. */
  private async generateAnthropicText(prompt: string): Promise<string> {
    if (!this.anthropicClient) {
      throw new Error('Anthropic client is not configured');
    }

    const message = await this.anthropicClient.messages.create({
      model: this.model,
      max_tokens: this.maxTokens,
      system: this.systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content
      .map((block) => ('text' in block ? String(block.text) : ''))
      .join('\n')
      .trim();

    return text || JSON.stringify(message.content);
  }

  /** Calls Gemini generateContent API and extracts text content. */
  private async generateGeminiText(prompt: string): Promise<string> {
    const apiKey = this.geminiApiKey;
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const endpoint = process.env.GEMINI_API_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta';
    const url = new URL(`${endpoint}/models/${encodeURIComponent(this.model)}:generateContent`);
    url.searchParams.set('key', apiKey);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: this.systemPrompt }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: this.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errorText}`);
    }

    const payload = (await response.json()) as GeminiGenerateContentResponse;
    const output = this.extractGeminiText(payload);
    if (!output) {
      throw new Error('Gemini response did not contain text output');
    }
    return output;
  }

  /** Extracts text from Gemini candidate parts while preserving order. */
  private extractGeminiText(payload: GeminiGenerateContentResponse): string {
    const text = (payload.candidates ?? [])
      .flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text?.trim() ?? '')
      .filter((value) => value.length > 0)
      .join('\n');
    return text;
  }

  /** Creates a usage object for cost tracking and audit logs. */
  protected buildUsage(prompt: string, output: string): AgentUsage {
    const estimated = estimateUsage(prompt, output);
    const estimatedCostUsd = costTracker.estimate(estimated.inputTokens, estimated.outputTokens);
    return {
      inputTokens: estimated.inputTokens,
      outputTokens: estimated.outputTokens,
      totalTokens: estimated.totalTokens,
      estimatedCostUsd,
    };
  }
}
