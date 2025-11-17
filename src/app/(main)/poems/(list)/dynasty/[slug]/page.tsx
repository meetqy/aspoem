import { api } from "@/trpc/server";
import { PoemListItem } from "../../_components/poem-list-item";
import { PoemLoadMore } from "../../_components/poem-load-more";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const { dynasty } = await api.poem.getLatestListByDynasty({
    limit: 20,
    dynastySlug: slug,
  });

  return {
    title: `${dynasty.name} (${dynasty.pinyin}) 的诗文, 共 ${dynasty._count.poems} 首`,
    description: `查看${dynasty.name} (${dynasty.pinyin}) 的诗文, 共 ${dynasty._count.poems} 首。`,
  };
};

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { items, dynasty, nextCursor } = await api.poem.getLatestListByDynasty({
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

      <PoemLoadMore
        nextCursor={nextCursor}
        queryKey="getLatestListByDynasty"
        queryParams={{
          dynastySlug: slug,
        }}
      />
    </>
  );
}
