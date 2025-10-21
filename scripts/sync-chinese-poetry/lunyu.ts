import { db } from "@/server/db";
import { Dynasty } from "@/types";

import data from "../../chinese-poetry-master/论语/lunyu.json";

const _author = {
  name: "孔子",
  dynasty: Dynasty.春秋,
};

export const syncLunyuPoems = async () => {
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
          title: poem.chapter,
          paragraphs: poem.paragraphs.join("\n"),
          authorId: author.id,
        },
      }),
    ),
  ).then(() => {
    console.log("论语同步完成", "chinese-poetry-master/论语/lunyu.json");
  });
};
