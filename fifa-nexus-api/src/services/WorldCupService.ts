import axios from 'axios';
import { WorldCupCache } from '../models/WorldCupCache';
import { ApiFallbackManager } from './ApiFallbackManager';
import * as dotenv from 'dotenv';

dotenv.config();

export class WorldCupService {
  private fallbackManager: ApiFallbackManager;
  private readonly baseUrl = 'https://api.worldcupapi.com';

  constructor() {
    const keys = process.env.WORLD_CUP_API_KEY ? [process.env.WORLD_CUP_API_KEY] : [];
    this.fallbackManager = new ApiFallbackManager(keys);
  }

  async getLiveScores() {
    return this.getCachedData('all_livescores', async (key) => {
      // Endpoint is single source of truth for everything
      const response = await axios.get(`${this.baseUrl}/livescores?key=${key}`);
      return response.data;
    });
  }

  async getUpcomingMatches() {
      // In a real implementation this would likely filter the getLiveScores response 
      // or hit an upcoming endpoint. We'll return livescores and frontend can filter.
      return this.getLiveScores();
  }

  async getFinishedMatches() {
      return this.getLiveScores();
  }

  async getMatchInsights(matchId: string) {
      // To be implemented using Gemini or similar, for now we will just return live scores
      return this.getLiveScores();
  }

  private async getCachedData(cacheKey: string, fetchFn: (key: string) => Promise<any>) {
    // Check MongoDB cache first
    const cached = await WorldCupCache.findOne({ 'data.cacheKey': cacheKey });
    if (cached && cached.expiresAt > new Date()) {
      return cached.data.payload;
    }

    try {
      const result = await this.fallbackManager.execute(fetchFn);
      
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + 60); // 60s TTL
      
      await WorldCupCache.findOneAndUpdate(
        { 'data.cacheKey': cacheKey },
        {
          data: { cacheKey, payload: result },
          timestamp: new Date(),
          expiresAt
        },
        { upsert: true, new: true }
      );
      
      return result;
    } catch (error) {
      console.error(`[WorldCupService] Error fetching ${cacheKey}:`, error);
      if (cached) return cached.data.payload; // fallback to stale cache
      throw error;
    }
  }
}

// Export a singleton instance
export const worldCupService = new WorldCupService();
