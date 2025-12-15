import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cn_symbol, en_symbol } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化拼音，符号替换为空格
export function formatPinyin(pinyin: string): string {
  const allSymbols = cn_symbol + en_symbol;
  let processedPinyin = pinyin;

  // 在符号两边增加空格，然后替换为空格
  for (const symbol of allSymbols) {
    processedPinyin = processedPinyin.replaceAll(symbol, ` ${symbol} `);
  }

  // 再将符号替换为空格
  for (const symbol of allSymbols) {
    processedPinyin = processedPinyin.replaceAll(symbol, " ");
  }

  // 分割并过滤空字符串
  return processedPinyin.replace(/\s{2,}/g, "  ").replace(/\s+/, " ");
}

// 判断诗歌内容是否 每一句长度相同
export function isOrderliness(lines: string[]) {
  if (lines.length === 0) return false;
  const firstCount = lines[0]!.length;

  return lines.every((line) => line.length === firstCount);
}
