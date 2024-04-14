import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getRandom } from "~/utils/unsplash";

export const otherRouter = createTRPCRouter({
  getGenCard: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        tagName: z.string().default("七言律诗"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        AND: [
          { tags: { some: { name: input.tagName } } },
          {
            cards: { none: {} },
          },
        ],
      };

      const urls = await getRandom();

      const result = await ctx.db.poem.findMany({
        where,
        include: {
          author: true,
        },
        orderBy: {
          id: "asc",
        },
        skip: (input.page - 1) * 30,
        take: 30,
      });

      const count = await ctx.db.poem.count({
        where,
      });

      return {
        data: result,
        total: count,
        urls,
        pageCount: Math.ceil(count / 30),
      };
    }),
});
