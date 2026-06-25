import { Cache } from '../models/Cache';

export class CacheService {
  /**
   * Retrieves a value from the cache.
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await Cache.findOne({ key });
      if (cached) {
        // If it's expired but hasn't been swept yet, treat as miss
        if (cached.expiresAt < new Date()) {
          await Cache.deleteOne({ _id: cached._id });
          return null;
        }
        return cached.value as T;
      }
      return null;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Sets a value in the cache with a TTL in minutes.
   */
  static async set(key: string, value: any, ttlMinutes: number): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + ttlMinutes * 60000);
      await Cache.findOneAndUpdate(
        { key },
        { value, expiresAt },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }
}
