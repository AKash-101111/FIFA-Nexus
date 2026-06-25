import mongoose, { Schema, Document } from 'mongoose';

export interface IStatistics extends Document {
  player?: mongoose.Types.ObjectId;
  team?: mongoose.Types.ObjectId;
  season: string;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  yellowCards?: number;
  redCards?: number;
  matchesPlayed?: number;
  createdAt: Date;
  updatedAt: Date;
}

const StatisticsSchema: Schema = new Schema(
  {
    player: { type: Schema.Types.ObjectId, ref: 'Player' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    season: { type: String, required: true },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    cleanSheets: { type: Number, default: 0 },
    yellowCards: { type: Number, default: 0 },
    redCards: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Statistics = mongoose.model<IStatistics>('Statistics', StatisticsSchema);
