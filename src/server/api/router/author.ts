import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../trpc";

export const authorRouter = {
  getList: publicProcedure
    .input(
      z.object({
        dynastySlug: z.string().optional(), // 朝代筛选，可选
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { dynastySlug, limit, cursor } = input;

      const authors = await ctx.db.author.findMany({
        where: dynastySlug
          ? {
              dynasty: {
                slug: dynastySlug,
              },
            }
          : undefined,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          name: true,
          slug: true,
          introduce: true,
          dynasty: {
            select: {
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              poems: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor;
      if (authors.length > limit) {
        const nextItem = authors.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: authors,
        nextCursor,
      };
    }),
} satisfies TRPCRouterRecord;
