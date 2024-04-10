"use client";

import { type Author, type Poem } from "@prisma/client";
import { random } from "lodash-es";
import { cn } from "~/utils";

interface Props {
  data: Poem & { author: Author };
  className?: string;
  style?: React.CSSProperties;
}

const DrawDefaultPreview = (props: Props) => {
  const { data: poem } = props;

  const contentTemp =
    poem.content
      .replaceAll("\n", "")
      .match(/[^。|！|？|，|；]+[。|！|？|，|；]+/g) || [];
  const endRandom: number[] = [];
  contentTemp.map((_, i) => {
    const index = i + 1;

    if (index % 2 === 0) endRandom.push(index);
  });

  const end = endRandom[random(0, endRandom.length - 1)] || 2;
  const content = contentTemp?.slice(end - 2, end) || [];

  return (
    <div
      id="draw-share-card"
      style={props.style}
      className={cn(
        "fixed left-0 top-0 -z-50 h-[600px] w-[450px] bg-cover p-6 opacity-0",
        props.className,
      )}
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="-mt-12 w-full space-y-6">
          {content.map((c, i) => {
            return (
              <div key={i} className="w-full text-center text-5xl">
                {c}
              </div>
            );
          })}
        </div>

        <div className="mt-24 w-full text-end text-xl opacity-80">
          —— {poem.author.dynasty}·{poem.author.name}《{poem.title}》
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full pb-2 pr-4 text-right opacity-60">
        aspoem
      </div>
    </div>
  );
};

export default DrawDefaultPreview;
