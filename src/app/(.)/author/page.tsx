import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { cn } from "~/utils";

export default async function AuthorPage({
  params,
}: {
  params?: { page: string };
}) {
  if (params && Number(params.page) <= 1) {
    return redirect("/author");
  }

  const {
    data,
    page = 1,
    hasNext,
  } = await api.author.timeline.query({
    page: Number(params?.page ?? 1),
    pageSize: 12,
  });

  if (!data || data.length === 0) {
    return notFound();
  }

  return (
    <>
      <div className="m-auto grid max-w-screen-md grid-cols-1 gap-4 py-4">
        {data?.map((item) => (
          <div
            key={item.id}
            className="relative cursor-pointer overflow-hidden rounded-md border border-border p-8 transition-all hover:bg-accent hover:shadow-lg"
          >
            <Link
              href={`/author/${item.id}`}
              className="absolute left-0 top-0 h-full w-full"
            />
            <div className="flex items-center">
              <div className="flex h-36 w-36 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted/40 uppercase text-muted-foreground/40 shadow"></div>
              <div className="flex-1 pl-8">
                <h1 className="text-5xl font-bold uppercase text-foreground">
                  {item.name}
                  <span className="ml-2 font-mono text-lg font-normal capitalize text-foreground/80">
                    {item.namePinYin}
                  </span>
                </h1>
                <p className="mt-2 line-clamp-2 text-muted-foreground">
                  {item.introduce || "暂未完善"}
                </p>
              </div>
            </div>

            <div className="my-8 flex justify-center">
              <div className="h-[1px] w-36 bg-muted"></div>
            </div>

            <div className="grid w-full grid-cols-3">
              <div className="flex flex-col items-center justify-center border-r border-border/40">
                <span className="font-mono text-2xl font-bold text-blue-500">
                  {item._count.poems}
                </span>
                <span className="text-sm text-muted-foreground">作品</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-bold">
                  {item.birthDate && item.deathDate
                    ? item.deathDate - item.birthDate
                    : "?"}
                </span>
                <span className="text-sm text-muted-foreground">享年</span>
              </div>
            </div>
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
