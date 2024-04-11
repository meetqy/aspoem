"use client";

import { type Author, type Poem } from "@prisma/client";
import { random } from "lodash-es";
import { bgCards, cn } from "~/utils";

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

  const image = bgCards[random(0, bgCards.length - 1)]!;

  return (
    <div
      id="draw-share-card"
      style={{
        color: image.color,
        ...props.style,
      }}
      className={cn(
        "relative h-[600px] w-[450px] overflow-hidden rounded-md",
        props.className,
      )}
    >
      <div
        className="absolute -left-4 top-0 h-[105%] w-[105%] origin-center scale-105 bg-cover blur"
        style={{
          backgroundImage: `url(${image.url})`,
        }}
      />
      <div className="relative h-full w-full p-8">
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
          <div className="-mt-12 w-full space-y-6 text-center">
            <p className="text-5xl italic">{content[0]}</p>
            <p className="text-5xl italic">{content[1]}</p>
          </div>

          <div className="mt-24 w-full text-end text-xl opacity-80">
            —— {poem.author.dynasty}·{poem.author.name}《{poem.title}》
          </div>
        </div>

        <span className="absolute bottom-4 right-4 opacity-70">aspoem</span>
      </div>
    </div>
  );
};

export default DrawDefaultPreview;
