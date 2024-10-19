import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentUser } from "@/lib/helpers/current-user";
import DirectMessage from "@/lib/models/direct-message.models";
import GroupConversation from "@/lib/models/group-conversation.models"; // Rename this if it's specifically for direct conversations

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentUser();
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;
    
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    // Step 1: Find the conversation involving the current profile
    const conversation = await GroupConversation.findOne({
      _id: conversationId,
      $or: [
        { 'memberOne.profileId': profile._id },
        { 'memberTwo.profileId': profile._id }
      ]
    }).populate('memberOne.profile memberTwo.profile'); // Ensure correct population

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Step 2: Determine which member is the current user
    const member = conversation.memberOne.profileId.equals(profile._id)
      ? conversation.memberOne
      : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Step 3: Create a new direct message
    const message = await DirectMessage.create({
      content,
      fileUrl,
      conversationId: conversationId as string,
      memberId: member._id
    });

    // Step 4: Emit the message via Socket.IO
    const channelKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
