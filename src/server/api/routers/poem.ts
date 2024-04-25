import { type Author, type Poem } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { LangZod, transformPoem, transformTag } from "../utils";
import { splitChineseSymbol } from "~/utils";

let token: {
  access_token: string;
  expires_in: number;
  time: number;
};

const getToken = async () => {
  if (!token || token.time + token.expires_in * 1000 < Date.now()) {
    const res = await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${process.env.BAIDU_YIYAN_API_KEY}&client_secret=${process.env.BAIDU_YIYAN_SECRET_KEY}`,
      { method: "POST" },
    );

    const data = (await res.json()) as {
      access_token: string;
      expires_in: number;
    };

    token = {
      ...data,
      time: Date.now(),
    };
  }

  return token;
};

const getTranslation = async (content: string) => {
  const _token = await getToken();

  const res = await fetch(
    `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-3.5-8k-preview?access_token=${_token.access_token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content:
              "你只需要将我发送的诗词内容进行白话文翻译，不需要赏析，不需要任何多余内容，只需要白话文翻译。不需要加上描述性文字“希望能符合我的要求”类似的结束语。不需要“以下是 xxx “的开始语， 确认请回复“确认”",
          },
          {
            role: "assistant",
            content:
              "确认。请提供您需要翻译的诗词内容，我会直接将其翻译成白话文。",
          },
          {
            role: "user",
            content: content,
          },
        ],
      }),
    },
  );

  const json = (await res.json()) as { result: string };

  return json.result;
};

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
      await ctx.db.card.deleteMany({ where: { poemId: input.id } });
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
        data = await ctx.db.poem.findMany({
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: true,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
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
   * 文心一言生成诗词译文
   */
  genTranslation: publicProcedure
    .input(
      z.object({
        token: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.token !== process.env.TOKEN) throw new Error("Invalid token");

      const translation = await getTranslation(input.content);
      return translation;
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
          cards: true,
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

  checkedExist: publicProcedure
    .input(
      z.object({
        title: z.string(),
        authorName: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.poem.findFirst({
        where: {
          title: input.title.toLocaleLowerCase(),
          author: {
            name: input.authorName,
          },
        },
      });

      return res ? true : false;
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
