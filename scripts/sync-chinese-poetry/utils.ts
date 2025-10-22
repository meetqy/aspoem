import { Converter } from "opencc-js";

import { db } from "@/server/db";

export const createAuthor = async (name: string, dynastyName: string) => {
  try {
    if (dynastyName != "近现代") {
      dynastyName = dynastyName.replace("代", "").replace("朝", "");
      dynastyName = await toCn(dynastyName);
    }

    name = await toCn(name);

    // 首先查找或创建朝代
    const dynasty = await db.dynasty.upsert({
      where: { name: dynastyName },
      update: { name: dynastyName },
      create: { name: dynastyName },
    });

    const author = await db.author.upsert({
      where: { name, dynastyId: dynasty.id },
      update: { name, dynastyId: dynasty.id },
      create: { name, dynastyId: dynasty.id },
    });

    return author.id;
  } catch (error) {
    console.log("\n ------------------------- 创建作者失败: ------------------------- \n");
    console.log(name, dynastyName);
    console.log("\n ------------------------- 创建作者失败: ------------------------- \n");
    throw error;
  }
};

export const createCategory = async (name: string, parentId?: string) => {
  name = await toCn(name);
  const category = await db.category.upsert({
    where: {
      name,
      parentId: parentId || null,
    },
    update: { name },
    create: {
      name,
      parentId: parentId || null,
    },
  });

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
