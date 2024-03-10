"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { cn } from "~/utils";

const Row = ({
  text,
  right,
  className,
}: {
  text: string;
  right?: boolean;
  className?: string;
}) => {
  const num = 11;
  const left = Math.floor((num - text.length) / 2) + text.length;

  let data = text.padStart(left).padEnd(num).split("");
  if (right) {
    data = text.padStart(num).split("");
  }

  return (
    <div className="grid w-full grid-cols-11 border-y">
      {data.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex aspect-square items-center justify-center border-r",
            index === 0 && "border-l",
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
  searchParams: { id: string };
}) {
  const { data: poem } = api.poem.findById.useQuery({
    id: Number(searchParams.id),
  });

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (!poem) return null;

  const title = poem.title;
  const author = `${poem.author.dynasty}·${poem.author.name}`;

  const content = poem.content
    .replaceAll("\n", "")
    .match(/[^。|！|？|，|；]+[。|！|？|，|；]+/g);

  if (!content) return null;

  let arr = [title, author, ...content];
  arr = [...arr, ...(new Array(12).fill("") as string[])].slice(0, 12);

  return (
    <div className="flex">
      <aside className="fixed top-0 flex h-full w-72 flex-col space-y-4 bg-muted p-4">
        <Button onClick={handlePrint}>打印</Button>
      </aside>
      <aside className="w-72"></aside>
      <div className="relative m-auto min-h-[1754px] w-[1240px] origin-top-left scale-75 border border-t-0">
        <div
          className="w-full space-y-4 p-12 font-cursive text-5xl"
          ref={componentRef}
        >
          {arr.map((item, index) => (
            <Row
              key={index}
              text={item}
              right={index === 1}
              className={cn(index === 1 && "text-neutral-500")}
            />
          ))}

          <p className="absolute bottom-0 left-0 flex w-full items-center justify-end p-4 text-2xl text-neutral-400">
            aspoem.com | 现代化诗词学习网站
          </p>
        </div>
      </div>
    </div>
  );
}
