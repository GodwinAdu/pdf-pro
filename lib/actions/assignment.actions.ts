"use server"
import Assignment from "../models/Assignment.models";
import { connectToDB } from "../mongoose";
import { getPrice } from "../utils";
import { revalidatePath } from "next/cache";
import { currentUser } from "../helpers/current-user";



interface PostProps {
    fullname: string;
    email: string;
    phone: string;
    problemType: string;
    question: string;
    description?: string;
    deadline: Date;
}

export async function postAssignment(values: PostProps, path: string) {
    try {
        const { fullname, email, phone, question, problemType, description, deadline } = values
        await connectToDB();
        const user = await currentUser();
        const userId = user._id;
        const value = getPrice(problemType);
        const price = parseFloat(value.replace(/\D/g, '')); // Removes all non-numeric characters

        const assignment = new Assignment({
            userId,
            fullname,
            email,
            phone,
            problemType,
            question,
            description,
            deadline,
            price,
        })

        await assignment.save();
        revalidatePath(path);

    } catch (error: any) {
        console.log("Unable to send assignment", error)
    }
}

/**
 * Fetches all assignments from the database.
 * 
 * @returns An array of assignments, or an empty array if no assignments are found.
 * @throws Error if an error occurs during the operation.
 */

export async function fetchAllAssignments(): Promise<any[]> {
    try {
        // Connect to the database
        await connectToDB();

        // Fetch all assignments
        const assignments = await Assignment.find({});

        // Check if assignments array is empty
        if (!assignments || assignments.length === 0) {
            return [];
        }

        // Return assignments after converting them to plain objects
        return JSON.parse(JSON.stringify(assignments));
    } catch (error) {
        console.error("Unable to fetch assignments:", error);
        throw error;
    }
};

export async function fetchAssignmentById(id: string) {
    try {
        await connectToDB();
        const assignment = await Assignment.findById(id);
        if (!assignment) {
            throw new Error("assignment not found");
        };

        return JSON.parse(JSON.stringify(assignment))
    } catch (error) {
        console.log("unable to fetch assignment", error);
        throw error;
    }
}


export async function updateAssignment(assignmentId: string, values: PostProps, path: string) {
    try {
        // Destructure values
        const { fullname, email, phone, question, problemType, description, deadline } = values;
        const value = getPrice(problemType);
        const price = parseFloat(value.replace(/\D/g, '')); // Removes all non-numeric characters
        // Connect to the database
        await connectToDB();

        // Find and update or create the assignment
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            assignmentId,
            {
                $set: {
                    fullname,
                    email,
                    phone,
                    question,
                    problemType,
                    description,
                    deadline,
                    price
                }
            },
            {
                new: true, // Return the updated document
                upsert: true, // Create a new document if not found
                setDefaultsOnInsert: true // Apply default values for new documents
            }
        );

        if (!updatedAssignment) {
            throw new Error("Failed to update or create assignment");
        }
        revalidatePath(path)
        return JSON.parse(JSON.stringify(updatedAssignment));
    } catch (error: any) {
        console.error("Failed to update or create assignment:", error);
        throw error;
    }
}


export async function updateAssignmentPayment(assignmentId: string) {

    try {
        await connectToDB();
        const updatedPayed = await Assignment.findById(assignmentId);

        if (!updatedPayed) {
            throw new Error(`couldn't updated assignment payment`);
        }
        updatedPayed.payed = true;

        await updatedPayed.save();

        return JSON.parse(JSON.stringify(updatedPayed));

    } catch (error) {
        console.error("Error updating admin:", error);
        throw error;
    }
}