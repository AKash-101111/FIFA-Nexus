import mongoose, { Schema, Document } from 'mongoose';

export interface IFantasyTeam extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  players: mongoose.Types.ObjectId[];
  totalPoints: number;
  budgetRemaining: number;
  createdAt: Date;
  updatedAt: Date;
}

const FantasyTeamSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    totalPoints: { type: Number, default: 0 },
    budgetRemaining: { type: Number, default: 100000000 }, // 100M starting budget
  },
  { timestamps: true }
);

export const FantasyTeam = mongoose.model<IFantasyTeam>('FantasyTeam', FantasyTeamSchema);
