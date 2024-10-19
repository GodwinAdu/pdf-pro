import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    text: String,
    isUserMessage: Boolean,
    updatedAt: Date,
    fileId: String ,
},{
    timestamps: true,  // timestamps will automatically add createdAt and updatedAt fields.
});


const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;