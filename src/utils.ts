import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMobile() {
  return "ontouchstart" in document.documentElement;
}

export const MyHost = `https://aspoem.com`;
