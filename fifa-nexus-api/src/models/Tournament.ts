import mongoose, { Schema, Document } from 'mongoose';

export interface ITournament extends Document {
  name: string;
  hostCountry: string;
  startDate: Date;
  endDate: Date;
  participatingTeams: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TournamentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    hostCountry: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    participatingTeams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  },
  { timestamps: true }
);

export const Tournament = mongoose.model<ITournament>('Tournament', TournamentSchema);
