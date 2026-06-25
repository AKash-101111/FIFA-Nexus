import mongoose, { Schema, Document } from 'mongoose';

export interface IHighlight extends Document {
  title: string;
  videoURL: string;
  match?: mongoose.Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const HighlightSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    videoURL: { type: String, required: true },
    match: { type: Schema.Types.ObjectId, ref: 'Match' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Highlight = mongoose.model<IHighlight>('Highlight', HighlightSchema);
