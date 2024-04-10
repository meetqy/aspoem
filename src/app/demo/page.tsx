"use client";

import { api } from "~/trpc/react";
import DrawDefaultPreview from "../[lang]/poem/[id]/components/share/draw/default";
import SaveShareButton from "../[lang]/poem/[id]/components/share";
import { RefreshCcwDot } from "lucide-react";

export default function Page() {
  const { data } = api.poem.findById.useQuery(
    {
      id: 10,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  if (!data) return;

  return (
    <div className="flex max-w-screen-md space-x-4 overflow-auto p-4 text-xl">
      <SaveShareButton
        scale={2}
        title={
          <>
            <RefreshCcwDot className="mr-2 h-5 w-5 text-primary" />
            随机摘抄卡片
          </>
        }
      >
        <DrawDefaultPreview data={data} />
      </SaveShareButton>

      <DrawDefaultPreview data={data} />
    </div>
  );
}
