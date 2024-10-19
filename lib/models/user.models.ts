import { Schema, Document, model, models } from "mongoose";

// Interface representing the User document
export interface IUser extends Document {
    username: string;
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    imageUrl?: string;
    referralCode?: string;
    coinId: Schema.Types.ObjectId;
    teamMembers: Schema.Types.ObjectId[];
    threads: Schema.Types.ObjectId[];
    stage?: string;
    level?: string;
    isBanned: boolean;
    isDeleted: boolean;
    isActive:boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    loginAttempts: number;
    lastLogin?: Date;
    accountLocked: boolean;
    permissions: {
        deleteAccount: boolean;
    };
    preferences: {
        notifications: {
            email: boolean;
            sms: boolean;
        };
    };
    metadata?: {
        browser?: string;
        device?: string;
        location?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema definition
const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: String,
    imageUrl: String,
    referralCode: String,
    coinId: {
        type: Schema.Types.ObjectId,
        ref: 'Coin',
    },
    teamMembers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    threads: [{
        type: Schema.Types.ObjectId,
        ref: "Thread",
    }],
    stage: String,
    level: String,
    isBanned: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
    lastLogin: Date,
    accountLocked: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,  // By default, users are active when created
    },
    permissions: {
        deleteAccount: {
            type: Boolean,
            default: true,
        },
    },
    preferences: {
        notifications: {
            email: {
                type: Boolean,
                default: true,
            },
            sms: {
                type: Boolean,
                default: false,
            },
        }
    },
    metadata: {
        browser: String,
        device: String,
        location: String,
    },
}, {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
