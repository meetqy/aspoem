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
