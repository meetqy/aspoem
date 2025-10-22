import { db } from "@/server/db";
import { Dynasty } from "@/types";

import data from "../../chinese-poetry-master/曹操诗集/caocao.json";

import { createAuthor } from "./utils";

const _author = {
  name: "曹操",
  dynasty: Dynasty.东汉末年,
};

export const syncCaocao = async () => {
  const authorId = await createAuthor(_author.name, _author.dynasty);

  Promise.all(
    data.map((poem) =>
      db.poem.create({
        data: {
          title: poem.title,
          paragraphs: poem.paragraphs.join("\n"),
          authorId: authorId,
        },
      }),
    ),
  ).then(() => {
    console.log("曹操诗集同步完成", "chinese-poetry-master/曹操诗集/caocao.json");
  });
};
