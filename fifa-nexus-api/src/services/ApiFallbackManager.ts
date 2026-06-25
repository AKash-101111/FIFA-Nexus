export class ApiFallbackManager {
  private keys: string[];
  private currentKeyIndex = 0;

  constructor(keys: string[]) {
    this.keys = keys.filter(k => !!k);
  }

  /**
   * Executes a task, falling back to the next API key if a rate limit/quota error occurs.
   * @param task Function that takes an API key and returns a Promise
   */
  async execute<T>(task: (key: string) => Promise<T>): Promise<T> {
    if (this.keys.length === 0) {
      throw new Error('No API keys configured.');
    }

    let attempts = 0;
    while (attempts < this.keys.length) {
      const activeKey = this.keys[this.currentKeyIndex];
      try {
        // Attempt the task
        return await task(activeKey);
      } catch (error: any) {
        // Check if the error is a rate limit or quota error
        const status = error?.status || error?.response?.status;
        const message = error?.message?.toLowerCase() || '';

        const isRateLimit = status === 429;
        const isQuotaExceeded = status === 403 && (message.includes('quota') || message.includes('exhausted'));
        
        if (isRateLimit || isQuotaExceeded) {
          console.warn(`[ApiFallbackManager] Key index ${this.currentKeyIndex} failed (Status: ${status}). Rotating key...`);
          // Rotate to the next key
          this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
          attempts++;
        } else {
          // If it's a different error (e.g., bad request 400), don't retry, just throw
          throw error;
        }
      }
    }

    // If we've exhausted all keys
    console.error(`[ApiFallbackManager] All ${this.keys.length} API keys exhausted or rate-limited.`);
    throw new Error('AI insights temporarily unavailable. Please try again later.');
  }
}
