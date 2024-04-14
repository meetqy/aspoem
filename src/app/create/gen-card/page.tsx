"use client";

import { toBlob } from "html-to-image";
import { useState } from "react";
import DrawDefaultPreview from "~/components/share/draw/default";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export default function GenCardPage() {
  const [page, setPage] = useState(1);

  const { data } = api.other.getGenCard.useQuery(
    { page },
    {
      refetchOnWindowFocus: false,
    },
  );

  if (!data) return <div>loading...</div>;

  const { data: poems, total } = data;

  const totalPage = Math.ceil(total / 100);

  const download = async (id: number) => {
    const card = document.getElementById(`draw-share-card-${id}`);
    if (!card) return;

    try {
      const blob = await toBlob(card, {
        width: card.clientWidth * 2,
        height: card.clientHeight * 2,
        cacheBust: true,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
        },
      });

      // download blob
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = id + ".png";
      a.click();
    } catch (e) {
      console.error(e);
    }
  };

  const gen = async () => {
    for (const item of poems) {
      await download(item.id);
    }
  };

  return (
    <div>
      <h1 className="prose-h1">生成卡片</h1>
      <div className="mt-4">
        <Button onClick={gen}>一键生成 ({poems.length})</Button>

        <div className="mt-2 space-x-2">
          {new Array(totalPage).fill(0).map((_, index) => (
            <Button
              key={index}
              variant={page === index + 1 ? "default" : "outline"}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2 gap-y-8">
        {poems.map((item) => (
          <DrawDefaultPreview
            key={item.id}
            data={item}
            id={`draw-share-card-${item.id}`}
          />
        ))}
      </div>
    </div>
  );
}
