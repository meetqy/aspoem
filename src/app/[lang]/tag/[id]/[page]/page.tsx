import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import Section from "~/app/[lang]/components/section";
import {
  type Locale,
  getDictionary,
  getLangUrl,
  getMetaDataAlternates,
  getLangText,
} from "~/dictionaries";
import { Pagination } from "~/components/pagination";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import { type Metadata } from "next";

interface Props {
  params: { page: string; id: string; lang: Locale };
}

const getItem = cache(async ({ params }: Props) => {
  const id = Number(params.id);
  const page = Number(params.page);

  if (isNaN(id) || isNaN(page) || page < 1) {
    notFound();
  }

  const result = await api.poem.findByTagId.query({
    id,
    lang: params.lang,
  });

  if (!result) notFound();

  return {
    ...result,
    id,
  };
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { tag, page } = await getItem(props);
  const dict = await getDictionary(props.params.lang);

  const keywords = dict.point_keywords;

  if (tag?.name) keywords.push(tag.name);
  if (tag?.type) keywords.push(tag.type);

  return {
    title: getLangText(
      {
        "zh-Hans": `关于${tag?.type || "其他"}“${tag?.name}”的诗词 第${page}页`,
        "zh-Hant": `關於${tag?.type || "其他"}“${tag?.name}”的詩詞 第${page}頁`,
      },
      props.params.lang,
    ),
    description: tag?.introduce,
    alternates: getMetaDataAlternates(
      `/tag/${tag?.id}/${page}`,
      props.params.lang,
    ),
    keywords,
  };
}

export default async function TagDetailPage(props: Props) {
  const { data: poems, tag, hasNext, page, id } = await getItem(props);
  const { lang } = props.params;

  const dict = await getDictionary(lang);

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
        <header>
          <h1 className="prose-h1">{tag?.name}</h1>
          {tag?.introduce && <p className="prose-p">{tag?.introduce}</p>}
        </header>



        {/* <div className="mt-8 space-y-4">
          {poems.map((poem) => (
            <Section poem={poem} key={poem.id} lang={lang} />
          ))}
        </div> */}
      </div>

      {/* <Pagination
        page={page}
        dict={dict}
        hasNext={hasNext}
        prefixUrl={getLangUrl(`/tag/${id}`, lang)}
      /> */}
    </>
  );
}
