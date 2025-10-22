import { db } from "@/server/db";
import { Dynasty } from "@/types";

import dataGuwenguanzhi from "../../../chinese-poetry-master/蒙学/guwenguanzhi.json";
import { createAuthor, createCategory } from "../utils";

export const syncGuwenguanzhi = async () => {
  const categoryId = await createCategory("蒙学");
  const _author = {
    name: "李毓秀",
    dynasty: Dynasty.清,
  };

  const authorId = await createAuthor(_author.name, _author.dynasty);

  let paragraphs = "";

  dataGuwenguanzhi.content.forEach((item) => {
    paragraphs += item.chapter + "\n";
    item.paragraphs.forEach((para) => {
      paragraphs += para + "\n";
    });
    paragraphs += "\n";
  });

  db.poem
    .create({
      data: {
        title: dataDizigui.title,
        paragraphs,
        authorId,
        categoryId,
      },
    })
    .then((res) => {
      console.log("弟子规同步完成", res.id);
    });
};
