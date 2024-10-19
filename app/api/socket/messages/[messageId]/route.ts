import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@/lib/models/member.models";
import { currentUser } from "@/lib/helpers/current-user";
import Server from "@/lib/models/server.model";
import Channel from "@/lib/models/channel.models";
import Message from "@/lib/models/message.models";  // Assuming Message model exists

// Handle DELETE Method
export const DELETE = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  try {
    const profile = await currentUser();
    const { messageId, serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    // Step 1: Find the server and check if the user is a member
    const server = await Server.findOne({
      _id: serverId,
      members: { $elemMatch: { userId: profile._id } }
    }).populate("members");

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    // Step 2: Find the channel belonging to the server
    const channel = await Channel.findOne({
      _id: channelId,
      serverId: serverId
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Step 3: Find the member in the server
    const member = server.members.find((member) => member.userId.equals(profile._id));

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Step 4: Find the message in the channel
    let message = await Message.findOne({
      _id: messageId,
      channelId: channelId,
      deleted: { $ne: true }
    }).populate({
      path: 'member',
      populate: { path: 'userId' }
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId.equals(member._id);
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Step 5: Delete the message (soft delete)
    message = await Message.findOneAndUpdate(
      { _id: messageId },
      {
        content: "This message has been deleted.",
        fileUrl: null,
        deleted: true
      },
      { new: true }
    ).populate({
      path: 'member',
      populate: { path: 'userId' }
    });

    // Emit the deleted message through socket.io
    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DELETE_MESSAGE_ERROR]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Handle PATCH Method
export const PATCH = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  try {
    const profile = await currentUser();
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    // Step 1: Find the server and check if the user is a member
    const server = await Server.findOne({
      _id: serverId,
      members: { $elemMatch: { userId: profile._id } }
    }).populate("members");

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    // Step 2: Find the channel belonging to the server
    const channel = await Channel.findOne({
      _id: channelId,
      serverId: serverId
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Step 3: Find the member in the server
    const member = server.members.find((member) => member.userId.equals(profile._id));

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Step 4: Find the message in the channel
    let message = await Message.findOne({
      _id: messageId,
      channelId: channelId,
      deleted: { $ne: true }
    }).populate({
      path: 'member',
      populate: { path: 'userId' }
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId.equals(member._id);

    if (!isMessageOwner) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Step 5: Update the message content
    message = await Message.findOneAndUpdate(
      { _id: messageId },
      { content },
      { new: true }
    ).populate({
      path: 'member',
      populate: { path: 'userId' }
    });

    // Emit the updated message through socket.io
    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[PATCH_MESSAGE_ERROR]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
