import { type Tag, type Poem } from "@prisma/client";
import { mapKeys, pick } from "lodash-es";
import { z } from "zod";
import { locales } from "~/dictionaries";

export const LangZod = z.enum(locales).default("zh-Hans");

function transform<T extends Record<string, unknown>>(
  res: T,
  keys: string[],
  lang: string,
) {
  lang = lang.replace("-", "_");

  const objs = pick(
    res,
    keys.map((item) => `${item}_${lang}`),
  );

  Object.keys(res).map((key) => {
    if (key.includes("zh_Hant") || key.includes("zh_Hans")) {
      delete res[key as keyof T];
    }
  });

  const obj = mapKeys(objs, (_, key) => key.replace(`_${lang}`, ""));

  const json: Record<string, unknown> = {};

  keys.forEach((key) => {
    json[key] = obj[key] || res[key];
  });

  return {
    ...res,
    ...json,
  };
}

/**
 * 处理多语言的返回值 Tag
 * @param res
 * @param lang
 * @returns
 */
export function transformTag<T extends Tag>(res: T, lang: string) {
  lang = lang.replace("-", "_");

  return transform(res, ["name", "introduce", "type"], lang);
}

/**
 * 处理多语言的返回值 Poem
 * @param res
 * @param lang
 * @returns
 */
export function transformPoem<T extends Poem>(res: T, lang: string) {
  lang = lang.replace("-", "_");

  return transform(
    res,
    ["title", "content", "introduce", "translation", "annotation"],
    lang,
  );
}
