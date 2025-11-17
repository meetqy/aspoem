// 读取 poems.paragraphs 判断是否是 isOrderliness
// 执行 tsx scripts/update-db-is-orderliness.ts [作者目录]

import { isOrderliness } from "@/lib/utils";
import { db } from "@/server/db";

async function updateDbIsOrderliness() {
  const poems = await db.poem.findMany();

  const orderlinessPoems = poems.filter((poem) =>
    isOrderliness(poem.paragraphs),
  );

  console.log(`Found ${orderlinessPoems.length} orderliness poems`);

  // 分批处理，每次处理 1000 条
  const BATCH_SIZE = 1000;
  const totalBatches = Math.ceil(orderlinessPoems.length / BATCH_SIZE);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, orderlinessPoems.length);
    const batch = orderlinessPoems.slice(start, end);

    await db.poem.updateMany({
      where: {
        id: { in: batch.map((p) => p.id) },
      },
      data: {
        isOrderliness: true,
      },
    });

    console.log(
      `Processed batch ${i + 1}/${totalBatches} (${end}/${orderlinessPoems.length})`,
    );
  }

  console.log("Done!");
}

updateDbIsOrderliness().catch((e) => {
  console.error(e);
});
