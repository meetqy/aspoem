import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  findMany: publicProcedure
    .input(
      z
        .object({
          select: z
            .array(z.enum(["name", "type", "introduce", "count"]))
            .optional(),
          type: z.string().or(z.null()).optional(),
        })
        .optional(),
    )
    .query(({ ctx, input = {} }) => {
      const { select = ["name", "type", "introduce"] } = input;

      return ctx.db.tag.findMany({
        where: {
          type: {
            equals: input.type,
          },
        },
        select: {
          id: true,
          name: select.includes("name"),
          type: select.includes("type"),
          introduce: select.includes("introduce"),
          _count: select.includes("count")
            ? {
                select: {
                  poems: true,
                },
              }
            : undefined,
        },
      });
    }),

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
