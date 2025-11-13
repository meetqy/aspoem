"use client";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import type { ApiPoemFindDetail } from "@/server/api/router/poem";
import { poemTypographyAtom } from "@/stores/poem-typography";
import { PoemTypographyAuthor } from "./author";
import { PoemTypographyContent } from "./content";
import { PoemTypographyTitle } from "./title";

export const PoemTypography = ({ poem }: { poem: ApiPoemFindDetail }) => {
  const { pinyinVisible, font } = useAtomValue(poemTypographyAtom);

  return (
    <main
      className={cn(
        "@container/poem mx-auto max-w-screen-md rounded-md p-4 w-full md:py-24 py-12",
        font === "sans" ? "font-sans" : "font-cursive",
      )}
      style={{
        fontSize: 20,
      }}
    >
      <section>
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
            paragraphs={poem.paragraphs}
            paragraphsPinyin={poem.paragraphsPinyin}
            annotation={poem.annotation as Record<string, string>}
            font={font as "cursive" | "sans"}
            pinyinVisible={pinyinVisible}
          />
        </div>
      </section>

      <section className="prose font-sans mt-24">
        {poem.translation && (
          <>
            <h2>译文</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: poem.translation.replaceAll("\n", "<br/>"),
              }}
            />
          </>
        )}

        {poem.annotation && (
          <>
            <h2>注解</h2>
            <ul>
              {Object.entries(poem.annotation || {}).map(([key, value]) => (
                <li key={key}>
                  {key}：{value}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
};
