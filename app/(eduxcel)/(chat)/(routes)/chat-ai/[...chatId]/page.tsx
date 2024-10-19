import ConversationWrapper from "@/components/conversation/ConversationWrapper";
import { currentUser } from "@/lib/helpers/current-user";

export const dynamic = 'force-dynamic'; // This forces server-side rendering
const page = async ({ params }: { params: { chatId: string[] } }) => {
  const user = await currentUser(); // Assuming this handles queries/mutations
  const chatId = params.chatId[1];
  console.log(chatId)
  return (
    <div>
       <ConversationWrapper sessionId={chatId} id={user._id as string} />
    </div>
  )
}

export default page
