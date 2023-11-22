import { z } from "zod";


export const SendConversationValidator = z.object({
    userId:z.string(),
    message:z.string(),
})