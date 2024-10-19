import { ChatHeader } from '@/components/group-discussion/chat/chat-header';
import { ChatInput } from '@/components/group-discussion/chat/chat-input';
import { ChatMessages } from '@/components/group-discussion/chat/chat-message';
import { MediaRoom } from '@/components/group-discussion/media-room';
import { getOrCreateConversation } from '@/lib/actions/file.actions';
import { currentMemberInServer } from '@/lib/actions/member.action';
import { currentUser } from '@/lib/helpers/current-user';
import { redirect } from 'next/navigation';
import React from 'react'

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    },
    searchParams: {
        video?: boolean;
    }
}
const page = async ({
    params,
    searchParams,
}: MemberIdPageProps) => {
    const profile = await currentUser();

    const currentMember = await currentMemberInServer(params.serverId, profile._id)

    if (!currentMember) {
        return redirect("/group_discussion");
    }

    const conversation = await getOrCreateConversation(currentMember._id, params.memberId);

    if (!conversation) {
        return redirect(`/group_discussion/servers/${params.serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    console.log(memberOne,"Member One")
    console.log(memberTwo,"Member Two")

    const otherMember = memberOne.userId._id === profile._id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.userId.imageUrl}
                name={otherMember.userId.fullName}
                serverId={params.serverId}
                type="conversation"
            />
            {searchParams.video && (
                <MediaRoom
                    user={profile}
                    chatId={conversation._id}
                    video={true}
                    audio={true}
                />
            )}
            {!searchParams.video && (
                <>
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.userId.fullName}
                        chatId={conversation._id}
                        type="conversation"
                        apiUrl="/api/direct-messages"
                        paramKey="conversationId"
                        paramValue={conversation._id}
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId: conversation._id,
                        }}
                    />
                    <ChatInput
                        name={otherMember.userId.fullName}
                        type="conversation"
                        apiUrl="/api/socket/direct-messages"
                        query={{
                            conversationId: conversation._id,
                        }}
                    />
                </>
            )}
        </div>
    )
}

export default page
