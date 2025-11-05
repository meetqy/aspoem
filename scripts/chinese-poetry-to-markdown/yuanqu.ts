import data from "../../chinese-poetry-master/元曲/yuanqu.json";

import { createMdContent } from "./create-md";

export async function syncYuanQu() {
  await Promise.all(
    data.map(async (poem) =>
      createMdContent({
        title: poem.title,
        paragraphs: poem.paragraphs,
        author: poem.author,
        dynasty: "元",
      }),
    ),
  );

  console.log(`元曲同步完成: ${data.length} 个章节已导入`);
}
