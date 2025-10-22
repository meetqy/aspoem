import { Dynasty } from "@/types";

import data from "../../chinese-poetry-master/曹操诗集/caocao.json";

import { createAuthor, createPoem } from "./utils";

const _author = {
  name: "曹操",
  dynasty: Dynasty.东汉末年,
};

export const syncCaocao = async () => {
  const authorId = await createAuthor(_author.name, _author.dynasty);

  Promise.all(
    data.map(async (poem) =>
      createPoem({
        title: poem.title,
        paragraphs: poem.paragraphs,
        authorId,
      }),
    ),
  ).then(() => {
    console.log("曹操诗集同步完成", "chinese-poetry-master/曹操诗集/caocao.json");
  });
};
