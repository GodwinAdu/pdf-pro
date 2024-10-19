import { model, models, Schema } from "mongoose";


const OtpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => Date.now() + 10 * 60 * 1000, // Current time + 10 minutes
        index: { expires: '10m' } // TTL index to automatically remove after 10 minutes
    },
});

const Otp = models.Otp || model('Otp', OtpSchema);

export default Otp;
