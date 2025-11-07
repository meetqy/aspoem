import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";

export const dynastyRouter = {
  getPoemsCount: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.dynasty.findMany({
      select: {
        name: true,
        slug: true,
        pinyin: true,
        _count: {
          select: { poems: true },
        },
      },
    });
  }),

  getAuthorsCount: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.dynasty.findMany({
      select: {
        name: true,
        slug: true,
        pinyin: true,
        _count: {
          select: { authors: true },
        },
      },
    });
  }),
} satisfies TRPCRouterRecord;
