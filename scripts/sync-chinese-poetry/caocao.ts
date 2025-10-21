import { db } from "@/server/db";

import data from "../../chinese-poetry-master/曹操诗集/caocao.json";

const _author = {
  name: "曹操",
  dynasty: "东汉末年" as Dynasty,
};

export const syncCaoCaoPoems = async () => {
  // 创建 作者记录
  let author = await db.author.findFirst({
    where: _author,
  });

  if (!author) {
    author = await db.author.create({
      data: _author,
    });
  }

  Promise.all(
    data.map((poem) =>
      db.poem.create({
        data: {
          title: poem.title,
          paragraphs: poem.paragraphs,
          authorId: author.id,
        },
      }),
    ),
  ).then(() => {
    console.log("曹操诗集同步完成", "chinese-poetry-master/曹操诗集/caocao.json");
  });
};
