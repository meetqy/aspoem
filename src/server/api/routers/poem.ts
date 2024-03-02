import { type Author, type Poem } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { locales } from "~/dictionaries";
import { mapKeys, pick } from "lodash-es";

// 处理多语言的返回值
function transform<T extends Poem>(res: T, lang: string) {
  const objs = pick(
    res,
    ["title", "content", "introduce", "translation", "annotation"].map(
      (item) => `${item}_${lang}`,
    ),
  );

  Object.keys(res).map((key) => {
    if (key.includes("zh_Hant") || key.includes("zh_Hans")) {
      delete res[key as keyof T];
    }
  });

  const obj = mapKeys(objs, (_, key) => key.replace(`_${lang}`, ""));

  return {
    ...res,
    title: obj.title || res.title,
    content: obj.content || res.content,
    introduce: obj.introduce || res.introduce,
    translation: obj.translation || res.translation,
    annotation: obj.annotation || res.annotation,
  };
}

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
        select: z
          .array(z.enum(["title", "titlePinYin", "content", "views", "author"]))
          .optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { authorId, page, pageSize } = input;
      const select = input.select ?? ["title", "titlePinYin"];

      const total = await ctx.db.poem.count({
        where: { authorId },
      });
      const data = await ctx.db.poem.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: { authorId },
        select: {
          id: true,
          title: select.includes("title"),
          titlePinYin: select.includes("titlePinYin"),
          content: select.includes("content"),
          views: select.includes("views"),
          author: true,
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
          sort: z.enum(["updatedAt", "improve", "createdAt"]).optional(),
          lang: z.enum(locales).optional().default("zh-Hans"),
        })
        .optional(),
    )
    .query(async ({ input = {}, ctx }) => {
      const { page = 1, pageSize = 28 } = input;
      const lang = (input.lang || "zh-Hans").replace("-", "_");

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
        let temp: (Poem & {
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
        })[] = [];

        if (input.sort === "updatedAt") {
          temp = await ctx.db
            .$queryRaw`SELECT p.*, a."id" AS "author.id", a.name AS "author.name", a.dynasty as "author.dynasty", a."namePinYin" as "author.namePinYin", a."introduce" as "author.introduce", a."birthDate" as "author.birthDate", a."deathDate" as "author.deathDate", a."createdAt" as "author.createdAt", a."updatedAt" as "author.updatedAt"
      from public."Poem" p left join public."Author" a ON p."authorId"=a.id
      ORDER BY CASE WHEN p.translation IS NULL OR p.translation = '' THEN 1 ELSE 0 END, p."updatedAt" DESC
      limit ${pageSize} offset ${(page - 1) * pageSize};`;
        } else if (input.sort === "createdAt") {
          temp = await ctx.db
            .$queryRaw`SELECT p.*, a."id" AS "author.id", a.name AS "author.name", a.dynasty as "author.dynasty", a."namePinYin" as "author.namePinYin", a."introduce" as "author.introduce", a."birthDate" as "author.birthDate", a."deathDate" as "author.deathDate", a."createdAt" as "author.createdAt", a."updatedAt" as "author.updatedAt"
      from public."Poem" p left join public."Author" a ON p."authorId"=a.id
      ORDER BY CASE WHEN p.translation IS NULL OR p.translation = '' THEN 1 ELSE 0 END, p."createdAt" DESC
      limit ${pageSize} offset ${(page - 1) * pageSize};`;
        }

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
            title_zh_Hant: item.title_zh_Hant,
            titlePinYin: item.titlePinYin,
            content: item.content,
            content_zh_Hant: item.content_zh_Hant,
            contentPinYin: item.contentPinYin,
            classify: item.classify,
            genre: item.genre,
            introduce: item.introduce,
            introduce_zh_Hant: item.introduce_zh_Hant,
            translation: item.translation,
            translation_zh_Hant: item.translation_zh_Hant,
            annotation: item.annotation,
            annotation_zh_Hant: item.annotation_zh_Hant,
            updatedAt: item.updatedAt,
            createdAt: item.createdAt,
            authorId: item.authorId,
            views: item.views,
          };
        });
      }

      const total = await ctx.db.poem.count();

      return {
        data: data.map((item) => transform(item, lang)),
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
  findById: publicProcedure
    .input(
      z.object({
        id: z.number(),
        lang: z.enum(locales).optional().default("zh-Hans"),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const lang = input.lang.replace("-", "_");

      void ctx.db.poem.update({
        where: { id },
        data: { views: { increment: 1 } },
      });

      const res = await ctx.db.poem.findUnique({
        where: { id },
        include: {
          tags: true,
          author: true,
        },
      });

      if (!res) return;

      return transform(res, lang);
    }),
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
        title_zh_hant: z.string().optional(),
        content: z.string(),
        contentPinYin: z.string().optional(),
        content_zh_hant: z.string().optional(),
        authorId: z.number(),
        tagIds: z.array(z.number()).optional(),
        disconnectTagIds: z.array(z.number()).optional(),
        classify: z.string().optional(),
        genre: z.string().optional(),
        introduce: z.string().optional(),
        introduce_zh_hant: z.string().optional(),
        translation: z.string().optional(),
        translation_zh_hant: z.string().optional(),
        annotation: z.string().optional(),
        annotation_zh_hant: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      const data = {
        title: input.title.toLocaleLowerCase(),
        titlePinYin: input.titlePinYin,
        title_zh_Hant: input.title_zh_hant,
        contentPinYin: input.contentPinYin,
        content: input.content,
        content_zh_Hant: input.content_zh_hant,
        classify: input.classify,
        genre: input.genre,
        introduce: input.introduce,
        introduce_zh_Hant: input.introduce_zh_hant,
        translation: input.translation,
        translation_zh_Hant: input.translation_zh_hant,
        annotation: input.annotation,
        annotation_zh_Hant: input.annotation_zh_hant,
      };

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
            ...data,
            author: {
              connect: { id: input.authorId },
            },
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
          ...data,
          authorId: input.authorId,
          tags: input.tagIds && {
            connect: input.tagIds.map((id) => ({ id })),
          },
        },
      });
    }),

  updateHant: publicProcedure
    .input(
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        introduce: z.string().optional(),
        translation: z.string().optional(),
        annotation: z.string().optional(),
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.poem.findUnique({
        where: { id: input.id },
      });

      if (!res) return;

      const json: Record<string, string> = {};

      if (res.title_zh_Hant !== input.title && input.title)
        json.title_zh_Hant = input.title;
      if (res.content_zh_Hant !== input.content && input.content)
        json.content_zh_Hant = input.content;
      if (res.introduce_zh_Hant !== input.introduce && input.introduce)
        json.introduce_zh_Hant = input.introduce;
      if (res.translation_zh_Hant !== input.translation && input.translation)
        json.translation_zh_Hant = input.translation;
      if (res.annotation_zh_Hant !== input.annotation && input.annotation)
        json.annotation_zh_Hant = input.annotation;

      if (Object.keys(json).length === 0) return;

      return ctx.db.poem.update({
        where: { id: input.id },
        data: json,
      });
    }),
});
