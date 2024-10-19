
import React from "react"
import { currentUser } from "@/lib/helpers/current-user";
import { findChannelById } from '@/lib/actions/channel.actions';
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/group-discussion/chat/chat-header";
import { ChannelType } from "@/lib/models/channel.models";
import { ChatInput } from "@/components/group-discussion/chat/chat-input";
import { ChatMessages } from "@/components/group-discussion/chat/chat-message";
import { MediaRoom } from "@/components/group-discussion/media-room";
import { findMembersByServerAndProfile } from "@/lib/actions/member.action";


interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  }
}


const ChannelIdPage = async ({
  params
}: ChannelIdPageProps) => {
  const profile = await currentUser();


  const channel = await findChannelById(params.channelId)

  const member = await findMembersByServerAndProfile(params.serverId, profile?._id)


  if (!channel || !member) {
    redirect("/group_discussion");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={params.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel._id}
            type="channel"
            apiUrl="/api/group-messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel._id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel._id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel._id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom
          user={profile}
          chatId={channel._id}
          video={false}
          audio={true}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
          user={profile}
          chatId={channel._id}
          video={true}
          audio={true}
        />
      )}
    </div>
  );
}

export default ChannelIdPage;