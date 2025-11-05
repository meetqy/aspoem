import data from "../../chinese-poetry-master/论语/lunyu.json";

import { createMdContent } from "./create-md";

export async function syncLunyu() {
  Promise.all(
    data.map((poem) =>
      createMdContent({
        title: poem.chapter,
        paragraphs: poem.paragraphs,
        author: "孔子及其弟子",
        dynasty: "春秋",
        parent: ["论语"],
        tags: ["蒙学"],
      }),
    ),
  ).then(() => {
    console.log("论语同步完成", "chinese-poetry-master/论语/lunyu.json");
  });
}
