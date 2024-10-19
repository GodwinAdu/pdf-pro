import { model } from "mongoose";
import { models } from "mongoose";
import { Schema } from "mongoose";


const coinSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    coin: {
        type: Number,
        default: 0,
        required: true
    }
},{
    timestamps:true,
});

const Coin = models.Coin || model("Coin",coinSchema);

export default Coin;