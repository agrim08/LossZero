import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ITopic extends Document {
  clerkId: string;
  title: string;
  week: number;
  tag: string;
  completed: boolean;
  completedAt: Date | null;
}

const TopicSchema = new Schema<ITopic>({
  clerkId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  week: { type: Number, required: true, min: 1, max: 12 },
  tag: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

export default models.Topic || model<ITopic>("Topic", TopicSchema);
