/* eslint-disable @next/next/no-img-element */
import { type Author, type Poem } from "@prisma/client";
import { Verse } from "~/components/verse";
import { cn } from "~/utils";

interface Props {
  data: Poem & { author: Author };
  className?: string;
  bgImg: string;
}

export default function DrawWuYanPreview({ data, className, bgImg }: Props) {
  const content = data.content
    .replace(/\n/g, "")
    .match(/[^(？|，|。|！)]+(？|，|。|！)?|(？|，|。|！)/g)
    ?.slice(0, 4);

  const py = data.contentPinYin?.split(". ");

  return (
    <div
      className={cn("relative h-[732px] w-[540px]", className)}
      id="draw-share-card"
    >
      <img
        src={bgImg}
        alt="background"
        className="z-1 absolute left-0 top-0 h-full w-full"
      />
      <div className="absolute bottom-44 left-24 text-lg text-muted-foreground">
        aspoem
      </div>
      <div className={"relative z-20 flex h-full w-full justify-center py-24"}>
        <div>
          <Verse
            content={data.title}
            variant="title"
            py={data.titlePinYin || ""}
          />
          <p className="mb-6 mt-3 text-center text-xl">
            {data.author.dynasty} · {data.author.name}
          </p>
          <div className="space-y-4">
            {content!.map((line, index) => {
              return (
                <Verse
                  key={index}
                  content={line}
                  variant="shi"
                  py={py![index] || ""}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
