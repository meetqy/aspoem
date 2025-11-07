import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { PoemListItem } from "../../_components/poem-list-item";

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { items, dynasty } = await api.poem.getLatestListByDynasty({
    limit: 20,
    dynastySlug: slug,
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl mb-4">
          {dynasty.name} ({dynasty.pinyin})
        </h1>
        <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
          {dynasty.name} ({dynasty.pinyin}) 的诗文，共{" "}
          <b>{dynasty._count.poems}</b> 首。
        </p>
      </div>
      <div className="space-y-4">
        {items.map((poem) => (
          <PoemListItem key={poem.id} poem={poem} />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Button size={"lg"} variant="secondary">
          加载更多...
        </Button>
      </div>
    </>
  );
}
