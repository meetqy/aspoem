import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

export const protectedDynastyRouter = {
  // Get all dynasties list
  getList: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.dynasty.findMany({
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return {
      items,
      total: items.length,
    };
  }),
} satisfies TRPCRouterRecord;
