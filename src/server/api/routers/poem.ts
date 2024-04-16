import { type Author, type Poem } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { LangZod, transformPoem, transformTag } from "../utils";
import { splitChineseSymbol } from "~/utils";

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
    .input(z.string().default(""))
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
          lang: LangZod,
        })
        .optional(),
    )
    .query(async ({ input = {}, ctx }) => {
      const { page = 1, pageSize = 28 } = input;

      let data: (Poem & { author: Author })[];

      if (input.sort === "improve") {
        // 待优化的 待完善
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
      } else if (input.sort === "updatedAt") {
        // 首页推荐
        const temp = await ctx.db.poem.findMany({
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            author: true,
          },
          take: 500,
        });

        data = temp.filter((item) => item.translation).slice(0, pageSize);
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

        if (input.sort === "createdAt") {
          // 最新
          temp = await ctx.db
            .$queryRaw`SELECT p.*, a."id" AS "author.id", a.name AS "author.name", a.dynasty as "author.dynasty", a."namePinYin" as "author.namePinYin", a."introduce" as "author.introduce", a."birthDate" as "author.birthDate", a."deathDate" as "author.deathDate", a."createdAt" as "author.createdAt", a."updatedAt" as "author.updatedAt"
      from "Poem" p left join "Author" a ON p."authorId"=a.id
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
            translation_en: item.translation_en,
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
        data: data.map((item) => transformPoem(item, input.lang || "zh-Hans")),
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
        page: z.number().default(1),
        pageSize: z.number().default(28),
        lang: LangZod,
      }),
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, id } = input;

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

      if (!tag) return;

      return {
        data: data.map((item) => transformPoem(item, input.lang)),
        page,
        pageSize,
        hasNext: page * pageSize < total,
        tag: transformTag(tag, input.lang),
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
        lang: LangZod,
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      ctx.db.poem
        .update({
          where: { id },
          data: { views: { increment: 1 } },
        })
        .then(console.log)
        .catch(console.error);

      const res = await ctx.db.poem.findUnique({
        where: { id },
        include: {
          tags: true,
          author: true,
        },
      });

      if (!res) return;

      // 特殊逻辑，自动标注五言绝句/七言绝句
      const has = res.tags.find((tag) =>
        ["五言绝句", "七言绝句", "五言律诗", "七言律诗"].includes(tag.name),
      );

      if (!has) {
        const contentArr = splitChineseSymbol(res.content, false);

        let connectTagId = -1;

        // 绝句
        if (contentArr?.length === 4) {
          if (contentArr.every((item) => item.length === 5)) {
            connectTagId = 109;
          }
          if (contentArr.every((item) => item.length === 7)) {
            connectTagId = 110;
          }
        }

        // 律诗
        if (contentArr?.length === 8) {
          if (contentArr.every((item) => item.length === 5)) {
            connectTagId = 105;
          }

          if (contentArr.every((item) => item.length === 7)) {
            connectTagId = 108;
          }
        }

        if (connectTagId !== -1) {
          void ctx.db.poem
            .update({
              where: { id },
              data: { tags: { connect: [{ id: connectTagId }] } },
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }

      return transformPoem(res, input.lang);
    }),

  findByIdSelected: publicProcedure
    .input(
      z.object({
        id: z.number(),
        selected: z.array(z.enum(["translation_en"])).default([]),
      }),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.poem.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          translation_en: input.selected.includes("translation_en"),
        },
      });
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

  updateLocale: publicProcedure
    .input(
      z.object({
        translation_en: z.string().optional(),
        id: z.number(),
        token: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      const json: Record<string, string> = {};

      if (input.translation_en) {
        json.translation_en = input.translation_en;
      }

      return ctx.db.poem.update({
        where: { id: input.id },
        data: json,
      });
    }),
});
