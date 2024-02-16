import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import Section from "./components/section";
import { Button } from "~/components/ui/button";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import { cn } from "~/utils";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "AsPoem",
};

export default async function IndexPage({
  params,
}: {
  params?: { page: string };
}) {
  const pageIndex = Number(params?.page ?? 1);

  if (pageIndex < 1 || isNaN(pageIndex)) return notFound();

  const { data: poems } = await api.poem.find.query({
    page: pageIndex,
    pageSize: 24,
    sort: "updatedAt",
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
              <Button variant={"secondary"} size={"sm"} asChild>
                <Link href="/list/1">全部诗词</Link>
              </Button>
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
        <Button variant="ghost" asChild className={cn("flex items-center")}>
          <Link href={"/list/1"} className="flex items-center">
            <ChevronsRight className="mr-2 h-5 w-5" strokeWidth={1} /> 全部诗词
          </Link>
        </Button>
      </footer>
    </>
  );
}
