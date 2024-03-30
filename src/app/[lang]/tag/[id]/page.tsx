import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  type Locale,
  getDictionary,
  getLangText,
  getLangUrl,
  getMetaDataAlternates,
} from "~/dictionaries";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import { type Metadata } from "next";
import { cn } from "~/utils";
import { Button } from "~/components/ui/button";

interface Props {
  params: { id: string; lang: Locale };
}

const getItem = cache(async ({ params }: Props) => {
  const id = Number(params.id);

  const result = await api.tag.findStatisticsById.query({
    id,
    lang: params.lang,
  });

  if (!result) notFound();

  const data = result.data;

  const json: Record<string, (typeof data)[number][]> = {};
  data.forEach((item) => {
    const key = item.author.id;

    if (!json[key]) {
      json[key] = [];
    }

    json[key]!.push(item);
  });

  const statistics = Object.entries(json)
    .map(([_, value]) => value)
    .sort((a, b) => b.length - a.length);

  return {
    ...result,
    json,
    statistics,
  };
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { tag, total, statistics } = await getItem(props);

  const first = statistics[0]![0];

  return {
    title: getLangText(
      {
        "zh-Hans": `${tag.type || "其他"}/${tag.name}诗词 共${total}首 诗人${
          statistics.length
        }位`,
        "zh-Hant": `${tag.type || "其他"}/${tag.name}詩詞 共${total}首 詩人${
          statistics.length
        }位`,
      },
      props.params.lang,
    ),
    description: getLangText(
      {
        "zh-Hans": `${tag.type || "其他"}/${
          tag.name
        }，共收录了 ${total} 首诗词，诗人 ${
          statistics.length
        } 位。 其中，最多的诗人是 ${first!.author.name}，共创作了 ${
          statistics[0]!.length
        } 首诗词。`,
        "zh-Hant": `${tag.type || "其他"}/${
          tag.name
        }，共收錄了 ${total} 首詩詞，詩人 ${
          statistics.length
        } 位。 其中，最多的詩人是 ${first!.author.name}，共創作了 ${
          statistics[0]!.length
        } 首詩詞。`,
      },
      props.params.lang,
    ),
    alternates: getMetaDataAlternates(`/tag/${tag.id}`, props.params.lang),
  };
}

export default async function TagDetailPage(props: Props) {
  const { total, tag, json, statistics } = await getItem(props);
  const { lang } = props.params;

  const dict = await getDictionary(lang);

  const rank = statistics.map((item) => item[0]!.author.id);

  const max = statistics[0]?.length || 0;
  const first = statistics[0]![0];

  return (
    <>
      <HeaderMain>
        <div className="flex h-16 items-center px-4">
          <nav className="flex items-center space-x-1 text-muted-foreground">
            <Link href={getLangUrl("/tag", lang)} className="flex-shrink-0">
              {dict.menu.tag}
            </Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" strokeWidth={1} />

            <Link
              href={getLangUrl(
                /词牌名|詞牌名/.test(tag?.type ?? "")
                  ? `/ci-pai-ming`
                  : `/tag#${tag.type}`,
                lang,
              )}
              className="flex-shrink-0"
            >
              {tag.type || "其他"}
            </Link>

            <ChevronRight className="h-4 w-4 flex-shrink-0" strokeWidth={1} />
            <Link
              className="line-clamp-1 text-foreground"
              href={getLangUrl(`tag/${tag.id}`, lang)}
            >
              {tag.name}
            </Link>
          </nav>
        </div>
      </HeaderMain>

      <main className="mt-4 p-4">
        <h1 className="prose-h1">{tag.name}</h1>
        <p className="prose-p">{tag.introduce}</p>

        <div className="mt-8 space-y-4">
          <div className="rounded-md border border-border p-4">
            <h2 className="prose-h2">统计</h2>
            <p className="prose-p text-muted-foreground">
              共收录了{" "}
              <span className="font-mono font-medium text-primary">
                {total}
              </span>{" "}
              首诗，诗人{" "}
              <span className="font-mono font-medium text-primary">
                {statistics.length}
              </span>{" "}
              位。 其中，最多的诗人是{" "}
              <b className="text-primary">{first?.author.name}</b>
              ，共有{" "}
              <span className="font-mono font-medium text-primary">
                {max}
              </span>{" "}
              首诗。
            </p>

            <div className="mt-6 grid h-72 grid-cols-5 gap-4 md:grid-cols-10">
              {statistics.slice(0, 10).map((item, index) => {
                const poem = item[0]!;

                return (
                  <div
                    key={poem.author.id}
                    className={cn("flex h-full w-full flex-col", {
                      "hidden md:flex": index > 4,
                    })}
                  >
                    <div className="relative m-auto w-4/5 flex-1">
                      <div
                        className={cn(
                          "absolute bottom-0 left-0 -z-10 flex w-full items-start justify-center bg-primary py-2 font-mono text-f50 font-bold text-primary-foreground",
                        )}
                        style={{ minHeight: (item.length / max) * 100 + "%" }}
                      >
                        {item.length}
                      </div>
                    </div>
                    <div className="flex aspect-square h-8 flex-shrink-0 items-end justify-center text-f50">
                      {poem.author.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <div className="mt-8 flex flex-wrap justify-between px-4">
        {rank.map((key) => {
          const item = json[key]!;
          const author = item[0]!.author;

          return (
            <div key={key} className={cn("mb-12 w-full")}>
              <h2 className={"prose-h2"}>
                <Link href={getLangUrl(`/author/${author.id}`, lang)}>
                  {author.name}{" "}
                  <span className="ml-2 font-mono text-[50%] text-muted-foreground">
                    {author.namePinYin}
                  </span>
                </Link>
              </h2>
              <div className="prose-p flex flex-wrap gap-4 px-4 lg:px-0">
                {item?.map((poem) => (
                  <Button
                    key={poem.id}
                    variant={"secondary"}
                    className="line-clamp-1 block w-min max-w-sm truncate text-f50 md:max-w-full"
                    asChild
                  >
                    <Link
                      href={getLangUrl(`/poem/${poem.id}`, lang)}
                      title={poem.title}
                    >
                      {poem.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <footer className="h-12"></footer>
    </>
  );
}
