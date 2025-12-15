import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../trpc";

export const authorRouter = {
  // cursor分页接口
  getList: publicProcedure
    .input(
      z.object({
        dynastySlug: z.string().optional(),
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
        orderBy: [{ name: "asc" }, { id: "asc" }],
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

      let nextCursor: typeof cursor | undefined;
      if (authors.length > limit) {
        const nextItem = authors.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: authors,
        nextCursor,
      };
    }),

  // page分页接口
  getPagedList: publicProcedure
    .input(
      z.object({
        dynastySlug: z.string().optional(),
        pageSize: z.number().min(1).max(100).default(20),
        page: z.number().min(1).default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { dynastySlug, pageSize, page } = input;
      const skip = (page - 1) * pageSize;

      const whereClause = dynastySlug
        ? {
            dynasty: {
              slug: dynastySlug,
            },
          }
        : undefined;

      const [authors, total] = await Promise.all([
        ctx.db.author.findMany({
          where: whereClause,
          take: pageSize,
          skip,
          orderBy: [{ name: "asc" }, { id: "asc" }],
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
        }),
        ctx.db.author.count({
          where: whereClause,
        }),
      ]);

      const totalPages = Math.ceil(total / pageSize);

      return {
        items: authors,
        pageSize,
        page,
        totalPages,
        total,
      };
    }),

  findBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { slug } = input;

      return await ctx.db.author.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          slug: true,
          introduce: true,
          birthDate: true,
          deathDate: true,
          dynasty: {
            select: {
              name: true,
              slug: true,
            },
          },
          poems: {
            select: {
              title: true,
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
    }),
} satisfies TRPCRouterRecord;
