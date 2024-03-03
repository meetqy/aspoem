import { PieChart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pagination } from "~/components/pagination";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import { getDictionary, type Locale } from "~/dictionaries";
import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `词牌名列表`,
    alternates: {
      languages: {
        "zh-Hans": "/zh-Hans/ci-pai-ming",
        "zh-Hant": "/zh-Hant/ci-pai-ming",
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: { page: string; lang: Locale };
}) {
  const dict = await getDictionary(params.lang);
  const pageIndex = Number(params.page || 1);

  if (pageIndex < 1 || isNaN(pageIndex)) notFound();

  const { data, hasNext, page } = await api.tag.findMany.query({
    type: "词牌名",
    select: ["name", "introduce", "count"],
    page: pageIndex,
    pageSize: 12,
  });

  return (
    <>
      <HeaderMain>
        <div className="px-4">
          <span className="text-2xl font-bold">词牌名</span>
        </div>
      </HeaderMain>

      <div className="p-4">
        <header>
          <h1 className="prose-h1">
            词牌名
            <span className="ml-1 font-mono text-xl font-normal text-muted-foreground">
              cí pái míng
            </span>
          </h1>
          <p className="prose-p text-secondary-foreground">
            词的一种制式曲调的名称，亦即唐宋时代经常用以填词的大致固定的一部分乐曲的原名，有固定的格式与声律，决定着词的节奏与音律。
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 space-y-4">
          {data.map((item, i) => (
            <section
              key={i}
              className="group relative cursor-pointer justify-between rounded-md border border-border bg-card p-4 text-card-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md"
            >
              <div className="flex justify-between">
                <div className="w-full font-bold lg:w-3/5">
                  <Link
                    href={`/${params.lang}/tag/${item.id}/1`}
                    className="underline-animation prose-h3 relative z-10 flex-1 text-primary"
                  >
                    {item.name}
                  </Link>
                </div>

                <div className="mt-1 flex font-mono text-xs font-normal text-muted-foreground/50">
                  <PieChart className="mr-1 h-4 w-4" />
                  <span>{item._count.poems}</span>
                </div>
              </div>

              <p className="mt-2 text-muted-foreground">{item.introduce}</p>

              <Link
                href={`/${params.lang}/tag/${item.id}/1`}
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
