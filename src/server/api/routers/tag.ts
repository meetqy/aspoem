import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  find: publicProcedure.query(({ ctx }) => ctx.db.tag.findMany()),

  findById: publicProcedure.input(z.number()).query(({ input, ctx }) =>
    ctx.db.tag.findFirst({
      where: { id: input },
    }),
  ),

  deleteById: publicProcedure
    .input(z.number())
    .mutation(({ input, ctx }) => ctx.db.tag.delete({ where: { id: input } })),

  create: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        token: z.string(),
        name: z.string(),
        type: z.string().optional(),
        introduce: z.string().optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      if (input.id) {
        return ctx.db.tag.update({
          where: { id: input.id },
          data: {
            name: input.name,
            type: input.type,
            introduce: input.introduce,
          },
        });
      }

      return ctx.db.tag.create({
        data: {
          name: input.name,
          type: input.type,
          introduce: input.introduce,
        },
      });
    }),
});
