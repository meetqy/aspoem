import { Converter } from "opencc-js";

import { db } from "@/server/db";

export const createAuthor = async (name: string, dynastyName: string) => {
  if (dynastyName != "近现代") {
    dynastyName = dynastyName.replace("代", "").replace("朝", "");
    dynastyName = await toCn(dynastyName);
  }

  name = await toCn(name);

  // 首先查找或创建朝代
  let dynasty = await db.dynasty.findUnique({
    where: { name: dynastyName },
  });

  if (!dynasty) {
    try {
      dynasty = await db.dynasty.upsert({
        where: { name: dynastyName },
        update: {},
        create: { name: dynastyName },
      });
    } catch (error) {
      // 处理并发创建朝代时可能出现的冲突
      dynasty = await db.dynasty.findUnique({
        where: { name: dynastyName },
      });

      if (!dynasty) {
        console.error("创建朝代失败:", error, dynastyName);
        throw error;
      }
    }
  }

  // 查找是否已存在该作者
  let author = await db.author.findFirst({
    where: {
      name,
      dynastyId: dynasty.id,
    },
  });

  // 如果不存在则创建新作者
  if (!author) {
    author = await db.author.create({
      data: {
        name,
        dynastyId: dynasty.id,
      },
    });
  }

  return author.id;
};

export const createCategory = async (name: string, parentId?: string) => {
  // 查找是否已存在该分类
  let category = await db.category.findFirst({
    where: {
      name,
      parentId: parentId || null,
    },
  });

  // 如果不存在则创建新分类
  if (!category) {
    category = await db.category.create({
      data: {
        name,
        parentId: parentId || null,
      },
    });
  }

  return category.id;
};

export const toCn = async (str: string[] | string) => {
  const converter = await Converter({ from: "tw", to: "cn" });

  const lines = Array.isArray(str) ? str : [str];
  const converted = lines.map((line) => converter(line));

  return converted.join("\n");
};

export const createPoem = async ({
  title,
  paragraphs,
  authorId,
  categoryId,
  source,
  section,
}: {
  title: string;
  paragraphs: string[] | string;
  authorId: string;
  categoryId?: string;
  source?: string;
  section?: string;
}) => {
  title = await toCn(title);
  const _paragraphs = await toCn(paragraphs);
  source = source ? await toCn(source) : undefined;
  section = section ? await toCn(section) : undefined;

  const poem = await db.poem.create({
    data: {
      title,
      paragraphs: _paragraphs,
      authorId,
      categoryId,
      source,
      section,
    },
  });

  return poem.id;
};
