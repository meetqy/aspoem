import { protectedProcedure, publicProcedure } from "../trpc";

import type { TRPCRouterRecord } from "@trpc/server";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
} satisfies TRPCRouterRecord;
