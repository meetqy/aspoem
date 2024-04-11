"use client";

import { api } from "~/trpc/react";
import { random } from "lodash-es";
import SaveShareButton from "~/app/[lang]/poem/[id]/components/share";
import DrawDefaultPreview from "~/app/[lang]/poem/[id]/components/share/draw/default";
import bgCardsImages from "~/utils/bg-card";

export default function Page() {
  const { data } = api.poem.findById.useQuery(
    {
      id: 1689,
    },
    { refetchOnWindowFocus: false },
  );

  if (!data) return;

  const num = random(0, bgCardsImages.length - 1);
  const bg = bgCardsImages[num];

  if (!bg) return;

  return (
    <div className="flex max-w-screen-md space-x-4 overflow-auto p-4 text-xl">
      <SaveShareButton title="Preview" scale={2}>
        <DrawDefaultPreview data={data} />
      </SaveShareButton>
    </div>
  );
}
