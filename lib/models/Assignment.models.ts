
import { Document, Schema, models, model } from "mongoose";

export interface IAssignment extends Document {
    _id: string;
    userId: string;
    fullname: string;
    email: string;
    phone: string;
    problemType: string;
    question: string;
    description?: string;
    fileUrl:string;
    deadline: Date;
    createdAt?: Date;
    updateAt?: Date
}
const AssignmentSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    problemType: {
        type: String,
        required: true
    },
    question: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    fileUrl: String,
    deadline: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    payed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});


const Assignment = models.Assignment || model("Assignment", AssignmentSchema);

export default Assignment;