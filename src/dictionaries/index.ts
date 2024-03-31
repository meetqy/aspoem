import "server-only";

export const defaultLocale = "zh-Hans";
export const locales = ["zh-Hans", "zh-Hant", "en"] as const;
const dictionaries = {
  "zh-Hant": () => import("./zh-Hant.json").then((module) => module.default),
  "zh-Hans": () => import("./zh-Hans.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
};

export type Locale = (typeof locales)[number];

/**
 * 生成多语言 meta hreflang 标签
 */
export const getMetaDataAlternates = (suffix: string, lang: Locale) => {
  return {
    languages: {
      "zh-Hans": `/zh-Hans${suffix}`,
      "zh-Hant": `/zh-Hant${suffix}`,
      en: `/en${suffix}`,
    },
    canonical: `/${lang}${suffix}`,
  };
};

export const getDictionary = async (locale: Locale = "zh-Hans") => {
  const zhHans = await dictionaries["zh-Hans"]();
  const result = await dictionaries[locale]();

  return {
    ...zhHans,
    ...result,
  };
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export const getLangText = (obj: { [key in Locale]: string }, lang: Locale) =>
  obj[lang];

export const getLangUrl = (url: string, lang: Locale) => `/${lang}${url}`;
