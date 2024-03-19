import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { type Locale, getDictionary, getLangUrl } from "~/dictionaries";
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

  const result = await api.tag.findById.query({
    id,
    lang: params.lang,
  });

  if (!result) notFound();

  return result;
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { tag } = await getItem(props);
  const dict = await getDictionary(props.params.lang);

  const keywords = dict.point_keywords;

  if (tag?.name) keywords.push(tag.name);
  if (tag?.type) keywords.push(tag.type);

  return {
    // title: getLangText(
    //   {
    //     "zh-Hans": `关于${tag?.type || "其他"}“${tag?.name}”的诗词 第${page}页`,
    //     "zh-Hant": `關於${tag?.type || "其他"}“${tag?.name}”的詩詞 第${page}頁`,
    //   },
    //   props.params.lang,
    // ),
    // description: tag?.introduce,
    // alternates: getMetaDataAlternates(
    //   `/tag/${tag?.id}/${page}`,
    //   props.params.lang,
    // ),
    // keywords,
  };
}

export default async function TagDetailPage(props: Props) {
  const { data, total, tag } = await getItem(props);
  const { lang } = props.params;

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
        {rank.slice(0, 10).map((key) => {
          const item = json[key]!;
          const author = item[0]!.author;

          return (
            <div
              key={key}
              className={cn("mb-12 w-full", { "w-[48%]": item.length < 6 })}
            >
              <h3 className={cn("prose-h1 !border-none")}>
                {author.name}{" "}
                <span className="ml-2 font-mono text-2xl font-normal capitalize text-muted-foreground">
                  {author.namePinYin}
                </span>
              </h3>
              <ul
                className={cn(
                  "prose-p grid list-disc grid-cols-3 gap-4 rounded-md bg-secondary p-4 text-secondary-foreground",
                  {
                    "grid-cols-1": item.length < 6,
                  },
                )}
              >
                {item?.map((poem) => (
                  <Link
                    href={getLangUrl(`/author/${poem.id}`, lang)}
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
