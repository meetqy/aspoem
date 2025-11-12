import { atom } from "jotai";

export interface PoemTypographyStore {
  pinyinVisible: boolean;
  font: "cursive" | "sans";
}

export const poemTypographyAtom = atom<PoemTypographyStore>({
  pinyinVisible: true,
  font: "cursive",
});
