import { notFound, redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { AuthorTable } from "../../_components/author-table";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const page = Number(search.page) || 1;
  const pageSize = Number(search.pageSize) || 20;

  // 验证页码
  if (page < 1) {
    redirect(`/authors/dynasty/${slug}?page=1`);
  }

  const result = await api.author.getPagedList({
    page,
    pageSize,
    dynastySlug: slug,
  });

  // 如果没有找到作者，返回404
  if (result.items.length === 0 && page === 1) {
    notFound();
  }

  // 如果页码超出范围，重定向到最后一页
  if (page > result.totalPages && result.totalPages > 0) {
    const searchParams = new URLSearchParams();
    searchParams.set("page", result.totalPages.toString());
    if (pageSize !== 20) searchParams.set("pageSize", pageSize.toString());
    redirect(`/authors/dynasty/${slug}?${searchParams.toString()}`);
  }

  const dynasty = result.items[0]?.dynasty;

  return (
    <>
      <div className="mb-6">
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl mb-4">
          [{dynasty?.name}
          {dynasty?.name.length === 1 ? "朝" : ""}] 诗人
        </h1>
        <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
          [{dynasty?.name}
          {dynasty?.name.length === 1 ? "朝" : ""}] 共有 {result.total}{" "}
          位诗人作者，探索他们的文学成就
        </p>
      </div>

      <AuthorTable
        authors={result.items}
        pagination={{
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
          total: result.total,
        }}
      />
    </>
  );
}

// 生成页面元数据
export async function generateMetadata({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const page = Number(search.page) || 1;

  const result = await api.author.getPagedList({
    page: 1,
    pageSize: 1,
    dynastySlug: slug,
  });
  const dynasty = result.items[0]?.dynasty;

  if (!dynasty) {
    return {
      title: "朝代不存在",
    };
  }

  return {
    title: `${dynasty.name}朝代诗人列表${page > 1 ? ` - 第${page}页` : ""}`,
    description: `探索${dynasty.name}朝代的诗人作者，品味千年诗词文化`,
  };
}
