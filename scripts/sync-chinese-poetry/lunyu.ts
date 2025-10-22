import { db } from "@/server/db";
import { Dynasty } from "@/types";

import data from "../../chinese-poetry-master/论语/lunyu.json";

import { createAuthor } from "./utils";

const _author = {
  name: "孔子及其弟子",
  dynasty: Dynasty.春秋,
};

export const syncLunyu = async () => {
  const authorId = await createAuthor(_author.name, _author.dynasty);

  Promise.all(
    data.map((poem) =>
      db.poem.create({
        data: {
          title: poem.chapter,
          paragraphs: poem.paragraphs.join("\n"),
          authorId,
        },
      }),
    ),
  ).then(() => {
    console.log("论语同步完成", "chinese-poetry-master/论语/lunyu.json");
  });
};
