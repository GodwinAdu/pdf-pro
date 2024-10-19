import { Schema,model, models } from "mongoose";

const CoinTransactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        enum: ['BUY', 'WITHDRAW', 'P2P', 'BONUS', 'DEDUCT'], // Add more actions here
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    details: {
        type: String,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    versionKey: false,
});

// TTL Index: Automatically delete documents 30 days after the createdAt field
CoinTransactionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const CoinTransaction = models.CoinTransaction || model("CoinTransaction", CoinTransactionSchema);

export default CoinTransaction;
