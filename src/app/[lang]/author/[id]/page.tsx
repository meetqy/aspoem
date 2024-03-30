import { CalendarIcon, ChevronRight, LinkIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import Poems from "./components/poems";
import { Button } from "~/components/ui/button";
import { getDictionary, getLangText, type Locale } from "~/dictionaries";

type Props = {
  params: { id: string; lang: Locale };
  searchParams?: { tab: "relations" };
};

export const revalidate = 3600;

const getItem = cache(async ({ id }: Props["params"]) => {
  const author = await api.author.findById.query(Number(id));

  if (!author) {
    notFound();
  }

  return author;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getItem(params);

  const keywords = [author.name];

  if (author.dynasty) {
    keywords.push(author.dynasty);
  }

  const title = getLangText(
    {
      "zh-Hans": `${author.dynasty}·${author.name}的诗词全集、诗集(共${author._count.poems}首)`,
      "zh-Hant": `${author.dynasty}·${author.name}的詩詞全集、詩集(共${author._count.poems}首)`,
    },
    params.lang,
  );

  const description = getLangText(
    {
      "zh-Hans": `${author.name}(${author.namePinYin})，${author.dynasty}代著名诗人，那${author.name}的代表作有哪些呢？${author.name}一生又创作了多少诗词呢？那就跟着我一起来学习${author.name}的诗词吧！`,
      "zh-Hant": `${author.name}(${author.namePinYin})，${author.dynasty}代著名詩人，那${author.name}的代表作有哪些呢？${author.name}一生又創作了多少詩詞呢？那就跟著我一起來學習${author.name}的詩詞吧！`,
    },
    params.lang,
  );

  return {
    title,
    description,
    keywords: [
      author.name,
      getLangText(
        {
          "zh-Hans": `学习${author.name}的诗词`,
          "zh-Hant": `學習${author.name}的詩詞`,
        },
        params.lang,
      ),
      getLangText(
        {
          "zh-Hans": `${author.name}的代表作`,
          "zh-Hant": `${author.name}的代表作`,
        },
        params.lang,
      ),
    ],
  };
}

export default async function Page({ params, searchParams }: Props) {
  const dict = getDictionary(params.lang);

  const author = await getItem(params);

  return (
    <>
      <HeaderMain>
        <div className="flex h-16 items-center px-4">
          <nav className="flex items-center space-x-1 text-muted-foreground">
            <Link href={`/${params.lang}/author`}>
              {(await dict).author_detail.title}
            </Link>
            <ChevronRight className="h-4 w-4" strokeWidth={1} />
            <span className="line-clamp-1 text-foreground">{author.name}</span>
          </nav>
        </div>
      </HeaderMain>

      <header className="rounded-box m-auto flex max-w-screen-sm px-4 py-8">
        <Avatar className="hidden h-36 w-36 md:block">
          <AvatarFallback>
            <span className="text-3xl">{author.name}</span>
          </AvatarFallback>
        </Avatar>

        <div className="text-left md:ml-16">
          <h1 prose-h1="">
            <span>{author.name}</span>{" "}
            <span className="font-mono text-f100 font-normal !tracking-tighter text-muted-foreground">
              {author.namePinYin}
            </span>
          </h1>
          <p className="mt-4 line-clamp-3 text-f100 text-secondary-foreground">
            {author.introduce}
          </p>
          <div className="mt-8 text-f50">
            <p className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span className="ml-2">
                <span className="text-f50">{author.birthDate ?? "?"}</span>年
                <span className="mx-2 text-muted-foreground">~</span>
                <span className="text-f50">{author.deathDate ?? "?"}</span>年
              </span>
            </p>
            <p className="mt-2 flex items-center">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
              <Link
                href={`https://zh.wikipedia.org/wiki/${author.name}`}
                target="_blank"
                className="ml-2 text-blue-600 hover:underline"
              >
                维基百科/{author.name}
              </Link>
            </p>
            <div className="mt-8 space-x-4 text-f50">
              <Button variant={"secondary"}>{author.dynasty}朝</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full md:mt-8">
        {!searchParams?.tab && (
          <Poems lang={params.lang} authorId={author.id} />
        )}
      </main>

      <footer className="h-16"></footer>
    </>
  );
}
