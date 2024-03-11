"use client";

import { chunk } from "lodash-es";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import { Button } from "~/components/ui/button";
import { type Locale } from "~/dictionaries";
import { api } from "~/trpc/react";
import { cn } from "~/utils";
import { type Options, ToggleOption } from "./toggle-option";

const Row = ({
  text,
  align = "center",
  className,
  border,
}: {
  text: string;
  align?: "left" | "right" | "center";
  className?: string;
  border?: boolean;
}) => {
  const num = 12;
  const left = Math.floor((num - text.length) / 2) + text.length;

  let data = text.padStart(left).padEnd(num).split("");
  if (align === "right") {
    data = text.padStart(num).split("");
  }

  if (align === "left") {
    data = text.padEnd(num).split("");
  }

  return (
    <div
      className={cn(
        "grid w-full grid-cols-12 border-y",
        !border && "border-transparent",
      )}
    >
      {data.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex h-20 w-20 items-center justify-center border-r",
            index === 0 && "border-l",
            !border && "border-transparent",
            className,
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default function PrintPage({
  searchParams,
}: {
  searchParams: { id: string; lang: Locale };
}) {
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `padding:24px`,
  });

  const [opts, setOpts] = useState<Options>({
    translation: true,
    py: false,
    border: true,
  });

  const { data: poem } = api.poem.findById.useQuery({
    id: Number(searchParams.id),
    lang: searchParams.lang,
  });

  if (!poem) return null;

  const title = poem.title;
  const author = `${poem.author.dynasty}·${poem.author.name}`;

  const content = poem.content
    .replaceAll("\n", "")
    .match(/[^。|！|？|，|；]+[。|！|？|，|；]+/g);

  if (!content) return null;

  const translation = chunk(
    poem.translation?.replaceAll("\n", "").split(""),
    12,
  );

  const arr = [title, author, ...content];

  return (
    <div className="flex">
      <aside className="fixed top-0 flex h-full w-72 flex-col bg-muted p-4">
        <p className="t mb-4 text-sm text-muted-foreground">自定义打印内容</p>
        <ToggleOption value={opts} onChange={setOpts} />

        <Button onClick={handlePrint} className="mt-12">
          打印
        </Button>
      </aside>
      <aside className="w-72"></aside>

      <div className="relative m-auto min-h-[1754px] w-[938px]">
        <div
          className="w-[938px] space-y-4 font-cursive text-5xl"
          ref={componentRef}
        >
          {arr.map((item, index) => (
            <Row
              border={opts.border}
              key={index}
              text={item}
              align={index === 1 ? "right" : "center"}
            />
          ))}

          {opts.translation && (
            <p className="flex h-20 items-center justify-between text-2xl text-neutral-400">
              <span className="text-5xl text-black">译文</span>
              aspoem.com | 现代化中国诗词学习网站
            </p>
          )}

          {opts.translation &&
            translation.map((item) =>
              Row({ text: item.join(""), border: opts.border, align: "left" }),
            )}
        </div>
      </div>
    </div>
  );
}
