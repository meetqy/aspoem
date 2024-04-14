import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const otherRouter = createTRPCRouter({
  getGenCard: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.poem.findMany({
        where: {
          AND: [
            { tags: { some: { name: "七言绝句" } } },
            {
              cards: { none: {} },
            },
          ],
        },
        include: {
          author: true,
        },
        skip: (input.page - 1) * 20,
        take: 20,
      });

      const count = await ctx.db.poem.count({
        where: {
          AND: [
            { tags: { some: { name: "七言绝句" } } },
            {
              cards: { none: {} },
            },
          ],
        },
      });

      return {
        data: result,
        total: count,
      };
    }),
});
