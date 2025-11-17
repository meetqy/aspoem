import { api } from "@/trpc/server";
import { PoemListItem } from "./_components/poem-list-item";
import { PoemLoadMore } from "./_components/poem-load-more";
import { discover } from "./_components/sidebar-items";

const discoverItem = discover.find((item) => item.title === "最近更新")!;

export const metadata = {
  title: discoverItem.title,
  description: discoverItem.description,
};

export default async function Home() {
  const { items, nextCursor } = await api.poem.getLatestList({
    limit: 20,
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl mb-4">
          {discoverItem.title}
        </h1>
        <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
          {discoverItem.description}
        </p>
      </div>
      <div className="space-y-4">
        {items.map((poem) => (
          <PoemListItem key={poem.id} poem={poem} />
        ))}
      </div>

      <PoemLoadMore queryKey="getLatestList" nextCursor={nextCursor} />
    </>
  );
}
