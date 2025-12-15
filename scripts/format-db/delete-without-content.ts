import { db } from "@/server/db";

export async function deleteDynastiesWithoutContent() {
  console.log("开始查找没有内容的朝代...");

  // 查询所有朝代及其诗词和作者数量
  const dynasties = await db.dynasty.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          poems: true,
          authors: true,
        },
      },
    },
  });

  // 筛选出没有诗词和作者的朝代
  const emptyDynasties = dynasties.filter(
    (dynasty) => dynasty._count.poems === 0 && dynasty._count.authors === 0,
  );

  console.log(`找到 ${emptyDynasties.length} 个没有内容的朝代`);

  if (emptyDynasties.length === 0) {
    console.log("没有需要删除的朝代");
    return;
  }

  // 显示将要删除的朝代
  console.log("\n将要删除的朝代：");
  emptyDynasties.forEach((dynasty, index) => {
    console.log(`${index + 1}. ${dynasty.name} (ID: ${dynasty.id})`);
  });

  // 删除这些朝代
  const result = await db.dynasty.deleteMany({
    where: {
      id: {
        in: emptyDynasties.map((d) => d.id),
      },
    },
  });

  console.log(`\n成功删除 ${result.count} 个朝代`);
}
