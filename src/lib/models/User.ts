import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date | null;
  lastHintGeneratedAt: Date | null;
  lastHintMotivation: string | null;
  lastHintSummary: string | null;
  lastHintNextSuggestion: string | null;
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: null },
  lastHintGeneratedAt: { type: Date, default: null },
  lastHintMotivation: { type: String, default: null },
  lastHintSummary: { type: String, default: null },
  lastHintNextSuggestion: { type: String, default: null },
});

export default models.User || model<IUser>("User", UserSchema);
