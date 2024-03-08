"use client";

import DrawDefaultPreview from "~/app/[lang]/poem/[id]/components/share/draw/default";
import DrawWuYanPreview from "~/app/[lang]/poem/[id]/components/share/draw/wu-yan";
import { api } from "~/trpc/react";

/**
 * 五言绝句的分享卡片 Dom
 * @returns
 */
export default function demo() {
  const { data: poem } = api.poem.findById.useQuery({ id: 2290 });

  if (!poem) return <div>loading...</div>;

  return (
    <div className="flex min-h-screen items-center justify-between bg-cover px-12">
      <DrawDefaultPreview data={poem} />
      <DrawWuYanPreview data={poem} />
    </div>
  );
}
