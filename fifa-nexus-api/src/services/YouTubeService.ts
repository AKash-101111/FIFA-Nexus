import axios from 'axios';
import { CacheService } from './CacheService';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export class YouTubeService {
  /**
   * Search for match highlights
   * @param query The search query (e.g., "Argentina vs France highlights")
   */
  static async getHighlights(query: string) {
    const cacheKey = `youtube:highlights:${query.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          part: 'snippet',
          q: `${query} FIFA World Cup 2026 match highlights official`,
          key: YOUTUBE_API_KEY,
          maxResults: 5,
          type: 'video',
          videoEmbeddable: 'true'
        }
      });
      
      await CacheService.set(cacheKey, response.data, 30); // 30 min cache
      return response.data;
    } catch (error) {
      console.error('Failed to fetch YouTube highlights:', error);
      return { items: [] };
    }
  }
}
