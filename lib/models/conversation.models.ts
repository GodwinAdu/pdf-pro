import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    text: String,
    isUserMessage: Boolean,
    updatedAt: Date,
    userId:String,
    conversationId:String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);

export default Conversation;