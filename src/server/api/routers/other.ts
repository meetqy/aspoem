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
      const where = {
        AND: [
          { tags: { some: { name: "五言律诗" } } },
          {
            cards: { none: {} },
          },
        ],
      };

      const result = await ctx.db.poem.findMany({
        where,
        include: {
          author: true,
        },
        orderBy: {
          id: "asc",
        },
        skip: (input.page - 1) * 100,
        take: 100,
      });

      const count = await ctx.db.poem.count({
        where,
      });

      return {
        data: result,
        total: count,
      };
    }),
});
