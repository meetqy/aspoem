// tsx scripts/format-db/sync-poem-dynasty-with-author.ts

import { db } from "@/server/db";

export async function syncPoemDynastyWithAuthor() {
  console.log("开始查找朝代不一致的诗词...");

  // 查询所有诗词及其作者信息
  const poems = await db.poem.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      dynastyId: true,
      author: {
        select: {
          id: true,
          name: true,
          dynastyId: true,
          dynasty: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      dynasty: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // 筛选出朝代不一致的诗词
  const inconsistentPoems = poems.filter(
    (poem) => poem.dynastyId !== poem.author.dynastyId,
  );

  console.log(`找到 ${inconsistentPoems.length} 首朝代不一致的诗词`);

  if (inconsistentPoems.length === 0) {
    console.log("没有需要修复的诗词");
    return;
  }

  // 显示不一致的数据
  console.log("\n朝代不一致的诗词：");
  inconsistentPoems.forEach((poem, index) => {
    console.log(
      `${index + 1}. ${poem.title} (${poem.slug})`,
      `\n   诗词朝代: ${poem.dynasty?.name || "无"}`,
      `\n   作者朝代: ${poem.author.dynasty.name} (作者: ${poem.author.name})`,
    );
  });

  console.log("\n开始修复...");

  // 批量更新诗词朝代
  let successCount = 0;
  let failCount = 0;

  for (const poem of inconsistentPoems) {
    try {
      await db.poem.update({
        where: { id: poem.id },
        data: {
          dynastyId: poem.author.dynastyId,
        },
      });
      successCount++;
      console.log(`✓ 已修复: ${poem.title}`);
    } catch (error) {
      failCount++;
      console.error(`✗ 修复失败: ${poem.title}`, error);
    }
  }

  console.log("\n修复完成！");
  console.log(`成功: ${successCount} 首`);
  console.log(`失败: ${failCount} 首`);
}
