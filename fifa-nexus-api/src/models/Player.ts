import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  position: string;
  nationality: string;
  team: mongoose.Types.ObjectId;
  age?: number;
  overallRating?: number;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    nationality: { type: String, required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    age: { type: Number },
    overallRating: { type: Number, min: 1, max: 99 },
    photoURL: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Player = mongoose.model<IPlayer>('Player', PlayerSchema);
