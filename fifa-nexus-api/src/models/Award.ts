import mongoose, { Schema, Document } from 'mongoose';

export interface IAward extends Document {
  name: string;
  year: number;
  recipientPlayer?: mongoose.Types.ObjectId;
  recipientTeam?: mongoose.Types.ObjectId;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AwardSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    year: { type: Number, required: true },
    recipientPlayer: { type: Schema.Types.ObjectId, ref: 'Player' },
    recipientTeam: { type: Schema.Types.ObjectId, ref: 'Team' },
    description: { type: String },
  },
  { timestamps: true }
);

export const Award = mongoose.model<IAward>('Award', AwardSchema);
