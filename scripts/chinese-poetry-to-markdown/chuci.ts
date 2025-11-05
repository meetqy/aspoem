import data from "../../chinese-poetry-master/楚辞/chuci.json";

import { createMdContent } from "./create-md";

const _authors = [
  { name: "屈原", dynasty: "楚" },
  { name: "宋玉", dynasty: "楚" },
  { name: "景差", dynasty: "楚" },
  { name: "贾谊", dynasty: "西汉" },
  { name: "淮南小山", dynasty: "西汉" },
  { name: "东方朔", dynasty: "西汉" },
  { name: "庄忌", dynasty: "西汉" },
  { name: "王褒", dynasty: "西汉" },
  { name: "刘向", dynasty: "西汉" },
  { name: "王逸", dynasty: "东汉" },
];

export async function syncChuci() {
  Promise.all(
    data.map(async (poem) => {
      // 根据作者字段匹配对应的朝代，默认为楚
      const authorInfo = _authors.find(
        (author) => author.name === poem.author,
      ) || { name: poem.author, dynasty: "楚" };

      return createMdContent({
        title: poem.title,
        paragraphs: poem.content,
        author: authorInfo.name,
        dynasty: authorInfo.dynasty,
      });
    }),
  ).then(() => {
    console.log("楚辞同步完成", "chinese-poetry-master/楚辞/chuci.json");
  });
}
