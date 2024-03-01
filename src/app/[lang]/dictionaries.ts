import "server-only";

const dictionaries = {
  "zh-Hant": () =>
    import("../dictionaries/zh-Hant.json").then((module) => module.default),
  "zh-Hans": () =>
    import("../dictionaries/zh-Hans.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
