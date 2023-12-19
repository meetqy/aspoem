import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  find: publicProcedure.query(({ ctx }) => ctx.db.tag.findMany({})),
  create: publicProcedure
    .input(
      z.object({
        token: z.string(),
        tags: z.array(z.string()),
      }),
    )
    .mutation(({ input, ctx }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      return ctx.db.tag.createMany({
        data: [
          ...input.tags.map((tag) => ({
            name: tag.toLocaleLowerCase(),
          })),
        ],
      });
    }),
});
