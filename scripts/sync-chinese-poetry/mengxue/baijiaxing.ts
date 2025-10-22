import { Dynasty } from "@/types";

import dataBaijiaxing from "../../../chinese-poetry-master/蒙学/baijiaxing.json";
import { createAuthor, createPoem } from "../utils";

export const syncBaijiaxing = async () => {
  const _author = {
    name: "佚名",
    dynasty: Dynasty.北宋,
  };

  const authorId = await createAuthor(_author.name, _author.dynasty);

  createPoem({
    title: dataBaijiaxing.title,
    paragraphs: dataBaijiaxing.paragraphs,
    authorId,
  }).then(() => {
    console.log("百家姓同步完成");
  });
};
