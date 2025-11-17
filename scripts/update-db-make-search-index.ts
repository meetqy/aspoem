// tsx scripts/update-db-make-search-index.ts

import { convert } from "pinyin-pro";
import { db } from "@/server/db";

async function main() {
  console.log("开始更新搜索索引...");

  // 1. 查询 searchText 不存在的数据
  const poems = await db.poem.findMany({
    where: {
      // OR: [{ searchText: null }, { searchText: "" }],
    },
    select: {
      id: true,
      title: true,
      titlePinyin: true,
      paragraphs: true,
      paragraphsPinyin: true,
      author: {
        select: {
          name: true,
          pinyin: true,
          dynasty: {
            select: {
              name: true,
              pinyin: true,
            },
          },
        },
      },
    },
  });

  console.log(`找到 ${poems.length} 条需要更新的数据`);

  // 分批处理，避免一次性更新太多
  const BATCH_SIZE = 100;
  const totalBatches = Math.ceil(poems.length / BATCH_SIZE);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, poems.length);
    const batch = poems.slice(start, end);

    // 批量更新
    await Promise.all(
      batch.map(async (poem) => {
        // 处理标题拼音
        const titlePinyinWithoutTone = convert(poem.titlePinyin, {
          format: "toneNone",
        });

        // 处理正文
        const paragraphsText = poem.paragraphs.join("");
        const paragraphsPinyinWithoutTone = convert(poem.paragraphsPinyin, {
          format: "toneNone",
        });

        // 处理作者拼音
        const authorPinyinWithoutTone = convert(poem.author.pinyin, {
          format: "toneNone",
        });

        // 处理朝代拼音
        const dynastyPinyinWithoutTone = convert(poem.author.dynasty?.pinyin, {
          format: "toneNone",
        });

        // 组合成搜索文本
        const searchText = [
          poem.author.name, // 作者名
          authorPinyinWithoutTone, // 作者拼音（无声调）
          poem.author.dynasty?.name || "", // 朝代名
          dynastyPinyinWithoutTone, // 朝代拼音（无声调）
          poem.title, // 标题
          titlePinyinWithoutTone, // 标题拼音（无声调）
          paragraphsText, // 正文
          paragraphsPinyinWithoutTone, // 正文拼音（无声调）
        ]
          .filter(Boolean) // 过滤空值
          .join(" ");

        // 3. 更新数据库
        await db.poem.update({
          where: { id: poem.id },
          data: { searchText },
        });
      }),
    );

    console.log(
      `已处理 ${end}/${poems.length} (${((end / poems.length) * 100).toFixed(1)}%)`,
    );
  }

  console.log("搜索索引更新完成！");
}

main()
  .catch((e) => {
    console.error("更新失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
