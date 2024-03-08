"use client";

import DrawWuYanPreview from "~/app/[lang]/poem/[id]/components/share/draw/wu-yan";
import { api } from "~/trpc/react";

/**
 * 五言绝句的分享卡片 Dom
 * @returns
 */
export default function demo() {
  const { data: poem } = api.poem.findById.useQuery({ id: 157 });

  if (!poem) return <div>loading...</div>;

  return (
    <div
      className="flex min-h-screen items-center justify-between bg-cover px-12"
      style={{ backgroundImage: "url(/share-card-bg/test-bg.jpg)" }}
    >
      <DrawWuYanPreview data={poem} className="bg-white/50 backdrop-blur" />
      <DrawWuYanPreview data={poem} className="bg-white" />
      <DrawWuYanPreview data={poem} />
    </div>
  );
}
