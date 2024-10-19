import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String, required: true }, // Unique ID for each session
    messages: [
        {
            text: String,
            isUserMessage: Boolean,
            timestamp: { type: Date, default: Date.now },
        },
    ],
},{
    timestamps: true,  // timestamps will automatically add createdAt and updatedAt fields.
});


const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);

export default Conversation;