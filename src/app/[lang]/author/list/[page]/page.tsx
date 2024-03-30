import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale, getDictionary } from "~/dictionaries";
import { Pagination } from "~/components/pagination";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { page: string; lang: Locale };
}): Promise<Metadata> {
  const pageIndex = Number(params.page);

  if (pageIndex < 1 || isNaN(pageIndex)) notFound();

  return {
    title: `诗人列表 第${pageIndex}页`,
    alternates: {
      languages: {
        "zh-Hans": `/zh-Hans/author/list/${params.page}`,
        "zh-Hant": `/zh-Hant/author/list/${params.page}`,
      },
      canonical: `${params.lang}/author/list/${params.page}`,
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: { page: string; lang: Locale };
}) {
  const dict = await getDictionary(params.lang);
  const pageIndex = Number(params.page);

  if (pageIndex < 1 || isNaN(pageIndex)) notFound();

  const {
    data,
    page = 1,
    hasNext,
  } = await api.author.findMany.query({
    page: pageIndex,
    pageSize: 12,
  });

  if (!data || data.length === 0) {
    notFound();
  }

  return (
    <>
      <HeaderMain>
        <div className="flex h-16 flex-1 items-center justify-between pl-4">
          <span className="text-f200">{dict.author.title}</span>
        </div>
      </HeaderMain>
      <div className="m-auto grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        {data?.map((item) => (
          <div
            className="relative flex h-32 cursor-pointer flex-col justify-between rounded-md border border-border p-4 transition-all hover:bg-muted hover:shadow-md"
            key={item.id}
          >
            <Link
              href={`/${params.lang}/author/${item.id}`}
              className="absolute left-0 top-0 h-full w-full"
            ></Link>
            <div className="flex w-full items-center justify-between text-f200">
              <span className="text-primary">{item.name}</span>
              <span className="font-mono text-sm font-normal  text-muted-foreground">
                {item?._count.poems}
              </span>
            </div>

            <p className="line-clamp-2 text-f50 text-muted-foreground">
              {item.introduce || "暂未完善"}
            </p>
          </div>
        ))}
      </div>

      <Pagination
        dict={dict}
        page={page}
        hasNext={hasNext}
        prefixUrl={`/${params.lang}/author/list`}
      />
    </>
  );
}
