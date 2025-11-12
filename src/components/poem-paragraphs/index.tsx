"use client";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ApiPoemFindDetail } from "@/server/api/router/poem";
import { RubyText } from "./ruby-text";

export const PoemParagraphs = ({ poem }: { poem: ApiPoemFindDetail }) => {
  const search = useSearchParams();
  const pinyinVisible = !!search.get("py");
  const font = search.get("font") || "cursive";

  return (
    <main
      className={cn(
        "@container/poem mx-auto max-w-screen-md border rounded-md p-4 w-full @poem/md:py-24 py-12",
        font === "sans" ? "font-sans" : "font-cursive",
      )}
      style={{
        fontSize: 20,
      }}
    >
      <RubyText
        className="text-5xl @md/poem:text-6xl"
        as="h1"
        text={poem.title}
        pinyin={poem.titlePinyin}
        pinyinVisible={pinyinVisible}
      />

      <h2 className="text-center mt-[1.5em] flex items-center justify-center">
        <RubyText
          className="text-xl @md/poem:text-3xl"
          classNames={{
            pinyin: "text-base",
          }}
          as="span"
          text={`[${poem.dynasty!.name}]`}
          pinyin={` ${poem.dynasty!.pinyin} `}
          pinyinVisible={pinyinVisible}
        />

        <span className="mx-2"></span>

        <RubyText
          classNames={{
            pinyin: "text-base",
          }}
          className="text-xl @md/poem:text-3xl"
          as="span"
          text={poem.author.name}
          pinyin={poem.author.pinyin}
          pinyinVisible={pinyinVisible}
        />
      </h2>

      <div className="mt-[3em]">
        <div className="leading-[2.5em] text-[2rem] @md/poem:text-4xl tracking-[0.2em] @md/poem:tracking-[0.15em] transition-all">
          {poem.paragraphs.map((paragraph, index) => (
            <RubyText
              key={index}
              as="p"
              className="text-inherit text-left"
              text={paragraph}
              pinyin={poem.paragraphsPinyin[index]!}
              pinyinVisible={pinyinVisible}
              annotation={poem.annotation as Record<string, string>}
              classNames={{
                symbol: "lg:after:inline after:flex",
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
};
