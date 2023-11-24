import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id: String,
    name:String,
    email: {
        type: String,
        unique: true,
    },
    // phone:String,
    quizPay:{
        type:Boolean,
        default: false
    },
    duesPay:{
        type:Boolean,
        default:false
    },
});


const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;