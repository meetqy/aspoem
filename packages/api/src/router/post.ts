import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst();
  }),

  hi: publicProcedure.query(() => {
    return "hello world!";
  }),
} satisfies TRPCRouterRecord;
