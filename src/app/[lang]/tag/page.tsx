import Link from "next/link";
import { type Metadata } from "next/types";
import { cache } from "react";
import { Button } from "~/components/ui/button";
import { HeaderMain } from "~/components/ui/header";
import {
  getDictionary,
  getLangText,
  getMetaDataAlternates,
  type Locale,
} from "~/dictionaries";
import { api } from "~/trpc/server";

interface Props {
  params: { lang: Locale };
}

const getItem = cache(async ({ params }: Props) => {
  return await api.tag.findMany.query({
    select: ["_count", "name", "type"],
    pageSize: 9999,
    lang: params.lang,
  });
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { params } = props;
  const { data: tags } = await getItem(props);
  const dict = await getDictionary(params.lang);

  const keywords = tags.slice(0, 15).map((item) => item.name);

  return {
    title: getLangText(
      {
        "zh-Hans": "标签",
        "zh-Hant": "標籤",
      },
      params.lang,
    ),
    description: getLangText(
      {
        "zh-Hans": `诗词分类常用标签包括：${keywords.join("，")}等`,
        "zh-Hant": `詩詞分類常用標籤包括：${keywords.join("，")}等`,
      },
      params.lang,
    ),
    alternates: getMetaDataAlternates("/tag", params.lang),
    keywords: keywords.concat(dict.point_keywords),
  };
}

export default async function Page(props: Props) {
  const { data: tags } = await getItem(props);
  const dict = await getDictionary(props.params.lang);

  const types: {
    [key in string]: typeof tags;
  } = {};

  tags.map((item) => {
    const type =
      item.type ||
      getLangText({ "zh-Hans": "其他", "zh-Hant": "其他" }, props.params.lang);

    const temp = types[type] || [];
    temp.push(item);

    types[type] = temp;
  });

  const TagItem = ({ name, data }: { name: string; data?: typeof tags }) => {
    return (
      <div>
        <h2 className="prose-h2" id={`#${name}`}>
          {name}
        </h2>
        <p prose-p="">
          {data?.map(
            (item) =>
              item._count.poems > 0 && (
                <Button
                  key={item.id}
                  variant={"secondary"}
                  className="mb-4 mr-4 text-f50"
                  asChild
                >
                  <Link href={`tag/${item.id}`}>{item.name}</Link>
                </Button>
              ),
          )}
        </p>
      </div>
    );
  };

  return (
    <>
      <HeaderMain>
        <div className="px-4">
          <span className="text-f200">{dict.menu.tag}</span>
        </div>
      </HeaderMain>

      <main className="mt-4 space-y-8 p-4">
        {Object.keys(types).map((item) => (
          <TagItem key={item} name={item} data={types[item]} />
        ))}
      </main>
    </>
  );
}
