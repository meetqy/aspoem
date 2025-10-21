import { db } from "@/server/db";
import { Dynasty } from "@/types";

import dataBaijiaxing from "../../chinese-poetry-master/蒙学/baijiaxing.json";
import dataDizigui from "../../chinese-poetry-master/蒙学/dizigui.json";

export const syncBaijiaxing = async () => {
  const _author = {
    name: "佚名",
    dynasty: Dynasty.北宋,
  };

  // 创建 作者记录
  let author = await db.author.findFirst({
    where: _author,
  });

  if (!author) {
    author = await db.author.create({
      data: _author,
    });
  }

  db.poem
    .create({
      data: {
        title: dataBaijiaxing.title,
        paragraphs: dataBaijiaxing.paragraphs.join("\n"),
        authorId: author.id,
      },
    })
    .then((res) => {
      console.log("百家姓同步完成", res.id);
    });
};

export const syncDizigui = async () => {
  const _author = {
    name: "李毓秀",
    dynasty: Dynasty.清,
  };

  // 创建 作者记录
  let author = await db.author.findFirst({
    where: _author,
  });

  if (!author) {
    author = await db.author.create({
      data: _author,
    });
  }

  let paragraphs = "";

  dataDizigui.content.forEach((item) => {
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
        authorId: author.id,
      },
    })
    .then((res) => {
      console.log("弟子规同步完成", res.id);
    });
};
