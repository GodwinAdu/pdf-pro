import { currentUser } from "@/lib/helpers/current-user";
import GroupMessage from "@/lib/models/group-message.models";
import { NextResponse } from "next/server";



const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentUser();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    let messages;

    // Query for messages, supporting pagination via cursor
    if (cursor) {
      messages = await GroupMessage.find({
        channelId,
        _id: { $lt: cursor },  // For pagination, fetch messages before the cursor
      })
        .limit(MESSAGES_BATCH)
        .sort({ createdAt: -1 })
        .populate({
          path: "memberId",
          populate: { path: "userId" }  // Populate member and their profile
        });
    } else {
      messages = await GroupMessage.find({
        channelId,
      })
        .limit(MESSAGES_BATCH)
        .sort({ createdAt: -1 })
        .populate({
          path: "memberId",
          populate: { path: "userId" }  // Populate member and their profile
        });
    }

    // Determine the next cursor for pagination
    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[messages.length - 1]._id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
