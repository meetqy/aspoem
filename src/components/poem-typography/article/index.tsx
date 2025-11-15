"use client";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import type { ApiPoemFindDetail } from "@/server/api/router/poem";
import { poemTypographyAtom } from "@/stores/poem-typography";
import { PoemTypographyAuthor } from "../orderliness/author";
import { PoemTypographyTitle } from "../orderliness/title";
import { PoemTypographyContent } from "./content";

export const PoemTypographyArticle = ({
  poem,
}: {
  poem: ApiPoemFindDetail;
}) => {
  const { pinyinVisible, font, annotationVisible } =
    useAtomValue(poemTypographyAtom);

  return (
    <main
      className={cn(
        "@container/poem mx-auto max-w-screen-md rounded-md w-full py-16",
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

      <section
        className={cn("text-3xl leading-[1.75em] mt-[2em]", {
          "leading-[2.25em]": pinyinVisible,
        })}
      >
        <PoemTypographyContent
          poem={poem}
          pinyinVisible={pinyinVisible}
          annotationVisible={annotationVisible}
        />
      </section>
    </main>
  );
};
