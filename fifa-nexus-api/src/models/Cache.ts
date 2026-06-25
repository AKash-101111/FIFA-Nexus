import mongoose, { Schema, Document } from 'mongoose';

export interface ICache extends Document {
  key: string;
  value: any;
  expiresAt: Date;
}

const CacheSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: false }
);

// TTL Index for automatic deletion
CacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Cache = mongoose.model<ICache>('Cache', CacheSchema);
