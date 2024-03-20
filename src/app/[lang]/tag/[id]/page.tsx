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
import { TagBasic } from "./components/basic";
import { cn } from "~/utils";

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

      <div className="p-4">
        <h1 className="prose-h1 mb-8">{tag.name}</h1>
        <TagBasic data={statistics} tag={tag} total={total} />
      </div>

      <div className="mt-12 flex flex-wrap justify-between px-4">
        {rank.map((key) => {
          const item = json[key]!;
          const author = item[0]!.author;

          return (
            <div
              key={key}
              className={cn("mb-12 w-full", { "lg:w-[48%]": item.length < 6 })}
            >
              <h3 className={cn("prose-h1 !border-none")}>
                <Link href={getLangUrl(`/author/${author.id}`, lang)}>
                  {author.name}{" "}
                  <span className="ml-2 font-serif text-[50%] font-normal capitalize text-muted-foreground">
                    {author.namePinYin}
                  </span>
                </Link>
              </h3>
              <ul
                className={cn(
                  "prose-p grid list-disc grid-cols-2 gap-4 rounded-md bg-secondary p-4 text-secondary-foreground lg:grid-cols-3",
                  {
                    "lg:grid-cols-1": item.length < 6,
                  },
                )}
              >
                {item?.map((poem) => (
                  <Link
                    href={getLangUrl(`/poem/${poem.id}`, lang)}
                    key={poem.id}
                    className="line-clamp-1 hover:underline"
                  >
                    {poem.title}
                  </Link>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <footer className="h-12"></footer>
    </>
  );
}
