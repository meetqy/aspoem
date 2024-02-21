import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import Section from "~/app/(.)/components/section";
import { Button } from "~/components/ui/button";
import { HeaderMain } from "~/components/ui/header";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";
import { cn } from "~/utils";

const getItem = cache(async (id: number, page: number) => {
  return await api.poem.findByTagId.query({
    id,
    page,
  });
});

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page: string };
}) {
  const id = Number(params.id);
  const page = Number(searchParams.page);

  if (isNaN(id) || isNaN(page) || page < 1) {
    return notFound();
  }

  const { tag } = await getItem(id, page);

  return {
    title: `关于${tag?.type || "其他"}“${tag?.name}”的诗词 第${page}页`,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page: string };
}) {
  const id = Number(params.id);
  const page = Number(searchParams.page);

  if (isNaN(id) || isNaN(page) || page < 1) {
    return notFound();
  }

  const {
    data: poems,
    tag,
    hasNext,
  } = await api.poem.findByTagId.query({
    id,
    page,
  });

  if (poems.length < 1) {
    return notFound();
  }

  return (
    <>
      <HeaderMain>
        <div className="flex h-16 items-center px-4">
          <nav className="flex items-center space-x-2">
            <Link
              href="/tag"
              replace
              className="flex-shrink-0 text-muted-foreground"
            >
              {tag?.type || "其他"}
            </Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" strokeWidth={1} />
            {tag && (
              <Link
                className="line-clamp-1"
                href={`/tag/list/${tag.id}?page=1`}
              >
                {tag.name || "未知"}
              </Link>
            )}
          </nav>
        </div>
      </HeaderMain>

      <div className="p-4">
        <h1 className="prose-h1">{tag?.name}</h1>
        {tag?.introduce && (
          <p className="prose-p text-muted-foreground">{tag?.introduce}</p>
        )}
      </div>

      <div className="space-y-4 p-4">
        {poems.map((poem) => (
          <Section poem={poem} key={poem.id} />
        ))}
      </div>

      <footer className="mb-4 mt-8 flex h-16 justify-between p-4">
        <Button
          variant="ghost"
          className={cn("flex items-center", { "!opacity-0": page <= 1 })}
          asChild={page > 1}
          disabled
        >
          <Link
            href={`/tag/list/${id}?page=${page - 1}`}
            className="flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" strokeWidth={1} />
            上一页
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={cn("flex items-center", { "opacity-0": !hasNext })}
          asChild={hasNext}
        >
          <Link
            href={`/tag/list/${id}?page=${page + 1}`}
            className="flex items-center"
          >
            下一页 <ChevronRight className="ml-2 h-4 w-4" strokeWidth={1} />
          </Link>
        </Button>
      </footer>
    </>
  );
}
