import type { TRPCRouterRecord } from "@trpc/server";
import z from "zod";
import { publicProcedure } from "../../trpc";

export * from "./discover";

export type ApiPoemFindDetail = Awaited<
  ReturnType<typeof poemRouter.findDetail>
>;

export const poemRouter = {
  findDetail: publicProcedure
    .input(
      z
        .object({
          id: z.string().optional(),
          slug: z.string().optional(),
        })
        .refine((data) => (data.id && !data.slug) || (!data.id && data.slug), {
          message: "Provide either id or slug, not both",
          path: ["id", "slug"],
        }),
    )
    .query(async ({ ctx, input }) => {
      const { id, slug } = input;
      const poem = await ctx.db.poem.findUnique({
        where: id ? { id } : { slug: slug! },
        select: {
          id: true,
          slug: true,
          title: true,
          titleSlug: true,
          titlePinyin: true,
          paragraphs: true,
          paragraphsPinyin: true,
          visits: true,
          createdAt: true,
          annotation: true,
          dynasty: true,
          author: true,
          appreciation: true,
          translation: true,
          isOrderliness: true,
          updatedAt: true,
          tags: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      });

      if (!poem) {
        throw new Error("Poem not found");
      }

      ctx.db.poem
        .update({
          where: { id: poem.id },
          data: {
            visits: {
              increment: 1,
            },
          },
        })
        .then(() => {});

      return poem;
    }),

  search: publicProcedure
    .input(
      z.object({
        keyword: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { keyword } = input;

      const poems = await ctx.db.poem.findMany({
        where: {
          searchText: { contains: keyword },
        },
        take: 20,
        select: {
          id: true,
          slug: true,
          title: true,
          author: {
            select: {
              name: true,
              slug: true,
              dynasty: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      return poems;
    }),
} satisfies TRPCRouterRecord;
