/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { type Author, type Poem } from "@prisma/client";
import { random } from "lodash-es";
import { cn } from "~/utils";
import bgCardsImages from "~/utils/bg-card";

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

  const image = bgCardsImages[random(0, bgCardsImages.length - 1)]!;

  const a = () => (
    <div
      className="absolute -left-4 top-0 h-[105%] w-[105%] origin-center scale-105 bg-cover blur"
      id="draw-share-card-bg"
      style={{
        backgroundImage: `url(${image.url})`,
      }}
    />
  );

  const b = () => (
    <>
      <img
        id="draw-share-card-bg"
        className="absolute left-0 right-0 top-0 aspect-[3/4] h-full rounded-md backdrop-blur-none"
        src={"https://source.unsplash.com/random/1080?wallpapers"}
        style={{ objectFit: "cover" }}
      />
      <div
        className="absolute left-0 right-0 top-0 h-full rounded-md opacity-60 backdrop-blur-none"
        style={{ backgroundColor: "#1F2937" }}
      />
    </>
  );

  const arr = [
    { color: image.color, component: a },
    { color: "white", component: b },
  ];

  const Background = (arr[Math.round(Math.random()) % 2 === 0 ? 0 : 1] ||
    arr[1])!;

  return (
    <div
      id="draw-share-card"
      style={{
        color: Background.color,
        ...props.style,
      }}
      className={cn(
        "relative aspect-[3/4] w-96 overflow-hidden rounded-md",
        props.className,
      )}
    >
      <Background.component />
      <div className="relative h-full w-full p-4">
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
          <div className="w-full space-y-4 text-center text-4xl italic">
            <p>{content[0]}</p>
            <p>{content[1]}</p>
          </div>

          <div className="mt-12 w-full text-end text-lg opacity-80">
            —— {poem.author.dynasty}·{poem.author.name}《{poem.title}》
          </div>
        </div>

        <span className="absolute bottom-4 right-4 opacity-70">aspoem</span>
      </div>
    </div>
  );
};

export default DrawDefaultPreview;
