import { defaultsDeep } from "lodash-es";
import "server-only";

export const defaultLocale = "zh-Hans";
export const locales = ["zh-Hans", "zh-Hant", "en", "ja", "ko"] as const;
const dictionaries = {
  "zh-Hant": () => import("./zh-Hant.json").then((module) => module.default),
  "zh-Hans": () => import("./zh-Hans.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
  ja: () => import("./ja.json").then((module) => module.default),
  ko: () => import("./ko.json").then((module) => module.default),
};

export type Locale = (typeof locales)[number];

/**
 * 生成多语言 meta hreflang 标签
 */
export const getMetaDataAlternates = (suffix: string, lang: Locale) => {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[locale] = `/${locale}${suffix}`;
  }

  return {
    languages,
    canonical: `/${lang}${suffix}`,
  };
};

export const getDictionary = async (locale: Locale = "zh-Hans") => {
  const zhHans = await dictionaries["zh-Hans"]();
  const result = await dictionaries[locale]();

  return defaultsDeep(result, zhHans) as typeof zhHans;
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export const getLangText = (obj: Record<string, string>, lang: Locale) =>
  obj[lang] || obj[defaultLocale] || "";

export const getLangUrl = (url: string, lang: Locale) => `/${lang}${url}`;
