
import { Schema, models, model, Document } from "mongoose";

interface Plan {
    amount: number;
    planName: string;
    subscriptionType: string;
    subscriptionStart: string;
    subscriptionEnd: string;
}

export interface IUser extends Document {
    clerkId: string;
    fullName: string;
    email: string;
    phone: string;
    freeAiChat: number;
    freePdfChat: number;
    plan: Plan;
    numberUpload:number;
    createdAt?: Date;
    updatedAt?: Date;
}


const UserSchema = new Schema<IUser>({
    clerkId: {
        type: String,
        required: true
    },
    fullName: String,
    email: {
        type: String,
        unique: true,
    },
    phone: String,
    freeAiChat: {
        type: Number,
        default: 0
    },
    freePdfChat: {
        type: Number,
        default: 0
    },
    plan: {
        amount: {
            type: Number,
            default: 0
        },
        planName: {
            type:String,
            default:"free"
        },
        subscriptionType: String,
        subscriptionStart: String,
        subscriptionEnd: String,
    },
    numberUpload:{
        type:Number,
        default:0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});


const User = models.User || model("User", UserSchema);

export default User;