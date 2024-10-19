import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: String,
    uploadStatus: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'FAILED', 'SUCCESS'],
        default: 'PENDING'
    },
    url: String,
    key: String,
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
    ],
    
},{
    timestamps: true,  // timestamps will automatically add createdAt and updatedAt fields.
});

const File = mongoose.models.File || mongoose.model("File", FileSchema);

export default File;
