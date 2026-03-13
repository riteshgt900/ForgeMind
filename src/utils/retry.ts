export interface RetryOptions {
  retries: number;
  backoffMs: number;
  exponential?: boolean;
}

/** Sleeps for a fixed duration. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Retries an async operation with optional exponential backoff. */
export async function retry<T>(operation: () => Promise<T>, options: RetryOptions): Promise<T> {
  let last: unknown;
  for (let attempt = 0; attempt <= options.retries; attempt += 1) {
    try {
      return await operation();
    } catch (error: unknown) {
      last = error;
      if (attempt === options.retries) {
        break;
      }
      const delay = options.exponential ? options.backoffMs * 2 ** attempt : options.backoffMs;
      await sleep(delay);
    }
  }
  throw last;
}
