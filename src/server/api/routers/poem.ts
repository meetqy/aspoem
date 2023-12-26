import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const poemRouter = createTRPCRouter({
  find: publicProcedure.query(({ ctx }) => ctx.db.poem.findMany()),
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
        content: z.string(),
        authorId: z.number(),
        tagIds: z.array(z.number()).optional(),
        classify: z.string().optional(),
        genre: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      const res = await ctx.db.poem.findFirst({
        where: {
          authorId: input.authorId,
          title: input.title.toLocaleLowerCase(),
        },
      });

      if (res) throw new Error("诗词已存在");

      if (input.id) {
        return ctx.db.poem.update({
          where: { id: input.id },
          data: {
            title: input.title.toLocaleLowerCase(),
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

      return ctx.db.poem.create({
        data: {
          title: input.title.toLocaleLowerCase(),
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
