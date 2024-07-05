import { strapi } from "./strapi";

const chineseDynasties = [
  "夏",
  "商",
  "周",
  "秦",
  "汉",
  "三国",
  "晋",
  "南北",
  "隋",
  "唐",
  "五代十国",
  "宋",
  "元",
  "明",
  "清",
];

export const genDynasties = async () => {
  const res = await Promise.all(
    chineseDynasties.map((dynasty) => {
      // @ts-ignore
      return strapi.POST("/dynasties", {
        body: {
          data: {
            name: dynasty,
          },
        },
      });
    })
  );

  console.log("init dynasties", JSON.stringify(res));
};
