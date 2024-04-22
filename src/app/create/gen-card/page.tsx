"use client";

import { toBlob } from "html-to-image";
import { useEffect, useState } from "react";
import DrawDefaultPreview from "~/components/share/draw/default";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { uid } from "uid";
import { useRouter, useSearchParams } from "next/navigation";
import { type Author } from "@prisma/client";

interface Props {
  poems: { id: number; author: Author; title: string; content: string }[];
  urls: string[];
}

export default function GenCardPage() {
  const [page, setPage] = useState(1);
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();
  const tagName = params.get("tagName") ?? "七言律诗";

  useEffect(() => {
    if (localStorage.getItem("token") && !token) {
      router.replace(`?token=${localStorage.getItem("token")}`);
    }
  }, [router, token]);

  const { data } = api.card.getGenerateCard.useQuery(
    { page, token, tagName },
    { refetchOnWindowFocus: false },
  );

  if (!data) return null;
  const { data: poems, pageCount, urls, total } = data;
  if (!urls) return null;

  return (
    <div>
      <h1 className="prose-h1">
        生成卡片 {tagName} ({total})
      </h1>
      <div className="mt-4">
        <GenCard poems={poems} urls={urls} token={token} />

        <div className="mt-2 space-x-2">
          {new Array(pageCount).fill(0).map((_, index) => (
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
        {poems.map((item, i) => (
          <DrawDefaultPreview
            key={item.id}
            data={item}
            bgImage={urls[i]}
            id={`draw-share-card-${item.id}-${i}`}
          />
        ))}
      </div>
    </div>
  );
}

const GenCard = ({ poems, token }: Props & { token: string }) => {
  const cardMutation = api.card.createCardItem.useMutation();

  const download = async (id: number, i: number) => {
    const card = document.getElementById(`draw-share-card-${id}-${i}`);
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

      if (!blob) return;

      const name = `${id}-${uid()}`;
      const content = card.innerText?.split("——")[0]?.replace(/\n+/g, "") || "";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.png`;
      a.click();

      await cardMutation.mutateAsync({
        token,
        url: name,
        poemId: id,
        content,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const gen = async () => {
    for (let i = 0; i < poems.length; i++) {
      const item = poems[i]!;
      console.log(item);
      await download(item.id, i);
    }
  };

  return <Button onClick={gen}>一键生成 ({poems.length})</Button>;
};
