import { db } from "@/server/db";

export const createAuthor = async (name: string, dynastyName: string) => {
  // 首先查找或创建朝代
  let dynasty = await db.dynasty.findUnique({
    where: { name: dynastyName },
  });

  if (!dynasty) {
    dynasty = await db.dynasty.create({
      data: { name: dynastyName },
    });
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
