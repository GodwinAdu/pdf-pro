import { model, models, Schema, Document } from "mongoose";

// Define a TypeScript enum for Member roles
export enum MemberRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  GUEST = 'GUEST'
}

// Define the Member interface that extends the Mongoose Document
interface IMember extends Document {
  role: MemberRole;
  userId: Schema.Types.ObjectId;
  server: Schema.Types.ObjectId;
  // Mongoose will auto-generate these fields, so they are optional in the interface
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the member schema
const memberSchema = new Schema<IMember>(
  {
    role: {
      type: String,
      enum: Object.values(MemberRole), // Use the enum values
      default: MemberRole.GUEST, // Default to GUEST
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming a 'User' model exists
      required: true, // Ensuring it's required
    },
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server', // Assuming a 'Server' model exists
      required: true, // Ensuring it's required
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    versionKey: false, // Disabling __v version key
    autoIndex: true, // Automatically create indexes
  }
);

// Create or reuse the Member model
const Member = models?.Member || model<IMember>('Member', memberSchema);

export default Member;
