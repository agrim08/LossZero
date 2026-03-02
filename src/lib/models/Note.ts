import mongoose, { Schema, Document, model, models } from "mongoose";

export interface INote extends Document {
  clerkId: string;
  topicId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const NoteSchema = new Schema<INote>({
  clerkId: { type: String, required: true, index: true },
  topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
  content: {
    type: String,
    required: true,
    maxlength: 3000,
  },
  createdAt: { type: Date, default: Date.now },
});

export default models.Note || model<INote>("Note", NoteSchema);
