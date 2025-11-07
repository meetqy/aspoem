import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { AuthorTable } from "./_components/author-table";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    dynasty?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 100;
  const dynastySlug = params.dynasty;

  // 验证页码，如果小于1则重定向到第1页
  if (page < 1) {
    redirect("/authors?page=1");
  }

  const result = await api.author.getPagedList({
    page,
    pageSize,
    dynastySlug,
  });

  // 如果页码超出范围，重定向到最后一页
  if (page > result.totalPages && result.totalPages > 0) {
    const searchParams = new URLSearchParams();
    searchParams.set("page", result.totalPages.toString());
    if (pageSize !== 20) searchParams.set("pageSize", pageSize.toString());
    if (dynastySlug) searchParams.set("dynasty", dynastySlug);
    redirect(`/authors?${searchParams.toString()}`);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl mb-4">
          {dynastySlug
            ? `${result.items[0]?.dynasty.name}朝代诗人`
            : "诗人作者"}
        </h1>
        <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
          {dynastySlug
            ? `${result.items[0]?.dynasty.name}朝代共有 ${result.total} 位诗人作者，探索他们的文学成就`
            : `共收录 ${result.total} 位历代文人墨客，品味千年诗词文化`}
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
export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  const dynastySlug = params.dynasty;
  const page = Number(params.page) || 1;

  if (dynastySlug) {
    try {
      const result = await api.author.getPagedList({
        page: 1,
        pageSize: 1,
        dynastySlug,
      });
      const dynastyName = result.items[0]?.dynasty.name;

      return {
        title: `${dynastyName}朝代诗人列表${page > 1 ? ` - 第${page}页` : ""}`,
        description: `探索${dynastyName}朝代的诗人作者，品味千年诗词文化`,
      };
    } catch {
      return {
        title: "朝代不存在",
      };
    }
  }

  return {
    title: `诗人作者${page > 1 ? ` - 第${page}页` : ""}`,
    description: "探索历代文人墨客，品味千年诗词文化",
  };
}
