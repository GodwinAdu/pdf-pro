import { Schema, model, models } from 'mongoose';

// Define the TTL duration (in seconds). 24 hours = 86400 seconds.
const TTL_DURATION = 24 * 60 * 60; // 24 hours in seconds

const FailedLoginAttemptSchema = new Schema({
    ipAddress: {
        type: String,
        required: true,
        unique: true,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    lockedUntil: {
        type: Date,
    },
    // This field will store the timestamp when the document is created.
    createdAt: {
        type: Date,
        default: Date.now,
        expires: TTL_DURATION, // TTL index that deletes the document after 24 hours
    },
}, {
    timestamps: true, // This will automatically manage 'createdAt' and 'updatedAt' fields
    versionKey: false,
});

const FailedLoginAttempt = models.FailedLoginAttempt || model("FailedLoginAttempt", FailedLoginAttemptSchema);
export default FailedLoginAttempt;
