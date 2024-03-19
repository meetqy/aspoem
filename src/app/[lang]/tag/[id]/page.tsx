import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  type Locale,
  getDictionary,
  getLangUrl,
  getMetaDataAlternates,
  getLangText,
} from "~/dictionaries";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import { type Metadata } from "next";
import { TagBasic } from "./components/basic";
import { Button } from "~/components/ui/button";

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
  const jsonSum : Record<string, number> = {};
  data.forEach((item) => {
    const key = item.author.id;

    if (!json[key]) {
      json[key] = [];
      jsonSum[key] = 0;
    }

    jsonSum[key] += 1;
    json[key]!.push(item);
  });

  const statistics = Object.entries(json)
    .map(([_, value]) => value)
    .sort((a, b) => b.length - a.length);

  const dict = await getDictionary(lang);

  const authors = [];
  statistics.forEach((item) => {
    authors.push({
      author: item[0]?.author,
      count: item.length,
      data: item,
    });
  });

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
              href={getLangUrl(`tag/${tag.id}/1`, lang)}
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

      <div className="mt-8 space-y-8 px-4">
        {Object.keys(jsonSum).map((key) => {
          const item = json[key];

          return (
            <div key={key} className="rounded-md border border-border p-4">
              <h3 className="prose-h2">{item![0]?.author.name}</h3>
              <ul className="prose-p grid list-disc grid-cols-3 gap-4">
                {item?.map((poem) => (
                  <Link href="/" key={poem.id} className="line-clamp-1">
                    {poem.title}
                  </Link>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
