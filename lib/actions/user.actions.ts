"use server"

import { FilterQuery, SortOrder } from "mongoose";
import { liveblocks } from "../liveblocks";
import User from "../models/user.models";
import { connectToDB } from "../mongoose"
import { calculateSubscriptionEndDate, parseStringify } from "../utils";
import Thread from "../models/thread.model";
import { currentUser } from "../helpers/current-user";
import mongoose from "mongoose";
import Server from "../models/server.model";
import Member from "../models/member.models";
import { v4 as uuidv4 } from 'uuid';
import Coin from "../models/coin.models";


export async function fetchUser(id: string) {
    try {
        await connectToDB();

        const user = await User.findById(id).populate({path:"coinId", model:Coin}).exec(); // Pass the 'id' directly as a string

        if (!user) return null;

        return JSON.parse(JSON.stringify(user));

    } catch (error: any) {
        console.log("Unable to fetch user", error);
        throw error;
    }
}

interface createProps {
    clerkId: string;
    email: string;
    fullName: string;
}

export async function createUser({ clerkId, email, fullName }: createProps) {
    await connectToDB();

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("User already exists");
        }
        const user = new User({
            clerkId,
            email,
            fullName,
        });
        await user.save();
    } catch (error: any) {
        console.log("Unable to create user", error);
    }
}

interface SubscriptiionProps {
    id: string;
    amount: number;
    plan: string;
    period: 'monthly' | '6-months' | 'yearly';
}

export async function updateUserSubscription({ id, amount, plan, period }: SubscriptiionProps) {
    try {
        const date = new Date()
        const currentDate = date.toISOString().slice(0, 10);
        await connectToDB();

        const user = await User.findById(id);

        if (!user) {
            throw new Error(`User with ID ${id} not found`)
        }
        user.plan.amount += amount;
        user.plan.planName = plan;
        user.plan.subscriptionType = period;
        user.plan.subscriptionStart = currentDate;
        user.plan.subscriptionEnd = calculateSubscriptionEndDate(currentDate, period)

        await user.save();
    } catch (error) {
        console.log("Error updating user subscription:", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}


export async function updateUserSubscriptionEnd(userId: string) {
    try {
        const date = new Date()
        const currentDate = date.toISOString().slice(0, 10);
        await connectToDB();

        const user = await User.findById(userId);

        if (!user) {
            throw new Error(`User with ID ${userId} not found`)
        }
        user.plan.amount = 0;
        user.plan.planName = '';
        user.plan.subscriptionType = '';
        user.plan.subscriptionStart = '';
        user.plan.subscriptionEnd = '';

        await user.save();
    } catch (error) {
        console.log("Error updating user subscription end:", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
export async function updateUserUpload(userId: string) {
    try {

        await connectToDB();

        const user = await User.findById(userId);

        if (!user) {
            throw new Error(`User with ID ${userId} not found`)
        }
        user.numberUpload += 1;

        await user.save();

    } catch (error) {
        console.log("Error updating user Upload number:", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}




export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
        // Query MongoDB to find users with emails matching the userIds array
        const users = await User.find({ email: { $in: userIds } });

        // Map the MongoDB user data to the format you need
        const formattedUsers = users.map((user) => ({
            id: user._id, // Assuming _id is the user ID in MongoDB
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            avatar: user?.imageUrl,
        }));

        // Sort the users to match the order of the provided userIds (emails)
        const sortedUsers = userIds.map((email) => formattedUsers.find((user) => user.email === email));

        return parseStringify(sortedUsers);
    } catch (error) {
        console.log(`Error fetching users: ${error}`);
    }
}

export const getDocumentUsers = async ({ roomId, currentUser, text }: { roomId: string, currentUser: string, text: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        if (text.length) {
            const lowerCaseText = text.toLowerCase();

            const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText))

            return parseStringify(filteredUsers);
        }

        return parseStringify(users);
    } catch (error) {
        console.log(`Error fetching document users: ${error}`);
    }
}



// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
}: {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try {
        connectToDB();

        // Calculate the number of users to skip based on the page number and page size.
        const skipAmount = (pageNumber - 1) * pageSize;

        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(searchString, "i");

        // Create an initial query object to filter users.
        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }, // Exclude the current user from the results.
        };

        // If the search string is not empty, add the $or operator to match either username or name fields.
        if (searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ];
        }

        // Define the sort options for the fetched users based on createdAt field and provided sort order.
        const sortOptions = { createdAt: sortBy };

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        // Count the total number of users that match the search criteria (without pagination).
        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        // Check if there are more users beyond the current page.
        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}


