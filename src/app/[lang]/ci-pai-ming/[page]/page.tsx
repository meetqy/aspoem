import { PieChart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pagination } from "~/components/pagination";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import {
  getDictionary,
  getLangUrl,
  getMetaDataAlternates,
  type Locale,
} from "~/dictionaries";
import { type Metadata } from "next";
import { cache } from "react";
import { stringFormat } from "~/utils";

interface Props {
  params: { page: string; lang: Locale };
}

const getItem = cache(({ params }: Props) => {
  const pageIndex = Number(params.page || 1);
  if (pageIndex < 1 || isNaN(pageIndex)) notFound();

  return api.tag.findCiPaiMing.query({
    select: ["name", "introduce", "_count"],
    page: pageIndex,
    pageSize: 12,
    lang: params.lang,
  });
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { params } = props;
  const dict = await getDictionary(params.lang);
  const { data, page } = await getItem(props);

  return {
    title: stringFormat(dict.ci_pai_ming.title_meta, [page.toString()]),
    alternates: getMetaDataAlternates(`/ci-pai-ming/${page}`, params.lang),
    description: dict.ci_pai_ming.description,
    keywords: data.map((item) => item.name),
  };
}

export default async function Page(props: Props) {
  const { params } = props;
  const dict = await getDictionary(params.lang);

  const { data, hasNext, page } = await getItem(props);

  return (
    <>
      <HeaderMain>
        <div className="px-4">
          <span className="text-f200">{dict.menu.ci_pai_ming}</span>
        </div>
      </HeaderMain>

      <div className="p-4">
        <header>
          <h1 className="text-f400">
            {dict.menu.ci_pai_ming}
            <span className="ml-1 font-mono text-f200 text-muted-foreground">
              cí pái míng
            </span>
          </h1>
          <p className="mt-6 text-f100 text-secondary-foreground">
            {dict.ci_pai_ming.description}
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 space-y-4">
          {data.map((item, i) => (
            <section
              key={i}
              className="group relative cursor-pointer justify-between rounded-md border border-border bg-card p-4 text-card-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md"
            >
              <div className="flex justify-between">
                <div className="w-full text-f200 lg:w-3/5">
                  <Link
                    href={getLangUrl(`/tag/${item.id}`, params.lang)}
                    className="underline-animation relative z-10 flex-1 text-primary"
                  >
                    {item.name}
                  </Link>
                </div>

                <div className="mt-1 flex font-mono text-xs text-muted-foreground/50">
                  <PieChart className="mr-1 h-4 w-4" />
                  <span>{item._count.poems}</span>
                </div>
              </div>

              <p className="mt-2 text-f50 text-muted-foreground">
                {item.introduce}
              </p>

              <Link
                href={getLangUrl(`/tag/${item.id}`, params.lang)}
                title="查看详情"
                className="pointer-events-auto absolute left-0 top-0 h-full w-full"
              />
            </section>
          ))}
        </div>
      </div>

      <Pagination
        dict={dict}
        page={page}
        hasNext={hasNext}
        prefixUrl={`/${params.lang}/ci-pai-ming`}
      />
    </>
  );
}
