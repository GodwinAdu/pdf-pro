
import { currentUser } from '@/lib/helpers/current-user';
import { TRPCError, initTRPC } from '@trpc/server';


const t = initTRPC.create()
const middleware = t.middleware

const isAuth = middleware(async (opts) => {
  const user = await currentUser();

  if (!user || !user._id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return opts.next({
    ctx: {
      userId: user._id,
      user,
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)
