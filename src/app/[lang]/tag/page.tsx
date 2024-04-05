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
import { stringFormat } from "~/utils";

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
    title: dict.menu.tag,
    description: stringFormat(dict.tag.description, [keywords.join(",")]),
    alternates: getMetaDataAlternates("/tag", params.lang),
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
                  className="mb-4 mr-4"
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
