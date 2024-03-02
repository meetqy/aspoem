import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import Section from "~/app/[lang]/components/section";
import { type Locale, getDictionary } from "~/dictionaries";
import { Pagination } from "~/components/pagination";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";

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
    page,
    pageSize: 12,
  });

  return {
    ...result,
    id,
  };
});

export async function generateMetadata(props: Props) {
  const { tag, page } = await getItem(props);

  return {
    title: `关于${tag?.type || "其他"}“${tag?.name}”的诗词 第${page}页`,
  };
}

export default async function Page(props: Props) {
  const { data: poems, tag, hasNext, page, id } = await getItem(props);
  const { lang } = props.params;

  const dict = await getDictionary(lang);

  if (!tag) notFound();

  if (poems.length < 1) {
    notFound();
  }

  return (
    <>
      <HeaderMain>
        <div className="flex h-16 items-center px-4">
          <nav className="flex items-center space-x-1 text-muted-foreground">
            <Link href="/tag" className="flex-shrink-0">
              标签
            </Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" strokeWidth={1} />

            <Link
              href={tag.type === "词牌名" ? `/ci-pai-ming` : `/tag#${tag.type}`}
              className="flex-shrink-0"
            >
              {tag.type || "其他"}
            </Link>

            <ChevronRight className="h-4 w-4 flex-shrink-0" strokeWidth={1} />
            <Link
              className="line-clamp-1 text-foreground"
              href={`tag/${tag.id}/1`}
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

        <div className="mt-8 space-y-4">
          {poems.map((poem) => (
            <Section poem={poem} key={poem.id} lang={lang} />
          ))}
        </div>
      </div>

      <Pagination
        page={page}
        dict={dict}
        hasNext={hasNext}
        prefixUrl={`tag/${id}`}
      />
    </>
  );
}
