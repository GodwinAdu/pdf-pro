import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentUser } from "@/lib/helpers/current-user";
import Server from "@/lib/models/server.model";
import Channel from "@/lib/models/channel.models";
import Message from "@/lib/models/message.models";  // Assuming Message model exists

export const POST = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentUser();
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    // Step 1: Find the server and check if the user is a member
    const server = await Server.findOne({
      _id: serverId,
      members: { $elemMatch: { userId: profile._id } }
    }).populate("members");

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    // Step 2: Find the channel belonging to the server
    const channel = await Channel.findOne({
      _id: channelId,
      serverId: serverId
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Step 3: Find the member in the server
    const member = server.members.find((member) => member.userId.equals(profile._id));

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Step 4: Create the new message
    const message = await Message.create({
      content,
      fileUrl,
      channelId: channelId as string,
      memberId: member._id
    });

    // Step 5: Emit the message via Socket.io
    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
