import mongoose, { Document, Schema } from 'mongoose';

export interface IWorldCupCache extends Document {
  data: any;
  timestamp: Date;
  expiresAt: Date;
}

const WorldCupCacheSchema = new Schema<IWorldCupCache>({
  data: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// TTL Index for automatic expiration after 60 seconds.
WorldCupCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const WorldCupCache = mongoose.model<IWorldCupCache>('worldcup_live_cache', WorldCupCacheSchema);
