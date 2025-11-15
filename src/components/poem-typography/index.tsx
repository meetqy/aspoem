"use client";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import type { ApiPoemFindDetail } from "@/server/api/router/poem";
import { poemTypographyAtom } from "@/stores/poem-typography";
import { PoemTypographyAuthor } from "./author";
import { PoemTypographyContent } from "./content";
import { PoemTypographyTitle } from "./title";

type PoemTypographyProps = {
  poem: ApiPoemFindDetail;
  classNames?: {
    content?: string;
  };
};

export const PoemTypography = ({ poem, classNames }: PoemTypographyProps) => {
  const { pinyinVisible, font, annotationVisible } =
    useAtomValue(poemTypographyAtom);

  return (
    <main
      className={cn(
        "@container/poem mx-auto max-w-screen-md rounded-md p-4 w-full py-16",
        font === "sans" ? "font-sans" : "font-cursive",
      )}
      style={{
        fontSize: 20,
      }}
    >
      <PoemTypographyTitle
        text={poem.title}
        pinyin={poem.titlePinyin}
        font={font as "cursive" | "sans"}
        pinyinVisible={pinyinVisible}
      />

      <div className={cn(pinyinVisible ? "mt-[1em]" : "mt-[0.5em]")}>
        <PoemTypographyAuthor
          dynasty={poem.dynasty?.name}
          dynastyPinyin={poem.dynasty?.pinyin}
          author={poem.author.name}
          authorPinyin={poem.author.pinyin}
          font={font as "cursive" | "sans"}
          pinyinVisible={pinyinVisible}
        />
      </div>

      <div
        className={cn(
          "transition-all",
          pinyinVisible ? "mt-[2em]" : "mt-[1em]",
        )}
      >
        <PoemTypographyContent
          className={cn(classNames?.content)}
          paragraphs={poem.paragraphs}
          paragraphsPinyin={poem.paragraphsPinyin}
          annotation={poem.annotation as Record<string, string>}
          font={font as "cursive" | "sans"}
          pinyinVisible={pinyinVisible}
          annotationVisible={annotationVisible}
        />
      </div>
    </main>
  );
};
