import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const postRouter = {
  hello: publicProcedure.query(() => {
    return "world";
  }),
} satisfies TRPCRouterRecord;
