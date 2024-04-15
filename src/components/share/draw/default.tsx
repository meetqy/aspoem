/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { type Author } from "@prisma/client";
import { random } from "lodash-es";
import { cn } from "~/utils";

interface Props {
  data: { author: Author; content: string; title: string; id: number };
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  bgImage?: string;
}

const DrawDefaultPreview = (props: Props) => {
  const { data: poem, id = "draw-share-card" } = props;

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

  const image =
    props.bgImage || "https://source.unsplash.com/random/1080?wallpapers";

  const Background = {
    color: "white",
    component: () => (
      <>
        <div
          id="draw-share-card-bg"
          className="absolute left-0 right-0 top-0 aspect-[3/4] h-full backdrop-blur-none"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
          }}
        />
        <div
          className="absolute left-0 right-0 top-0 h-full opacity-60 backdrop-blur-none"
          style={{ backgroundColor: "#1F2937" }}
        />
      </>
    ),
  };

  return (
    <div
      id={id}
      style={{
        color: Background.color,
        ...props.style,
      }}
      className={cn(
        "relative aspect-[3/4] w-96 overflow-hidden",
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

        <span className="absolute bottom-2 right-2 opacity-70">aspoem</span>
      </div>
    </div>
  );
};

export default DrawDefaultPreview;
