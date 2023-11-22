import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: String,
    name:String,
    amountPay:{
        type:Number,
        default: 0
    },
    isFree:{
        type:Boolean,
        default:true,
    },
    isPro:{
        type:Boolean,
        default:false
    },
    isForever:{
        type:Boolean,
        default:false
    },
    isSubscribed:{
        type:Boolean,
        default:false
    },
    isCanceled:{
        type:Boolean,
        default:true
    },
    transaction: String,
    period: String,
});


const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;