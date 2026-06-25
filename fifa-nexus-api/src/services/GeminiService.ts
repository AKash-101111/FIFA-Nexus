import { GoogleGenerativeAI } from '@google/generative-ai';
import { ApiFallbackManager } from './ApiFallbackManager';
import { CacheService } from './CacheService';

const geminiKeys = [
  process.env.PRIMARY_GEMINI_API_KEY || '',
  process.env.SECONDARY_GEMINI_API_KEY || '',
  process.env.TERTIARY_GEMINI_API_KEY || ''
];

const fallbackManager = new ApiFallbackManager(geminiKeys);

export class GeminiService {
  /**
   * Generates AI insights using the Gemini model with fallback and caching.
   * @param prompt The prompt to send to Gemini
   * @param cacheKey Unique key for caching the response
   * @returns The generated text
   */
  static async generateInsight(prompt: string, cacheKey: string): Promise<string> {
    // 1. Check Cache
    const cachedResponse = await CacheService.get<string>(cacheKey);
    if (cachedResponse) {
      console.log(`[GeminiService] Cache hit for ${cacheKey}`);
      return cachedResponse;
    }

    // 2. Fetch from Gemini with Fallback Manager
    try {
      const response = await fallbackManager.execute(async (activeKey) => {
        const genAI = new GoogleGenerativeAI(activeKey);
        // Using gemini-1.5-flash for speed and general text tasks
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const result = await model.generateContent(prompt);
        return result.response.text();
      });

      // 3. Set Cache (15 minutes as requested)
      await CacheService.set(cacheKey, response, 15);
      
      return response;
    } catch (error: any) {
      console.error('[GeminiService] Insight generation failed:', error.message);
      throw new Error(error.message || 'AI insights temporarily unavailable. Please try again later.');
    }
  }

  /**
   * Generates AI insights as a stream using the Gemini model with fallback.
   * @param prompt The prompt to send to Gemini
   * @returns An AsyncGenerator yielding chunks of text
   */
  static async generateInsightStream(prompt: string): Promise<AsyncGenerator<string, void, unknown>> {
    try {
      const stream = await fallbackManager.execute(async (activeKey) => {
        const genAI = new GoogleGenerativeAI(activeKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const result = await model.generateContentStream(prompt);
        
        // We create an async generator to yield text chunks
        async function* streamGenerator() {
          for await (const chunk of result.stream) {
            yield chunk.text();
          }
        }
        
        return streamGenerator();
      });

      return stream;
    } catch (error: any) {
      console.error('[GeminiService] Insight stream generation failed:', error.message);
      throw new Error(error.message || 'AI insights temporarily unavailable. Please try again later.');
    }
  }
}
