import { db } from "@/server/db";
import { Dynasty } from "@/types";

import dataBaijiaxing from "../../../chinese-poetry-master/蒙学/baijiaxing.json";
import { createAuthor, createCategory } from "../utils";

export const syncBaijiaxing = async () => {
  const categoryId = await createCategory("蒙学");

  const _author = {
    name: "佚名",
    dynasty: Dynasty.北宋,
  };

  const authorId = await createAuthor(_author.name, _author.dynasty);

  db.poem
    .create({
      data: {
        title: dataBaijiaxing.title,
        paragraphs: dataBaijiaxing.paragraphs.join("\n"),
        authorId,
        categoryId,
      },
    })
    .then((res) => {
      console.log("百家姓同步完成", res.id);
    });
};
