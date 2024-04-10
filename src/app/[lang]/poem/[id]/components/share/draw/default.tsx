"use client";

import { type Author, type Poem } from "@prisma/client";
import { random } from "lodash-es";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { bgCards, r2Host, urlToBase64 } from "~/utils";

interface Props {
  data: Poem & { author: Author };
}

const DrawDefaultPreview = (props: Props) => {
  const { data: poem } = props;
  const utils = api.useUtils();

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

  const [bgItem, setBgItem] = useState<{
    blob: string;
    color: string;
  }>({
    blob: "",
    color: "#000",
  });

  useEffect(() => {
    const image = bgCards[random(0, bgCards.length - 1)];
    if (!image) return;
    const url = `${r2Host}/neutral-card-bg/${image.name}.jpg`;

    void urlToBase64(url).then((res) => {
      if (res) {
        setBgItem({ blob: res, color: image.color });
      }
    });
  }, []);

  if (!bgItem) return null;

  return (
    <div
      id="draw-share-card"
      className="relative h-[600px] w-[450px] p-6"
      style={{
        backgroundImage: `url(${bgItem.blob})`,
        backgroundSize: "cover",
        color: bgItem.color,
      }}
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
