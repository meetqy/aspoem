import { notFound } from "next/navigation";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import { type Sort } from "~/types";

import SortTabs from "./sort-tabs";
import Section from "../../components/section";
import { Pagination } from "~/components/pagination";
import {
  type Locale,
  getDictionary,
  getMetaDataAlternates,
} from "~/dictionaries";
import { type Metadata } from "next";
import { stringFormat } from "~/utils";

interface Props {
  params: { page: string; lang: Locale };
  searchParams?: { sort: Sort };
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const pageIndex = Number(params.page);
  const dict = await getDictionary(params.lang);

  if (pageIndex < 1 || isNaN(pageIndex)) notFound();

  let text = "";
  let description = "";
  if (searchParams?.sort === "createdAt" || !searchParams?.sort) {
    text = dict.poem_list.tab_new;
    description = dict.poem_list.description_improve;
  } else if (searchParams?.sort === "improve") {
    text = dict.poem_list.tab_improve;
    description = dict.poem_list.description_new;
  }

  return {
    title: stringFormat(dict.poem_list.title_meta, [
      text,
      pageIndex.toString(),
    ]),
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
            <span className="text-f200">{dict.poem_list.title}</span>
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
