import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getRandom } from "~/utils/unsplash";

export const cardRouter = createTRPCRouter({
  /**
   * 获取需要生成 Card 的诗词
   */
  getGenerateCard: publicProcedure
    .input(
      z.object({
        token: z.string(),
        page: z.number().default(1),
        tagName: z.string().default("七言律诗"),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.token !== process.env.TOKEN) {
        throw new Error("token error");
      }

      const where = {
        AND: [
          { tags: { some: { name: input.tagName } } },
          {
            cards: { none: {} },
          },
        ],
      };

      const [result, count, urls] = await Promise.all([
        ctx.db.poem.findMany({
          where,
          select: {
            author: true,
            id: true,
            content: true,
            title: true,
          },
          orderBy: {
            id: "asc",
          },
          skip: (input.page - 1) * 30,
          take: 30,
        }),
        ctx.db.poem.count({
          where,
        }),
        getRandom(),
      ]);

      return {
        data: result,
        total: count,
        urls,
        pageCount: Math.ceil(count / 30),
      };
    }),

  createCardItem: publicProcedure
    .input(
      z.object({
        token: z.string(),
        poemId: z.number(),
        url: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.token !== process.env.TOKEN) {
        throw new Error("token error");
      }

      return ctx.db.card.create({
        data: {
          poemId: input.poemId,
          url: input.url,
        },
      });
    }),
});
