import { Dynasty } from "@/types";

import data from "../../chinese-poetry-master/曹操诗集/caocao.json";

import { createMdContent } from "./create-md";

const _author = {
  name: "曹操",
  dynasty: Dynasty.东汉末年,
};

export async function syncCaocao() {
  Promise.all(
    data.map(async (poem) =>
      createMdContent({
        title: poem.title,
        paragraphs: poem.paragraphs,
        author: _author.name,
        dynasty: _author.dynasty,
      }),
    ),
  ).then(() => {
    console.log(
      "曹操诗集同步完成",
      "chinese-poetry-master/曹操诗集/caocao.json",
    );
  });
}
