import { cn } from "~/utils";
import PinYinText from "./PinYinText";
import CopyButton from "./Copy";
import { type Author, type Poem } from "@prisma/client";
import Link from "next/link";

export const Normal = ({
  poem,
  showPinYin,
  blockArray,
  contentPinYin,
  retract,
  annotation,
}: {
  poem: Poem & { author: Author };
  showPinYin: boolean;
  blockArray: string[];
  contentPinYin: string[];
  retract?: string;
  annotation: { [key in string]: string };
}) => {
  return (
    <article className="group relative py-8 text-center">
      {/* 标题 */}
      <PinYinText
        text={poem.title}
        pinyin={showPinYin ? poem.titlePinYin ?? "" : ""}
        type="h1"
        className="px-4"
      />

      <p
        className={cn(
          "mt-4 !border-0 text-secondary-foreground md:mt-6",
          showPinYin ? "mb-12" : "mb-6",
          "md:prose-h2 prose-h3 transition-all",
        )}
      >
        {poem.author.dynasty && (
          <span className="font-light">{poem.author.dynasty} · </span>
        )}

        <Link
          href={`/author/${poem.author.id}`}
          className="underline-animation font-light"
        >
          {poem.author.name}
        </Link>
      </p>

      <div className="px-4 md:px-0">
        {/* 额外信息 */}
        {poem.introduce && (
          <blockquote
            prose-blockquote=""
            className={cn(
              "py-2 text-left text-lg !not-italic text-muted-foreground transition-all",
              showPinYin ? "mb-12" : "mb-6",
            )}
          >
            {poem.introduce}
          </blockquote>
        )}

        {/* 内容 */}
        {blockArray.map((line, index) => {
          const blockPinYin = contentPinYin[index];

          return (
            <PinYinText
              key={index}
              text={line}
              align={poem.genre != "诗" ? "left" : "center"}
              retract={retract ? true : false}
              pinyin={showPinYin ? blockPinYin : ""}
              annotation={annotation}
            />
          );
        })}
      </div>

      <CopyButton
        data={poem}
        className="absolute right-1 top-1 transition-all group-hover:opacity-100 md:opacity-0"
      />
    </article>
  );
};
