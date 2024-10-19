import { model, models, Document, Schema } from "mongoose";

// Define a TypeScript enum for ChannelType
export enum ChannelType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO'
}

// Define the Channel interface that extends the Mongoose Document
interface IChannel extends Document {
  name: string;
  type: ChannelType; // Using the enum here
  userId: Schema.Types.ObjectId;
  createdAt?: Date; // Optional because of timestamps
  updatedAt?: Date; // Optional because of timestamps
}

// Define the channel schema
const channelSchema = new Schema<IChannel>({
  name: { type: String, required: true }, // Add required if necessary
  type: {
    type: String,
    enum: Object.values(ChannelType), // Use enum values here
    default: ChannelType.TEXT, // Default to TEXT
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
}, {
  timestamps: true,
  versionKey: false,
  autoIndex: true,
});

// Create the model
const Channel = models?.Channel || model<IChannel>('Channel', channelSchema);

export default Channel;
