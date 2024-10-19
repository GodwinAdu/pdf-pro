import { findServerWithInvitedCodeAndUserId, updateServerWithInvitedCode } from '@/lib/actions/server.actions';
import { currentUser } from '@/lib/helpers/current-user';
import { redirect } from 'next/navigation';
import React from 'react'


interface InviteCodePageProps {
    params: {
        invitedCode: string;
    };
}

const page = async ({
    params
}: InviteCodePageProps) => {
    const user = await currentUser();

    const invitedCode = params.invitedCode as string;
    const userId = user._id as string;

    if (!user) {
        return redirect("/sign-in"); // Adjusted to redirect to your custom sign-in page
    }

    if (!params.invitedCode) {
        return redirect("/");
    }

    // Find an existing server with the invite code and the current user's user ID
    const existingServer = await findServerWithInvitedCodeAndUserId(invitedCode, userId);

    if (existingServer) {
        return redirect(`/group_discussion/servers/${existingServer._id}`); // Use _id for Mongoose
    }

    // Update the server by adding the current user's user ID to members
    const server = await updateServerWithInvitedCode(invitedCode,userId);

    if (server) {
        return redirect(`/group_discussion/servers/${server._id}`); // Use _id for Mongoose
    }

    return null; // No action if server was not found or created
}

export default page
