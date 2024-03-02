import { notFound } from "next/navigation";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import { type Sort } from "~/types";

import SortTabs from "../../components/sort-tabs";
import Section from "../../components/section";
import { Pagination } from "~/components/pagination";
import { type Locale, getDictionary } from "~/dictionaries";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { page: string };
}): Promise<Metadata> {
  const pageIndex = Number(params.page);

  if (pageIndex < 1 || isNaN(pageIndex)) notFound();

  return {
    title: `诗词列表 第${pageIndex}页`,
    alternates: {
      languages: {
        "zh-Hans": `/zh-Hans/list/${pageIndex}`,
        "zh-Hant": `/zh-Hant/list/${pageIndex}`,
      },
    },
  };
}

export default async function IndexPage({
  params,
  searchParams,
}: {
  params: { page: string; lang: Locale };
  searchParams?: { sort: Sort };
}) {
  const dict = await getDictionary(params.lang);
  const pageIndex = Number(params.page);

  if (pageIndex < 1 || isNaN(pageIndex)) notFound();

  const {
    data: poems,
    page,
    hasNext,
  } = await api.poem.find.query({
    page: pageIndex,
    pageSize: 12,
    sort: searchParams?.sort ?? "createdAt",
  });

  if (!poems || poems.length === 0) {
    notFound();
  }

  return (
    <>
      <HeaderMain>
        <div className="flex h-16 flex-1 items-center justify-between pl-4">
          <div className="flex h-full flex-1 items-center justify-between">
            <span className="text-2xl font-bold">{dict.poem_list.title}</span>
            <div className="hidden items-center lg:flex">
              <SortTabs sort={searchParams?.sort} dict={dict} />
              <span className="mx-2 text-muted-foreground/40">|</span>
            </div>
          </div>
        </div>
      </HeaderMain>

      <div className="space-y-4 p-4">
        {poems.map((poem) => (
          <Section poem={poem} key={poem.id} lang={params.lang} />
        ))}
      </div>

      <Pagination
        page={page}
        hasNext={hasNext}
        prefixUrl={`/${params.lang}/list`}
        params={searchParams?.sort && `sort=${searchParams?.sort}`}
        dict={dict}
      />
    </>
  );
}
