import { Document, Schema, models, model } from "mongoose";

export interface IAssignment extends Document {
    _id: string;
    userId: Schema.Types.ObjectId;
    fullname: string;
    email: string;
    phone: string;
    problemType: string;
    question: string;
    description?: string;
    fileUrl?: string;
    price: number;
    payed: boolean;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    deadline: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Simple email regex validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return /^\+?[1-9]\d{1,14}$/.test(v); // E.164 international phone number format
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    problemType: {
        type: String,
        required: true,
        trim: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    fileUrl: {
        type: String,
        default: null,
        trim: true
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
        enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    deadline: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
    versionKey: false  // Removes __v versioning field
});

const Assignment = models.Assignment || model<IAssignment>("Assignment", AssignmentSchema);

export default Assignment;
