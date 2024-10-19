
import { Schema, Document, Types, models, model } from "mongoose";

interface IConversation extends Document {
  memberOne: Types.ObjectId;  // Reference to Member
  memberTwo: Types.ObjectId;  // Reference to Member
  directMessages: Types.ObjectId[];  // Array of DirectMessage IDs
}

const GroupConversationSchema = new Schema<IConversation>(
  {
    memberOne: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    memberTwo: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    directMessages: [
      {
        type: Schema.Types.ObjectId,
        ref: "DirectMessage",
      },
    ],
  },
  { timestamps: true }
);

// Adding unique index for memberOne and memberTwo to ensure unique conversation
GroupConversationSchema.index({ memberOne: 1, memberTwo: 1 }, { unique: true });

// Indexing memberTwo for optimized queries
GroupConversationSchema.index({ memberTwo: 1 });

const GroupConversation = models.GroupConversation || model<IConversation>("GroupConversation", GroupConversationSchema);
export default GroupConversation;
