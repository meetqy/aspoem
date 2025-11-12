import { db } from "@/server/db";

export interface PoemData {
  // Frontmatter 字段
  id: string;
  title: string;
  titlePinyin: string;
  titleSlug: string;
  author: string;
  authorPinyin: string;
  authorSlug: string;
  dynasty: string;
  dynastyPinyin: string;
  dynastySlug: string;
  tags: string[];

  // 内容字段
  paragraphs: string[];
  paragraphsPinyin: string[];
  annotation?: string;
  translation?: string;
  appreciation?: string;
}

// 同步诗词数据到数据库
export async function syncPoemToDatabase(poemData: PoemData) {
  // 1. 创建或查找朝代
  let dynasty = await db.dynasty.findUnique({
    where: { slug: poemData.dynastySlug },
  });

  if (!dynasty) {
    dynasty = await db.dynasty.create({
      data: {
        name: poemData.dynasty,
        pinyin: poemData.dynastyPinyin,
        slug: poemData.dynastySlug,
      },
    });
  }

  // 2. 创建或查找作者
  let author = await db.author.findUnique({
    where: { slug: poemData.authorSlug },
  });

  if (!author) {
    author = await db.author.create({
      data: {
        name: poemData.author,
        pinyin: poemData.authorPinyin,
        slug: poemData.authorSlug,
        dynastyId: dynasty.id,
      },
    });
  }

  // 3. 处理标签
  const tagConnections = [];
  for (const tagName of poemData.tags) {
    if (!tagName) continue;

    let tag = await db.tag.findUnique({
      where: { slug: tagName.toLowerCase().replace(/\s+/g, "-") },
    });

    if (!tag) {
      tag = await db.tag.create({
        data: {
          name: tagName,
          slug: tagName.toLowerCase().replace(/\s+/g, "-"),
        },
      });
    }

    tagConnections.push({ id: tag.id });
  }

  // 4. 检查诗词是否已存在
  const existingPoem = await db.poem.findUnique({
    where: { slug: poemData.id },
  });

  const poemDBData = {
    title: poemData.title,
    slug: poemData.id,
    titlePinyin: poemData.titlePinyin,
    titleSlug: poemData.titleSlug,
    paragraphs: poemData.paragraphs,
    paragraphsPinyin: poemData.paragraphsPinyin,
    annotation: poemData.annotation || undefined,
    authorId: author.id,
    dynastyId: dynasty.id,
  };

  if (existingPoem) {
    // 更新现有诗词
    await db.poem.update({
      where: { id: existingPoem.id },
      data: {
        ...poemDBData,
        tags: {
          set: tagConnections,
        },
      },
    });
  } else {
    // 创建新诗词
    await db.poem.create({
      data: {
        ...poemDBData,
        tags: {
          connect: tagConnections,
        },
      },
    });
  }
}
