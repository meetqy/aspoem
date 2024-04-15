import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMobile() {
  return "ontouchstart" in document.documentElement;
}

export const MyHost = `https://aspoem.com`;

/** 可用其他颜色 */
export const colors = [
  "text-blue-500",
  "text-yellow-500",
  "text-purple-500",
  "text-green-500",
  "text-pink-500",
  "text-indigo-500",
  "text-teal-500",
  "text-cyan-500",
  "text-lime-500",
  "text-orange-500",
];

/**
 * 通过中文字符将字符串分割
 * @param str
 * @param separator 是否保留分隔符
 * @returns
 */
export const splitChineseSymbol = (str: string, separator = true) => {
  if (separator) {
    return str
      .replaceAll("\n", "")
      .match(/[^。|！|？|，|；]+[。|！|？|，|；]+/g);
  }

  return str
    .replaceAll("\n", "")
    .split(/。|！|？|，|；/)
    .filter((s) => !!s);
};

export const stringFormat = (str: string, arr: string[]) => {
  return str.replace(/{(\d+)}/g, (match = "", number: number) => {
    return arr[number] || match;
  });
};