export async function getActivity(userId: string) {
    try {
        connectToDB();

        // Find all threads created by the user
        const userThreads = await Thread.find({ author: userId });

        // Collect all the child thread ids (replies) from the 'children' field of each user thread
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, []);

        // Find and return the child threads (replies) excluding the ones created by the same user
        const replies = await Thread.find({
            _id: { $in: childThreadIds },
            author: { $ne: userId }, // Exclude threads authored by the same user
        }).populate({
            path: "author",
            model: User,
            select: "name image _id",
        });

        return JSON.parse(JSON.stringify(replies));
    } catch (error) {
        console.error("Error fetching replies: ", error);
        throw error;
    }
}
export async function AddToLike(threadId: string) {
    try {
        await connectToDB();
        const user = await currentUser();

        if (!user) {
            throw new Error('Unauthorized');
        }

        const threadObjectId = new mongoose.Types.ObjectId(threadId);

        const [thread, mainUser] = await Promise.all([
            Thread.findById(threadObjectId),
            User.findById(user._id),
        ]);

        if (!mainUser) {
            throw new Error('User not found');
        }

        const isLiked = thread.likes.some((id: mongoose.Types.ObjectId) => id.equals(mainUser._id));

        // Atomic MongoDB operation: either add or remove threadId in a single update query
        const update = isLiked
            ? { $pull: { likes: mainUser._id } } // Dislike: Remove threadId from likes
            : { $addToSet: { likes: mainUser._id } }; // Like: Add threadId to likes (only if not present)

        const updatedThread = await Thread.findByIdAndUpdate(threadObjectId, update, { new: true }); // Return updated user

        return JSON.parse(JSON.stringify(updatedThread));
    } catch (error) {
        console.log('Unable to perform add to likes', error);
        throw error;
    }
}


export async function updateMemberWithRole({ role, serverId, memberId }: { role: string, serverId: string, memberId: string }) {
    try {
        const user = await currentUser();
        await connectToDB();

        if (!serverId) {
            throw new Error("Server ID missing");
        }

        if (!memberId) throw new Error("Member ID missing");

        // Find the server with the current user's userIdId
        const server = await Server.findOne({ _id: serverId, owner: user._id }).populate({
            path: 'members',
            populate: { path: 'userId', model: 'User' }, // Populate the user userId of the member
        });

        if (!server) {
            throw new Error('server was not found');
        }

        // Find the member that needs to be updated
        const member = await Member.findOne({ _id: memberId, server: serverId });

        if (!member) {
            throw new Error('Member was not found');
        }

        // Prevent the current user from changing their own role
        if (member.userId.equals(user._id)) {
            throw new Error('You cannot change your own role');
        }

        // Update the role of the member
        member.role = role;
        await member.save();

        // Re-fetch the server data after the update
        const updatedServer = await Server.findById(serverId).populate({
            path: 'members',
            populate: { path: 'userId', model: 'User' }, // Populate the user userIds
        }).sort({ role: 'asc' }); // Sort the members by role

        return parseStringify(updatedServer);

    } catch (error) {
        console.log('Unable to perform update to members', error);
        throw error;
    }
}

export async function kickMemberFromServer(serverId: string, memberId: string) {
    try {
        const user = await currentUser();  // Get the current user
        await connectToDB();  // Connect to the database

        if (!serverId) {
            throw new Error("Server ID missing");
        }

        if (!memberId) {
            throw new Error("Member ID missing");
        }

        // Find the server owned by the current user
        const server = await Server.findOne({ _id: serverId, owner: user._id }).populate({
            path: 'members',
            populate: { path: 'userId', model: 'User' }, // Populate the userId in members
        });

        if (!server) {
            throw new Error('Server not found or insufficient permissions');
        }

        // Ensure that the member being kicked is part of the server
        const memberToKick = await Member.findOne({ _id: memberId, server: serverId });

        if (!memberToKick) {
            throw new Error("Member not found");
        }

        // Prevent kicking the owner or yourself
        if (memberToKick.userId.equals(server.owner) || memberToKick.userId.equals(user._id)) {
            throw new Error("You cannot kick the owner or yourself");
        }

        // Perform the pull operation to remove the member
        const updateResult = await Server.updateOne(
            { _id: serverId },
            { $pull: { members: memberToKick._id } }
        );

        // Check if the update operation was successful
        if (updateResult.modifiedCount === 0) {
            throw new Error("Failed to remove member from server");
        }

        // Optionally, delete the member document (if required)
        await Member.deleteOne({ _id: memberToKick._id });

        // Fetch the updated server to confirm the changes
        const updatedServer = await Server.findById(serverId).populate({
            path: 'members',
            model: Member,
        });

        return parseStringify(updatedServer);  // Convert the server to a JSON-safe format

    } catch (error) {
        console.error("Unable to kick member from server", error);
        throw error;
    }
}

export async function resetInvitedCode(serverId: string) {
    try {
        const user = await currentUser();

        if (!user) throw new Error('Unauthorized');

        await connectToDB();

        const server = await Server.updateOne(
            {
                _id: serverId,
                owner: user._id
            },
            { invitedCode: uuidv4() },
            { new: true });

        if (!server) throw new Error("Server not found");

        return parseStringify(server);

    } catch (error) {
        console.error("Unable to reset invited code", error);
        throw error;
    }
}