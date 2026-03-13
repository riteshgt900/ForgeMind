/** Estimates Anthropic token usage from text length. */
export function estimateAnthropicTokens(text: string): number {
  return text.length === 0 ? 0 : Math.ceil(text.length / 4);
}

/** Estimates usage for prompt and response pair. */
export function estimateUsage(inputText: string, outputText: string): {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
} {
  const inputTokens = estimateAnthropicTokens(inputText);
  const outputTokens = estimateAnthropicTokens(outputText);
  return { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens };
}
