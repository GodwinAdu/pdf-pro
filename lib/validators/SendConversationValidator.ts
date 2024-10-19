import { z } from "zod";


export const SendConversationValidator = z.object({
    sessionId:z.string(),
    userId:z.string(),
    message:z.string(),
})