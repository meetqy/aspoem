import { globby } from "globby";
import path = require("path");
import { readJsonSync } from "fs-extra";
import { pinyin } from "pinyin-pro";
import { strapi } from "../strapi";
import slugify from "slugify";
import * as OpenCC from "opencc-js";

// 匹配中文字符
const chinese = /^([\u4e00-\u9fa5])+$/;

const ignore = /□|𮪃|𣆟|□|𧍧|𥷑|𤱶|𠁼||𮭗|𥳌|𦱊|𥱧|𥉍|𡼭|𣂏/;

const contentIgnore = /（/;
const titleIgnore = /。/;

const converterToHant = OpenCC.Converter({ from: "cn", to: "hk" });
const converterToHans = OpenCC.Converter({ from: "hk", to: "cn" });

// 中文符号连在一起的
const chineseSymbol = /(（|）|，|。|；){1}\n?(（|）|，|。|；){1}/;

export async function create(
  path,
  dynasty,
  titleKey = "title",
  contentKey = "paragraphs"
) {
  const files = await globby(path);

  try {
    for (const f of files) {
      const json = readJsonSync(f);

      try {
        for (const item of json) {
          const paragraphs = item[contentKey].join("\n");
          if (chineseSymbol.test(paragraphs)) {
            continue;
          }

          if (
            item.author &&
            item[titleKey] &&
            paragraphs &&
            chinese.test(item.author) &&
            !titleIgnore.test(item[titleKey]) &&
            !ignore.test(item[titleKey]) &&
            !ignore.test(item.author) &&
            !ignore.test(paragraphs) &&
            !contentIgnore.test(paragraphs)
          ) {
            const slug = pinyin(`${item.author}${item[titleKey]}`, {
              toneType: "none",
            }).replace(/○/, "ling");

            const res = await strapi.POST("/poems", {
              // @ts-ignore
              body: {
                data: {
                  slug: slugify(slug),
                  title: converterToHans(item[titleKey]).replace(
                    /《|》|[|]/g,
                    ""
                  ),
                  title_hant: converterToHant(item[titleKey]).replace(
                    /《|》|[|]/g,
                    ""
                  ),
                  title_py: pinyin(item[titleKey]).replace(/○/g, "líng"),
                  content: converterToHans(paragraphs),
                  content_hant: converterToHant(paragraphs),
                  content_py: pinyin(paragraphs),
                  author: converterToHans(item.author),
                  author_hant: converterToHant(item.author),
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
