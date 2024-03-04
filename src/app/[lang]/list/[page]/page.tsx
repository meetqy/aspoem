import { notFound } from "next/navigation";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import { type Sort } from "~/types";

import SortTabs from "../../components/sort-tabs";
import Section from "../../components/section";
import { Pagination } from "~/components/pagination";
import {
  type Locale,
  getDictionary,
  getLangText,
  getMetaDataAlternates,
} from "~/dictionaries";
import { type Metadata } from "next";

interface Props {
  params: { page: string; lang: Locale };
  searchParams?: { sort: Sort };
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const pageIndex = Number(params.page);

  if (pageIndex < 1 || isNaN(pageIndex)) notFound();

  let text = "";
  let description = "";
  if (searchParams?.sort === "updatedAt" || !searchParams?.sort) {
    text = getLangText({ "zh-Hans": "最新", "zh-Hant": "最新" }, params.lang);
    description = getLangText(
      {
        "zh-Hans": "当前诗词列表按照最近修改时间倒序排列",
        "zh-Hant": "當前詩詞列表按照最近修改時間倒序排列",
      },
      params.lang,
    );
  } else if (searchParams?.sort === "improve") {
    text = getLangText(
      { "zh-Hans": "待完善", "zh-Hant": "待完善" },
      params.lang,
    );
    description = getLangText(
      {
        "zh-Hans":
          "当前诗词列表按照完善程度倒序排列，需要完善的诗词排在最前面。",
        "zh-Hant":
          "當前詩詞列表按照完善程度倒序排列，需要完善的詩詞排在最前面。",
      },
      params.lang,
    );
  }

  return {
    title: getLangText(
      {
        "zh-Hans": `${text}诗词列表 第${pageIndex}页`,
        "zh-Hant": `${text}詩詞列表 第${pageIndex}頁`,
      },
      params.lang,
    ),
    description,
    alternates: getMetaDataAlternates(`/list/${pageIndex}`, params.lang),
  };
}

export default async function IndexPage({ params, searchParams }: Props) {
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
    lang: params.lang,
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
