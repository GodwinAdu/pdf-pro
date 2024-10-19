import { model, models } from "mongoose";
import { Schema } from "mongoose";

const serverSchema = new Schema({
    name: String,
    imageUrl: String,
    invitedCode: {
        type: String,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'Member'
    }],    
    channels: [{
        type: Schema.Types.ObjectId,
        ref: 'Channel'
    }],
},{
    timestamps:true
});

const Server = models.Server || model("Server", serverSchema);

export default Server;