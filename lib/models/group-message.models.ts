import { Schema } from "mongoose";
import { model, models } from "mongoose";



const messageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    default: null,
  },
  memberId: {
    type:Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  channelId: {
    type:Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
},{
  timestamps: true,
  versionKey: false,
});

// Adding indexes
messageSchema.index({ channelId: 1 });
messageSchema.index({ memberId: 1 });


const GroupMessage = models.GroupMessage ||  model('GroupMessage', messageSchema);

export default GroupMessage;


