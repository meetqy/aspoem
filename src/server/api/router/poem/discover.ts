import type { TRPCRouterRecord } from "@trpc/server";
import z from "zod";
import { publicProcedure } from "../../trpc";

export const listSelect = {
  id: true,
  slug: true,
  title: true,
  titleSlug: true,
  titlePinyin: true,
  paragraphs: true,
  visits: true,
  createdAt: true,
  author: {
    select: {
      name: true,
      slug: true,
      dynasty: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  },
  tags: {
    select: {
      name: true,
      slug: true,
    },
  },
};

export const poemDiscoverRouter = {
  getHotList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(), // cursor 为 poem id
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const poems = await ctx.db.poem.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ visits: "desc" }, { id: "desc" }],
        select: listSelect,
      });

      let nextCursor: typeof cursor;
      if (poems.length > limit) {
        const nextItem = poems.pop(); // 移除多取的那一个
        nextCursor = nextItem!.id;
      }

      return {
        items: poems,
        nextCursor,
      };
    }),

  getLatestList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const poems = await ctx.db.poem.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        select: listSelect,
      });

      let nextCursor: typeof cursor;
      if (poems.length > limit) {
        const nextItem = poems.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: poems,
        nextCursor,
      };
    }),

  getLatestListByDynasty: publicProcedure
    .input(
      z.object({
        dynastySlug: z.string(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { dynastySlug, limit, cursor } = input;

      const dynasty = await ctx.db.dynasty.findUnique({
        where: { slug: dynastySlug },
        select: {
          name: true,
          slug: true,
          pinyin: true,
          _count: { select: { poems: true } },
        },
      });

      if (!dynasty) {
        throw new Error("朝代不存在");
      }

      const poems = await ctx.db.poem.findMany({
        where: {
          dynasty: {
            slug: dynastySlug,
          },
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: listSelect,
      });

      let nextCursor: typeof cursor;
      if (poems.length > limit) {
        const nextItem = poems.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: poems,
        nextCursor,
        dynasty,
      };
    }),

  getRecommendedList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(), // cursor 为 poem id
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const poems = await ctx.db.poem.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        select: listSelect,
      });

      let nextCursor: typeof cursor;
      if (poems.length > limit) {
        const nextItem = poems.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: poems,
        nextCursor,
      };
    }),

  getRandom: publicProcedure.query(async ({ ctx }) => {
    // 获取诗词总数
    const totalCount = await ctx.db.poem.count();

    if (totalCount === 0) {
      return null;
    }

    // 生成随机偏移量
    const randomOffset = Math.floor(Math.random() * totalCount);

    // 使用偏移量获取随机诗词
    const randomPoem = await ctx.db.poem.findFirst({
      skip: randomOffset,
      select: listSelect,
    });

    return randomPoem;
  }),
} satisfies TRPCRouterRecord;
