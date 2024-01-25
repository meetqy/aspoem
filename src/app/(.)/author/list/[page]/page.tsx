import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import { cn } from "~/utils";

export default async function AuthorPage({
  params,
}: {
  params?: { page: string };
}) {
  const {
    data,
    page = 1,
    hasNext,
  } = await api.author.findMany.query({
    page: Number(params?.page ?? 1),
    pageSize: 12,
  });

  if (!data || data.length === 0) {
    return notFound();
  }

  return (
    <>
      <HeaderMain>
        <div className="flex h-16 flex-1 items-center justify-between pl-4">
          <span className="text-2xl font-bold">诗人</span>
        </div>
      </HeaderMain>
      <div className="m-auto grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        {data?.map((item) => (
          <div
            className="relative flex h-36 cursor-pointer flex-col justify-between rounded-md border border-border p-4 transition-all hover:bg-muted hover:shadow-md"
            key={item.id}
          >
            <Link
              href={`/author/${item.id}`}
              className="absolute left-0 top-0 h-full w-full"
            ></Link>
            <div className="flex w-full items-center justify-between text-2xl font-bold">
              {item.name}
              <div className="flex items-center font-mono text-lg font-normal text-blue-500">
                {item?._count.poems}
              </div>
            </div>

            <p className="line-clamp-2 text-muted-foreground">
              {item.introduce || "暂未完善"}
            </p>
          </div>
        ))}
      </div>

      <footer className="mb-4 mt-8 flex h-16 justify-between">
        <Button
          variant="ghost"
          className={cn("flex items-center", { "!opacity-0": page <= 1 })}
          asChild={page > 1}
          disabled
        >
          <Link href={`/author/list/${page - 1}`} className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" strokeWidth={1} />
            上一页
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={cn("flex items-center", { "opacity-0": !hasNext })}
          asChild={hasNext}
        >
          <Link href={`/author/list/${page + 1}`} className="flex items-center">
            下一页 <ChevronRight className="ml-2 h-4 w-4" strokeWidth={1} />
          </Link>
        </Button>
      </footer>
    </>
  );
}
