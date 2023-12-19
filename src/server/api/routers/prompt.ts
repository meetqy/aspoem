import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const promptRouter = createTRPCRouter({
  find: publicProcedure.input(z.object({}).optional()).query(({ ctx }) =>
    ctx.db.prompt.findMany({
      include: {
        tags: true,
      },
    }),
  ),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        content: z.string(),
        referenceName: z.string().optional(),
        referenceLink: z.string().optional(),
        contributedName: z.string().optional(),
        contributedLink: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.number()),
        token: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      return ctx.db.prompt.create({
        data: {
          name: input.name,
          content: input.content,
          referenceName: input.referenceName,
          referenceLink: input.referenceLink,
          contributedName: input.contributedName,
          contributedLink: input.contributedLink,
          description: input.description,
          tags: {
            connect: input.tags.map((tag) => ({ id: tag })),
          },
        },
      });
    }),
});
