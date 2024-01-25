import { HeaderMain } from "~/components/ui/header";
import SortTabs from "./components/sort-tabs";
import { api } from "~/trpc/server";
import { notFound, redirect } from "next/navigation";
import { type Sort } from "~/types";
import Section from "./components/section";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "~/utils";

export default async function IndexPage({
  params,
  searchParams,
}: {
  params?: { page: string };
  searchParams?: { sort: Sort };
}) {
  const toHref = (href: string) => {
    if (searchParams?.sort) {
      return `${href}?sort=${searchParams?.sort}`;
    }

    return href;
  };

  if (params && Number(params.page) <= 1) {
    return redirect(toHref(`/`));
  }

  const {
    data: poems,
    page,
    hasNext,
  } = await api.poem.find.query({
    page: Number(params?.page ?? 1) || 1,
    pageSize: 12,
    sort: searchParams?.sort,
  });

  if (!poems || poems.length === 0) {
    return notFound();
  }

  return (
    <>
      <HeaderMain>
        <div className="flex h-16 flex-1 items-center justify-between pl-4">
          <div className="flex h-full flex-1 items-center justify-between">
            <span className="text-2xl font-bold">诗词</span>
            <div className="hidden items-center lg:flex">
              <SortTabs sort={searchParams?.sort} />
              <span className="mx-2 text-muted-foreground/40">|</span>
            </div>
          </div>
        </div>
      </HeaderMain>

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
            href={toHref(`/list/${page - 1}`)}
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
            href={toHref(`/list/${page + 1}`)}
            className="flex items-center"
          >
            下一页 <ChevronRight className="ml-2 h-4 w-4" strokeWidth={1} />
          </Link>
        </Button>
      </footer>
    </>
  );
}
