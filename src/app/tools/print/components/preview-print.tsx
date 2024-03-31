"use client";

import { chunk } from "lodash-es";
import { useRef } from "react";

import { cn } from "~/utils";
import { type Author, type Poem } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { Button } from "~/components/ui/button";

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
            "flex items-center justify-center border-r",
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

const PyRow = ({
  py,
  className,
  border,
  align,
}: {
  py: string;
  className?: string;
  align?: "left" | "right" | "center";
  border?: boolean;
}) => {
  const num = 12;
  const arr = py.split(" ");

  let left = Math.floor((num - arr.length) / 2);

  if (align === "right") {
    left = num - arr.length;
  }

  const data = new Array(12).fill("").map((_, index) => {
    return index < left ? "" : arr[index - left];
  });

  return (
    <div
      className={cn(
        "mt-4 grid h-14 grid-cols-12 border-t text-2xl text-neutral-500",
        className,
        !border && "border-transparent",
      )}
    >
      {data.map((item, index) => (
        <div
          key={index}
          className="relative flex w-full items-center justify-center"
        >
          {border && (
            <>
              <div className="absolute top-1 h-3 w-full border-b-2 border-dashed"></div>
              <div className="absolute bottom-3 h-3 w-full border-b-2 border-dashed"></div>
            </>
          )}
          <span className="relative z-10 font-serif font-light">{item}</span>
        </div>
      ))}
    </div>
  );
};

export default function PreviewPrint({
  poem,
}: {
  poem: Poem & { author: Author };
}) {
  const componentRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const opts = {
    translation: searchParams.get("translation") === "true",
    py: searchParams.get("py") === "true",
    border: searchParams.get("border") === "true",
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `padding:24px`,
  });

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
  const py = [
    poem.titlePinYin,
    poem.author.namePinYin,
    ...(poem.contentPinYin ?? "").split("."),
  ];

  return (
    <>
      <Button
        className="fixed bottom-8 left-4 w-64"
        onClick={() => handlePrint()}
      >
        打印
      </Button>
      <div className="relative m-auto min-h-[1754px] w-[938px]">
        <div
          className="font-cursive w-[938px] space-y-4 text-5xl"
          ref={componentRef}
        >
          <div
            className={cn(
              opts.py ? "min-h-[1334px] space-y-8" : "h-auto space-y-4",
            )}
          >
            {arr.map((item, index) => (
              <div key={index}>
                <PyRow
                  py={py[index] ?? ""}
                  align={index === 1 ? "right" : "center"}
                  border={opts.border}
                  className={cn(!opts.py && "hidden")}
                />
                <Row
                  border={opts.border}
                  className="h-20 w-20"
                  text={item}
                  align={index === 1 ? "right" : "center"}
                />
              </div>
            ))}
          </div>

          {opts.translation && (
            <p className="flex h-20 items-center justify-between text-2xl text-neutral-400">
              <span className="text-5xl text-black">译文</span>
              aspoem.com | 现代化诗词学习网站
            </p>
          )}

          {opts.translation &&
            translation.map((item) =>
              Row({
                text: item.join(""),
                border: opts.border,
                align: "left",
                className: "h-20 w-20",
              }),
            )}
        </div>
      </div>
    </>
  );
}
