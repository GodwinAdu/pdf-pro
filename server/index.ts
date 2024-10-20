
import { privateProcedure, publicProcedure, router } from './trpc';
import { createUser, fetchUser } from '@/lib/actions/user.actions';
import { deleteFile, fetchFileById, fetchFileByKey, fetchPDF, fetchUserFiles } from '@/lib/actions/file.actions';
import { INFINITE_QUERY_LIMIT } from '../config/infinite-query';
import { fetchMessages } from '@/lib/actions/message.actions';
import { fetchConversations, fetchPrevConversations } from '@/lib/actions/conversation.actions';
import { z } from "zod"
import { TRPCError } from '@trpc/server/unstable-core-do-not-import';
import { currentUser } from '@/lib/helpers/current-user';

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {


    const user = await currentUser();

    if (!user?._id || !user.emailAddresses[0].emailAddress) throw new TRPCError({ code: 'UNAUTHORIZED' })
    //check if user is in the database?
    const dbUser = await fetchUser(user._id);

    if (!dbUser) {
      //create user in db
      await createUser({
        clerkId: user?.id,
        fullName: `${user?.firstName}  ${user?.lastName}`,
        email: user?.emailAddresses[0].emailAddress,
        // phone:user?.phoneNumbers[0].phoneNumber
      })
    }
    return { success: true }
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await fetchUserFiles({ userId })
  }),
  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx
      const { fileId, cursor } = input
      const limit = input.limit ?? INFINITE_QUERY_LIMIT

      const file = await fetchPDF({
        id: fileId,
        userId
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

      const messages = await fetchMessages({
        fileId,
        limit,
        cursor
      })
      if (!messages) throw new TRPCError({ code: 'NOT_FOUND' })


      return { messages }
    }),
  // Query to get all conversations by sessionId
  getConversationsBySessionId: privateProcedure
    .input(
      z.object({
        sessionId: z.string(), // Expecting sessionId as input
      })
    )
    .query(async ({ input }) => {
      const { sessionId } = input;

      try {
        // Fetch the conversation with the given sessionId from the MongoDB database
        const conversation = await fetchPrevConversations({sessionId});

        if (!conversation) {
          return { conversations: [] };
        }

        return {
          conversations: conversation.messages.reverse(), // return the array of messages
        };
      } catch (error) {
        console.error("Error fetching conversations by sessionId", error);
        throw new Error("Failed to fetch conversations");
      }
    }),
  getConversations: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx
      const { cursor } = input
      const limit = input.limit ?? INFINITE_QUERY_LIMIT

      const conversations = await fetchConversations({
        userId,
        limit,
        cursor
      })
      if (!conversations) throw new TRPCError({ code: 'NOT_FOUND' })


      return { conversations }
    }),
  getFileUploadStatus: privateProcedure.input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { userId } = ctx;
      const file = await fetchFileById({
        id: input.id,
        userId
      })
      if (!file) return { status: 'PENDING' as const }

      return { status: file.uploadStatus }

    }),
  getFile: privateProcedure.input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx

      const file = await fetchFileByKey({
        key: input.key,
        userId
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      console.log("in trpc", file)
      return file;
    }),
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx

      const file = await deleteFile({
        id: input.id,
        userId,
      })
      return file
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;