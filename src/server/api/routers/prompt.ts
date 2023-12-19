import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const promptRouter = createTRPCRouter({
  find: publicProcedure.input(z.object({}).optional()).query(({ ctx }) =>
    ctx.db.prompt.findMany({
      include: {
        tags: true,
      },
    }),
  ),
});
