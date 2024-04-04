import { type Author, type Poem } from "@prisma/client";
import { Verse } from "~/components/verse";
import { cn } from "~/utils";
import Link from "next/link";
import { type Locale, getLangUrl } from "~/dictionaries";
import { TypographyArticle } from "~/components/typography-article";

export const Body = (props: {
  poem: Poem & { author: Author };
  py?: boolean;
  lang: Locale;
}) => {
  const { py, poem } = props;

  const content = poem.content.split("\n");
  const contentPinYin = poem.contentPinYin?.split("\n") ?? [];

  const isCenter = content.every((line) => line.length <= 16);

  const annotation = JSON.parse(poem.annotation ?? "{}") as {
    [key in string]: string;
  };

  const titlePinYin = py ? poem.titlePinYin ?? "" : "";

  return (
    <article className="group py-8">
      <div className={cn(py && "space-y-4")}>
        <Verse
          variant="title"
          content={poem.title}
          py={titlePinYin}
          className={cn(py ? "pt-4" : "", "px-4")}
        />
        <p className={cn(py ? "!mb-8" : "my-4", "text-center text-2xl")}>
          {poem.author.dynasty}
          <span className="dot">·</span>
          <Link
            href={getLangUrl(`/author/${poem.authorId}`, props.lang)}
            className="hover:underline"
          >
            {poem.author.name}
          </Link>
        </p>

        {/* 额外信息 */}
        {poem.introduce && (
          <p
            className={cn(
              "px-4 py-2 text-left !text-f50 !not-italic text-muted-foreground transition-all md:px-0",
              py ? "mb-12" : "mb-4",
            )}
          >
            {poem.introduce}
          </p>
        )}

        {isCenter ? (
          content.map((line, index) => (
            <Verse
              key={line}
              content={line}
              annotation={annotation}
              variant={"shi"}
              py={py ? contentPinYin[index] : ""}
            />
          ))
        ) : (
          <TypographyArticle
            paragraphs={content}
            py_paragraphs={py ? contentPinYin : []}
            annotation={annotation}
          />
        )}
      </div>
    </article>
  );
};
