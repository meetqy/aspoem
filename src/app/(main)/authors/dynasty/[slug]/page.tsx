import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { AuthorListItem } from "../../_components/author-list-item";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { items } = await api.author.getList({
    limit: 100,
    dynastySlug: slug,
  });

  // 如果没有找到作者，返回404
  if (items.length === 0) {
    notFound();
  }

  // 从第一个作者获取朝代信息
  const dynasty = items[0]?.dynasty;

  return (
    <>
      <div className="mb-6">
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl mb-4">
          [{dynasty?.name}] 诗人
        </h1>
      </div>

      <div className="grid gap-4 grid-cols-2">
        {items.map((author) => (
          <AuthorListItem key={author.id} author={author} />
        ))}
      </div>
    </>
  );
}
