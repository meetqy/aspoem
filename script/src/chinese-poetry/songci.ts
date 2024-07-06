import { globby } from "globby";
import path = require("path");
import { readJsonSync } from "fs-extra";
import { pinyin } from "pinyin-pro";
import { strapi } from "../strapi";
import slugify from "slugify";
import { OpenCC } from "opencc";

const converterToHant = new OpenCC("s2t.json");

// 匹配中文字符
const chinese = /^([\u4e00-\u9fa5])+$/;
const ignore = /□|𮪃|𣆟|□|𧍧|𥷑|𤱶|𠁼||𮭗|𥳌|𦱊|𥱧|𥉍|𡼭|𣂏/;
const contentIgnore = /（/;
const titleIgnore = /。/;
// 中文符号连在一起的
const chineseSymbol = /(（|）|，|。|；){1}\n?(（|）|，|。|；){1}/;

export async function createSongCi(dynasty) {
  const files = await globby([
    path.join(__dirname, `./data/宋词/ci.song.*.json`),
    path.join(__dirname, `./data/宋词/宋词三百首.json`),
  ]);

  try {
    for (const f of files) {
      const json = readJsonSync(f);

      try {
        for (const item of json) {
          const paragraphs = item.paragraphs.join("\n");
          if (chineseSymbol.test(paragraphs)) {
            continue;
          }

          if (
            item.author &&
            item.rhythmic &&
            paragraphs &&
            chinese.test(item.author) &&
            !titleIgnore.test(item.rhythmic) &&
            !ignore.test(item.rhythmic) &&
            !ignore.test(item.author) &&
            !ignore.test(paragraphs) &&
            !contentIgnore.test(paragraphs)
          ) {
            const slug = pinyin(`${item.author}${item.rhythmic}`, {
              toneType: "none",
            }).replace(/○/, "ling");

            const res = await strapi.POST("/poems", {
              // @ts-ignore
              body: {
                data: {
                  slug: slugify(slug),
                  title: converterToHant.convertSync(item.rhythmic),
                  title_py: pinyin(item.rhythmic).replace(/○/g, "líng"),
                  content: converterToHant.convertSync(paragraphs),
                  content_py: pinyin(paragraphs),
                  author: item.author,
                  author_py: pinyin(item.author),
                  dynasty,
                },
              },
            });

            console.log(res.data.data?.id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
