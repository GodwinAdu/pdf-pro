"use server"

import { currentUser } from "@clerk/nextjs";
import Assignment from "../models/Assignment.models";
import { connectToDB } from "../mongoose";



interface PostProps {
    name: string;
    email: string;
    phone: string;
    problem: string;
    question: string;
    description: string;
    deadline: Date;
}

export async function postAssignment({
    name,
    email,
    phone,
    problem,
    question,
    description,
    deadline
}:PostProps) {
    await connectToDB();
    const user = await currentUser();
    try {
        const assignment = new Assignment({
            userId:user?.id,
            name,
            email,
            phone,
            problem,
            question,
            description,
            deadline,
        })

        await assignment.save();

    } catch (error: any) {
        console.log("Unable to send assignment", error)
    }
}