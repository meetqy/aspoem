import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  findMany: publicProcedure
    .input(
      z
        .object({
          select: z
            .array(z.enum(["id", "name", "type", "introduce", "count"]))
            .default(["id", "name", "type", "introduce"])
            .optional(),
          type: z.string().optional(),
        })
        .optional(),
    )
    .query(({ ctx, input = {} }) =>
      ctx.db.tag.findMany({
        where: {
          type: input.type,
        },
        select: {
          id: input.select?.includes("id"),
          name: input.select?.includes("name"),
          type: input.select?.includes("type"),
          introduce: input.select?.includes("introduce"),
          _count: input.select?.includes("count")
            ? {
                select: {
                  poems: true,
                },
              }
            : undefined,
        },
      }),
    ),

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
        type: z.enum(["1", "2"]).or(z.null()).optional(),
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
            type: input.type ?? null,
            introduce: input.introduce,
          },
        });
      }

      return ctx.db.tag.create({
        data: {
          name: input.name,
          type: input.type ?? null,
          introduce: input.introduce,
        },
      });
    }),
});
