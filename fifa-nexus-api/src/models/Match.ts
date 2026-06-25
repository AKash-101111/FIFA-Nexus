import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  homeTeam: mongoose.Types.ObjectId;
  awayTeam: mongoose.Types.ObjectId;
  homeScore?: number;
  awayScore?: number;
  matchDate: Date;
  tournament?: mongoose.Types.ObjectId;
  status: 'scheduled' | 'live' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema: Schema = new Schema(
  {
    homeTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    awayTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    homeScore: { type: Number, default: null },
    awayScore: { type: Number, default: null },
    matchDate: { type: Date, required: true },
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament' },
    status: { type: String, enum: ['scheduled', 'live', 'completed'], default: 'scheduled' },
  },
  { timestamps: true }
);

export const Match = mongoose.model<IMatch>('Match', MatchSchema);
