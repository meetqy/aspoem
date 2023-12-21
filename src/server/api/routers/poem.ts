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
        token: z.string(),
        title: z.string(),
        content: z.string(),
        authorId: z.number(),
        tagIds: z.array(z.number()),
      }),
    )
    .mutation(({ input, ctx }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      return ctx.db.poem.create({
        data: {
          title: input.title.toLocaleLowerCase(),
          content: input.content,
          authorId: input.authorId,
          tags: {
            connect: input.tagIds.map((id) => ({ id })),
          },
        },
      });
    }),
});
