import { db } from "@/server/db";

import data from "../../chinese-poetry-master/楚辞/chuci.json";

const _author = {
  name: "屈原",
  dynasty: "战国时期" as Dynasty,
};

export const syncChuCiPoems = async () => {
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
          paragraphs: poem.content,
          section: poem.section,
          authorId: author.id,
        },
      }),
    ),
  ).then(() => {
    console.log("楚辞同步完成", "chinese-poetry-master/楚辞/chuci.json");
  });
};
