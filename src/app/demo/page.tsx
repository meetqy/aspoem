"use client";

import { api } from "~/trpc/react";
import DrawDefaultPreview from "../[lang]/poem/[id]/components/share/draw/default";
import { bgCards } from "~/utils";
import { random } from "lodash-es";

export default function Page() {
  const { data } = api.poem.findById.useQuery({
    id: 10,
  });

  if (!data) return;

  const num = random(0, bgCards.length - 1);
  const bg = bgCards[num];

  if (!bg) return;

  return (
    <div className="flex max-w-screen-md space-x-4 overflow-auto p-4 text-xl">
      <DrawDefaultPreview
        data={data}
        style={{
          backgroundImage: `url(https://r2.aspoem.com/neutral-card-bg/${bg.name}.jpg)`,
          color: bg.color,
          opacity: 1,
          transform: "scale(1.5)",
          transformOrigin: "top left",
        }}
      />
    </div>
  );
}
