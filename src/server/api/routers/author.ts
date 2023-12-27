import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authorRouter = createTRPCRouter({
  find: publicProcedure.query(({ ctx }) => ctx.db.author.findMany()),

  findById: publicProcedure
    .input(z.number())
    .query(({ input, ctx }) =>
      ctx.db.author.findUnique({ where: { id: input } }),
    ),

  create: publicProcedure
    .input(
      z.object({
        token: z.string(),
        id: z.number().optional(),
        name: z.string(),
        dynasty: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      const res = await ctx.db.author.findMany({
        where: {
          name: input.name.toLocaleLowerCase(),
          dynasty: input.dynasty,
        },
      });

      if (res.length > 0) throw new Error("Author already exists");

      if (input.id) {
        return ctx.db.author.update({
          where: { id: input.id },
          data: {
            name: input.name.toLocaleLowerCase(),
            dynasty: input.dynasty,
          },
        });
      }

      return ctx.db.author.create({
        data: {
          name: input.name.toLocaleLowerCase(),
          dynasty: input.dynasty,
        },
      });
    }),
});
