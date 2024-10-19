import mongoose, { Schema, Document, Types } from "mongoose";

interface IDirectMessage extends Document {
  content: string;
  fileUrl?: string;
  member: Types.ObjectId;  // Reference to Member
  conversation: Types.ObjectId;  // Reference to Conversation
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DirectMessageSchema = new Schema<IDirectMessage>(
  {
    content: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexing member and conversation for optimized queries
DirectMessageSchema.index({ member: 1 });
DirectMessageSchema.index({ conversation: 1 });

const DirectMessage = mongoose.model<IDirectMessage>("DirectMessage", DirectMessageSchema);
export default DirectMessage;
