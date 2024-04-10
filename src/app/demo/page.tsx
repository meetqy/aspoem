import { api } from "~/trpc/server";
import DrawDefaultPreview from "../[lang]/poem/[id]/components/share/draw/default";
import { bgCards } from "~/utils";

export default async function Page() {
  const data = await api.poem.findById.query({
    id: 10,
  });

  if (!data) return;

  const num = 9;
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
        }}
      />
    </div>
  );
}
