import "server-only";

export const locales = ["zh-Hans", "zh-Hant"] as const;

export const defaultLocale = "zh-Hans";

const dictionaries = {
  "zh-Hant": () => import("./zh-Hant.json").then((module) => module.default),
  "zh-Hans": () => import("./zh-Hans.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export const getLangText = (obj: { [key in Locale]: string }, lang: Locale) =>
  obj[lang];

export const getMetaDataAlternates = (suffix: string, lang: Locale) => {
  return {
    languages: {
      "zh-Hans": `/zh-Hans${suffix}`,
      "zh-Hant": `/zh-Hant${suffix}`,
    },
    canonical: `/${lang}${suffix}`,
  };
};
