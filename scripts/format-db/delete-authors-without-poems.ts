// npx tsx scripts/db-format/delete-authors-without-poems.ts

// 删除没有诗词的作者
import { db } from "@/server/db";

export async function deleteAuthorsWithoutPoems() {
  console.log("开始查找没有诗词的作者...");

  // 查询所有作者及其诗词数量
  const authors = await db.author.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          poems: true,
        },
      },
    },
  });

  // 筛选出没有诗词的作者
  const authorsWithoutPoems = authors.filter(
    (author) => author._count.poems === 0,
  );

  console.log(`找到 ${authorsWithoutPoems.length} 个没有诗词的作者`);

  if (authorsWithoutPoems.length === 0) {
    console.log("没有需要删除的作者");
    return;
  }

  // 显示将要删除的作者
  console.log("\n将要删除的作者：");
  authorsWithoutPoems.forEach((author, index) => {
    console.log(`${index + 1}. ${author.name} (ID: ${author.id})`);
  });

  // 删除这些作者
  const result = await db.author.deleteMany({
    where: {
      id: {
        in: authorsWithoutPoems.map((a) => a.id),
      },
    },
  });

  console.log(`\n成功删除 ${result.count} 个作者`);
}
