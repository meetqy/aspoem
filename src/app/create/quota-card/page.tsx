"use client";

import { toBlob } from "html-to-image";
import { useEffect, useMemo, useState } from "react";
import DrawDefaultPreview from "~/components/share/draw/default";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { uid } from "uid";
import { useRouter, useSearchParams } from "next/navigation";
import { type Author } from "@prisma/client";
import { Textarea } from "~/components/ui/textarea";

interface Props {
  poems: { id: number; author: Author; title: string; content: string }[];
  urls: string[];
}

export default function GenCardPage() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();
  const [content, setContent] = useState("");
  const quotas = useMemo(
    () => (content ? (JSON.parse(content) as string[]) : []),
    [content],
  );

  const { data } = api.card.findNeedCreateByQuota.useQuery(
    { token, quotas },
    { enabled: quotas.length > 0, refetchOnWindowFocus: false },
  );

  useEffect(() => {
    if (localStorage.getItem("token") && !token) {
      router.replace(`?token=${localStorage.getItem("token")}`);
    }
  }, [router, token]);

  return (
    <div>
      <h1 className="prose-h1">名句转片段</h1>

      {data?.urls && (
        <GenCard poems={data.data} urls={data.urls} token={token} />
      )}

      <div className="mt-4">
        <Textarea
          placeholder="输入内容"
          required
          value={content}
          className="h-32"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {data?.urls && <ListPreview poems={data.data} urls={data.urls} />}
    </div>
  );
}

const ListPreview = ({ poems, urls }: Props) => {
  return (
    <div className="mt-8 grid grid-cols-3 gap-2 gap-y-8">
      {poems.map((item, i) => (
        <DrawDefaultPreview
          key={item.id}
          data={item}
          bgImage={urls[i]}
          random={false}
          id={`draw-share-card-${item.id}-${i}`}
        />
      ))}
    </div>
  );
};

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
      await download(item.id, i);
    }
  };

  return <Button onClick={gen}>一键生成 ({poems.length})</Button>;
};
