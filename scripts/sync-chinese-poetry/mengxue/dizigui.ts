import { Dynasty } from "@/types";

import dataDizigui from "../../../chinese-poetry-master/蒙学/dizigui.json";
import { createAuthor, createCategory, createPoem, formatParagraphs } from "../utils";

export const syncDizigui = async () => {
  const categoryId = await createCategory("蒙学");
  const _author = {
    name: "李毓秀",
    dynasty: Dynasty.清,
  };

  const authorId = await createAuthor(_author.name, _author.dynasty);

  let paragraphs = "";

  dataDizigui.content.forEach((item) => {
    paragraphs += item.chapter + "\n";
    item.paragraphs.forEach((para) => {
      paragraphs += para + "\n";
    });
    paragraphs += "\n";
  });

  createPoem({
    title: dataDizigui.title,
    paragraphs,
    authorId,
    categoryId,
  }).then(() => {
    console.log("弟子规同步完成");
  });
};
