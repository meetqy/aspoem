import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authorRouter = createTRPCRouter({
  count: publicProcedure.query(({ ctx }) => ctx.db.author.count()),

  sitemap: publicProcedure.query(async ({ ctx }) =>
    ctx.db.author.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    }),
  ),

  timeline: publicProcedure
    .input(
      z
        .object({
          page: z.number().optional().default(1),
          pageSize: z.number().optional().default(28),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { page = 1, pageSize = 28 } = input ?? {};

      const total = await ctx.db.author.count();
      const data = await ctx.db.author.findMany({
        orderBy: {
          poems: {
            _count: "desc",
          },
        },
        select: {
          _count: {
            select: {
              poems: true,
            },
          },
          id: true,
          name: true,
          namePinYin: true,
          dynasty: true,
          birthDate: true,
          deathDate: true,
          introduce: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      return {
        data,
        page,
        pageSize: total,
        hasNext: page * pageSize < total,
        total,
      };
    }),

  find: publicProcedure.query(({ ctx }) => ctx.db.author.findMany()),

  findById: publicProcedure.input(z.number()).query(({ input, ctx }) =>
    ctx.db.author.findUnique({
      where: { id: input },
      include: {
        _count: {
          select: {
            poems: true,
          },
        },
      },
    }),
  ),

  create: publicProcedure
    .input(
      z.object({
        token: z.string(),
        id: z.number().optional(),
        name: z.string(),
        birthDate: z.number().optional(),
        deathDate: z.number().optional(),
        introduce: z.string().optional(),
        namePinYin: z.string().optional(),
        dynasty: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      if (input.id) {
        return ctx.db.author.update({
          where: { id: input.id },
          data: {
            name: input.name.toLocaleLowerCase(),
            introduce: input.introduce,
            birthDate: input.birthDate,
            deathDate: input.deathDate,
            namePinYin: input.namePinYin,
            dynasty: input.dynasty,
          },
        });
      }

      const res = await ctx.db.author.findMany({
        where: {
          name: input.name.toLocaleLowerCase(),
          introduce: input.introduce,
          birthDate: input.birthDate,
          deathDate: input.deathDate,
          namePinYin: input.namePinYin,
          dynasty: input.dynasty,
        },
      });

      if (res.length > 0) throw new Error("Author already exists");

      return ctx.db.author.create({
        data: {
          name: input.name.toLocaleLowerCase(),
          dynasty: input.dynasty,
        },
      });
    }),
});
