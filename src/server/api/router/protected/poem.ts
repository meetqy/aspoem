import type { Prisma } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const protectedPoemRouter = {
  // Get paginated poems list
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(20),
        keyword: z.string().optional(),
        authorId: z.string().optional(),
        dynastyId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, keyword, authorId, dynastyId } = input;

      // Build where conditions
      const where: Prisma.PoemWhereInput = {};

      if (keyword) {
        where.OR = [
          { title: { contains: keyword } },
          { searchText: { contains: keyword } },
        ];
      }

      if (authorId) {
        where.authorId = authorId;
      }

      if (dynastyId) {
        where.author = {
          dynastyId,
        };
      }

      const skip = (page - 1) * pageSize;

      // Query total and items in parallel
      const [total, items] = await Promise.all([
        ctx.db.poem.count({ where }),
        ctx.db.poem.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
          include: {
            dynasty: true,
            author: true,
            tags: true,
          },
        }),
      ]);

      const totalPages = Math.ceil(total / pageSize);

      return {
        items,
        page,
        pageSize,
        total,
        pageCount: totalPages,
      };
    }),
} satisfies TRPCRouterRecord;
