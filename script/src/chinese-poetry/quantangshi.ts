import { globby } from "globby";
import path = require("path");
import { readJsonSync } from "fs-extra";
import { pinyin } from "pinyin-pro";
import { strapi } from "../strapi";

// 匹配中文字符
const chinese = /^([\u4e00-\u9fa5])+$/;

export async function createTangAuthor() {
  const files = await globby(path.join(__dirname, "./全唐诗/poet.tang.*.json"));
  // 获取 files 数组中的所有的 author 去重, 并且忽略掉字符中包含特殊字符的作者
  const authors = [];
  files.forEach((f) => {
    const json = readJsonSync(f);
    json.forEach((item: any) => {
      if (
        item.author &&
        chinese.test(item.author) &&
        !authors.includes(item.author)
      ) {
        authors.push(item.author);
      }
    });
  });

  for (let i = 0; i < authors.length; i++) {
    try {
      // @ts-ignore
      const res = await strapi.POST("/authors", {
        body: {
          data: {
            name: authors[i],
            name_py: pinyin(authors[i]),
            dynasty: "唐",
          },
        },
      });

      console.log(res.data.data.id);
    } catch (e) {
      console.log(e);
    }
  }
}
