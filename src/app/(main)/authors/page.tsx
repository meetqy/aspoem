import { api } from "@/trpc/server";
import { AuthorListItem } from "./_components/author-list-item";

export default async function Page() {
  const { items } = await api.author.getList({ limit: 50 });

  return (
    <>
      <div className="mb-6">
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl mb-4">
          诗人作者
        </h1>
        <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
          探索历代文人墨客，品味千年诗词文化
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2">
        {items.map((author) => (
          <AuthorListItem key={author.id} author={author} />
        ))}
      </div>
    </>
  );
}
