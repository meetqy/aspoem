import { atom } from "jotai";

export interface PoemTypographyStore {
  pinyinVisible: boolean;
  font: "cursive" | "sans";
  annotationVisible: boolean;
}

export const poemTypographyAtom = atom<PoemTypographyStore>({
  pinyinVisible: false,
  font: "cursive",
  annotationVisible: true,
});
