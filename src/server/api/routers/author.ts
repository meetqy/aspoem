import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authorRouter = createTRPCRouter({
  find: publicProcedure.query(({ ctx }) => ctx.db.author.findMany()),
  create: publicProcedure
    .input(
      z.object({
        token: z.string(),
        names: z.array(z.string()),
      }),
    )
    .mutation(({ input, ctx }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      return ctx.db.author.createMany({
        data: [
          ...input.names.map((name) => ({
            name: name.toLocaleLowerCase(),
          })),
        ],
      });
    }),
});
