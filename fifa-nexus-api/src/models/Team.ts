import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  country: string;
  foundedYear?: number;
  stadium?: string;
  manager?: string;
  logoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    foundedYear: { type: Number },
    stadium: { type: String },
    manager: { type: String },
    logoURL: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Team = mongoose.model<ITeam>('Team', TeamSchema);
