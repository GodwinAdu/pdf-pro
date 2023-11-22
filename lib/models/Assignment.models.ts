import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
    userId:String,
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
    },
    problem:{
        type:String,
        required: true
    },
    question:{
        type:String,
        require:true
    },
    description:{
        type:String,
        required:true
    },
    deadline:{
        type:Date,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);

export default Assignment;