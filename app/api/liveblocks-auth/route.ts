import { currentUser } from "@/lib/helpers/current-user";
import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";


export async function POST(request: Request) {
  const mainUser = await currentUser();

  const { _id, fullName, email, imageUrl } = mainUser;

  // Get the current user from your database
  const user = {
    id:_id,
    info: {
      id:_id,
      name:fullName,
      email: email,
      avatar: imageUrl || "",
      color: getUserColor(_id),
    }
  }

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [],
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}