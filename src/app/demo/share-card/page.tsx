"use client";

import { api } from "~/trpc/react";
import { random } from "lodash-es";
import bgCardsImages from "~/utils/bg-card";
import SaveShareButton from "~/components/share";
import DrawDefaultPreview from "~/components/share/draw/default";

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
    <div className="flex max-w-screen-md flex-wrap space-x-4 overflow-auto p-4 text-xl">
      <SaveShareButton title="Preview" scale={1}>
        <DrawDefaultPreview data={data} />
      </SaveShareButton>
    </div>
  );
}
