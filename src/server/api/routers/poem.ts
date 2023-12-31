import { type Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const poemRouter = createTRPCRouter({
  count: publicProcedure.query(({ ctx }) => ctx.db.poem.count()),

  find: publicProcedure
    .input(
      z
        .object({
          page: z.number().optional().default(1),
          pageSize: z.number().optional().default(28),
          sort: z.enum(["updatedAt", "improve"]).optional(),
        })
        .optional(),
    )
    .query(async ({ input = {}, ctx }) => {
      const { page = 1, pageSize = 28 } = input;

      const orderBy: Prisma.PoemOrderByWithRelationInput = {};

      if (input.sort) {
        if (input.sort === "improve") {
          orderBy.updatedAt = { sort: "asc", nulls: "first" };
        } else {
          orderBy[input.sort] = { sort: "desc", nulls: "last" };
        }
      }

      const data = await ctx.db.poem.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
        include: {
          author: true,
        },
      });

      const total = await ctx.db.poem.count();

      return {
        data,
        page,
        pageSize,
        hasNext: page * pageSize < total,
        total,
      };
    }),
  /**
   * 根据 id 查找诗词
   */
  findById: publicProcedure.input(z.number()).query(async ({ input, ctx }) =>
    ctx.db.poem.findUnique({
      where: { id: input },
      include: {
        tags: true,
        author: true,
      },
    }),
  ),
  /**
   * 创建诗词
   */
  create: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        token: z.string(),
        title: z.string(),
        titlePinYin: z.string().optional(),
        content: z.string(),
        contentPinYin: z.string().optional(),
        authorId: z.number(),
        tagIds: z.array(z.number()).optional(),
        classify: z.string().optional(),
        genre: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      if (input.id) {
        return ctx.db.poem.update({
          where: { id: input.id },
          data: {
            title: input.title.toLocaleLowerCase(),
            titlePinYin: input.titlePinYin,
            contentPinYin: input.contentPinYin,
            content: input.content,
            author: {
              connect: { id: input.authorId },
            },
            classify: input.classify,
            genre: input.genre,
            tags: input.tagIds && {
              connect: input.tagIds.map((id) => ({ id })),
            },
          },
        });
      }

      const res = await ctx.db.poem.findFirst({
        where: {
          authorId: input.authorId,
          title: input.title.toLocaleLowerCase(),
          content: input.content,
        },
      });

      if (res) throw new Error("诗词已存在");

      return ctx.db.poem.create({
        data: {
          title: input.title.toLocaleLowerCase(),
          titlePinYin: input.titlePinYin,
          contentPinYin: input.contentPinYin,
          content: input.content,
          authorId: input.authorId,
          classify: input.classify,
          genre: input.genre,
          tags: input.tagIds && {
            connect: input.tagIds.map((id) => ({ id })),
          },
        },
      });
    }),
});
