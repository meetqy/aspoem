import { type Author, type Poem } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const poemRouter = createTRPCRouter({
  count: publicProcedure.query(({ ctx }) => ctx.db.poem.count()),

  isSame: publicProcedure
    .input(
      z.object({
        authorId: z.number(),
        title: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.db.poem.count({
        where: {
          authorId: input.authorId,
          title: input.title.toLocaleLowerCase(),
        },
      });

      return res > 1;
    }),

  /**
   * 根据 id 删除诗词
   */
  deleteById: publicProcedure
    .input(
      z.object({
        id: z.number(),
        token: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");
      return ctx.db.poem.delete({ where: { id: input.id } });
    }),

  findByAuthorId: publicProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(28),
        authorId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { authorId, page, pageSize } = input;

      const total = await ctx.db.poem.count();
      const data = await ctx.db.poem.findMany({
        skip: (page - 1) * pageSize,
        where: { authorId },
        select: {
          id: true,
          title: true,
          titlePinYin: true,
        },
      });

      return {
        data,
        page,
        pageSize,
        hasNext: page * pageSize < total,
        total,
      };
    }),

  sitemap: publicProcedure.query(async ({ ctx }) =>
    ctx.db.poem.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    }),
  ),

  search: publicProcedure
    .input(z.string().optional())
    .query(({ input, ctx }) => {
      return ctx.db.poem.findMany({
        where: {
          OR: [
            { title: { contains: input } },
            { content: { contains: input } },
            { author: { name: { contains: input } } },
          ],
        },
        select: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          title: true,
          content: true,
          id: true,
        },
        orderBy: {
          titlePinYin: { sort: "desc", nulls: "last" },
        },
        take: 50,
      });
    }),

  find: publicProcedure
    .input(
      z
        .object({
          page: z.number().optional().default(1),
          pageSize: z.number().optional().default(28),
          sort: z.enum(["updatedAt", "improve"]).optional(),
        })
        .optional(),
    )
    .query(async ({ input = {}, ctx }) => {
      const { page = 1, pageSize = 28 } = input;
      let data: (Poem & { author: Author })[];

      if (input.sort === "improve") {
        data = await ctx.db.poem.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: {
            translation: { sort: "desc", nulls: "first" },
          },
          include: {
            author: true,
          },
        });
      } else {
        const temp: (Poem & {
          "author.name": Author["name"];
          "author.dynasty": Author["dynasty"];
          "author.id": Author["id"];
          "author.namePinYin": Author["namePinYin"];
          "author.introduce": Author["introduce"];
          "author.birthDate": Author["birthDate"];
          "author.deathDate": Author["deathDate"];
          "author.updatedAt": Author["updatedAt"];
          "author.createdAt": Author["createdAt"];
          author: Author;
        })[] = await ctx.db
          .$queryRaw`SELECT p.*, a."id" AS "author.id", a.name AS "author.name", a.dynasty as "author.dynasty", a."namePinYin" as "author.namePinYin", a."introduce" as "author.introduce", a."birthDate" as "author.birthDate", a."deathDate" as "author.deathDate", a."createdAt" as "author.createdAt", a."updatedAt" as "author.updatedAt"
      from "Poem" p left join "Author" a ON p."authorId"=a.id
      ORDER BY CASE WHEN p.translation IS NULL OR p.translation = '' THEN 1 ELSE 0 END, p."updatedAt" DESC
      limit ${pageSize} offset ${(page - 1) * pageSize};`;

        data = temp.map((item) => {
          return {
            author: {
              id: item["author.id"],
              name: item["author.name"],
              dynasty: item["author.dynasty"],
              namePinYin: item["author.namePinYin"],
              introduce: item["author.introduce"],
              birthDate: item["author.birthDate"],
              deathDate: item["author.deathDate"],
              updatedAt: item["author.updatedAt"],
              createdAt: item["author.createdAt"],
            },
            id: item.id,
            title: item.title,
            titlePinYin: item.titlePinYin,
            content: item.content,
            contentPinYin: item.contentPinYin,
            classify: item.classify,
            genre: item.genre,
            introduce: item.introduce,
            translation: item.translation,
            annotation: item.annotation,
            updatedAt: item.updatedAt,
            createdAt: item.createdAt,
            authorId: item.authorId,
          };
        });
      }

      const total = await ctx.db.poem.count();

      return {
        data,
        page,
        pageSize,
        hasNext: page * pageSize < total,
        total,
      };
    }),

  findByTagId: publicProcedure
    .input(
      z.object({
        id: z.number(),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(28),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { page = 1, pageSize = 28, id } = input;

      const [data, total, tag] = await ctx.db.$transaction([
        ctx.db.poem.findMany({
          where: { tags: { some: { id } } },
          include: { author: true },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        ctx.db.poem.count({
          where: { tags: { some: { id } } },
        }),
        ctx.db.tag.findUnique({ where: { id } }),
      ]);

      return {
        data,
        page,
        pageSize,
        hasNext: page * pageSize < total,
        tag,
        total,
      };
    }),

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
        titlePinYin: z.string().optional(),
        content: z.string(),
        contentPinYin: z.string().optional(),
        authorId: z.number(),
        tagIds: z.array(z.number()).optional(),
        disconnectTagIds: z.array(z.number()).optional(),
        classify: z.string().optional(),
        genre: z.string().optional(),
        introduce: z.string().optional(),
        translation: z.string().optional(),
        annotation: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      if (input.id) {
        const res = await ctx.db.poem.findMany({
          where: {
            authorId: input.authorId,
            title: input.title.toLocaleLowerCase(),
          },
        });

        if (res.length > 1) throw new Error("诗词已存在");

        return ctx.db.poem.update({
          where: { id: input.id },
          data: {
            title: input.title.toLocaleLowerCase(),
            titlePinYin: input.titlePinYin,
            contentPinYin: input.contentPinYin,
            content: input.content,
            author: {
              connect: { id: input.authorId },
            },
            classify: input.classify,
            genre: input.genre,
            introduce: input.introduce,
            translation: input.translation,
            annotation: input.annotation,
            tags: input.tagIds && {
              connect: input.tagIds.map((id) => ({ id })),
              disconnect: input.disconnectTagIds?.map((id) => ({ id })),
            },
          },
        });
      }

      const res = await ctx.db.poem.findFirst({
        where: {
          authorId: input.authorId,
          title: input.title.toLocaleLowerCase(),
        },
      });

      if (res) throw new Error("诗词已存在");

      return ctx.db.poem.create({
        data: {
          title: input.title.toLocaleLowerCase(),
          titlePinYin: input.titlePinYin,
          contentPinYin: input.contentPinYin,
          content: input.content,
          authorId: input.authorId,
          classify: input.classify,
          genre: input.genre,
          introduce: input.introduce,
          translation: input.translation,
          tags: input.tagIds && {
            connect: input.tagIds.map((id) => ({ id })),
          },
          annotation: input.annotation,
        },
      });
    }),
});
