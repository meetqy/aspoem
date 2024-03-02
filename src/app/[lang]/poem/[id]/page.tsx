import { Album, ChevronRight, InfoIcon, TwitterIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import { type Metadata } from "next";
import { cache } from "react";
import { Button } from "~/components/ui/button";
import { MyHost, cn } from "~/utils";
import dynamic from "next/dynamic";
import { type Article, type WithContext } from "schema-dts";
import { getPoemTitle } from "./utils";
import { Body } from "./components/body";
import { More } from "./components/more";
import { getDictionary, type Locale } from "~/dictionaries";

const AutoHant = dynamic(() => import("./components/auto-hant"), {
  ssr: false,
});

const Twikoo = dynamic(() => import("./components/twikoo"), {
  ssr: false,
});

const SaveShareButton = dynamic(() => import("./components/xhs"), {
  ssr: false,
});

type Props = {
  params: { id: string; lang: Locale };
  searchParams: { py?: string };
};

const getItem = cache(async ({ id, lang }: Props["params"]) => {
  const poem = await api.poem.findById.query({
    id: Number(id),
    lang,
  });

  if (!poem) {
    notFound();
  }

  return poem;
});

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const poem = await getItem(params);

  const { dynasty } = poem.author;

  const keywords = [
    poem.title,
    poem.author.name,
    `${poem.title}拼音版`,
    `${poem.title}注解版`,
    `${poem.title}译文（白话文）`,
    `${poem.author.dynasty}·${poem.author.name}的诗词`,
  ];

  if (dynasty) {
    keywords.push(dynasty);
  }

  return {
    title: getPoemTitle(poem),
    description: poem.content.substring(0, 50),
    keywords,
    alternates: {
      languages: {
        "zh-Hans": `/poem/${params.id}`,
        "zh-Hant": `/poem/${params.id}`,
      },
    },
    twitter: {
      images: `/poem/${params.id}/twitter-image`,
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const poem = await getItem(params);
  const dict = await getDictionary(params.lang);

  const title = getPoemTitle(poem);

  const showPinYin = searchParams.py === "t" ? true : false;

  const addJsonLd = (): WithContext<Article> => {
    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: title,
      author: {
        "@type": "Person",
        name: `${poem.author.dynasty}·${poem.author.name}`,
        url: `${MyHost}/author/${poem.author.id}`,
      },
      image: [`${MyHost}/api/og/poem/${poem.id}?f=0`],
    };
  };

  const isShi = poem.genre === "诗";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(addJsonLd()) }}
      />

      <HeaderMain>
        <div className="flex flex-1 items-center justify-between">
          <div className="flex h-16 items-center px-4">
            <nav className="flex items-center space-x-1 text-muted-foreground">
              <Link href="/" className="flex-shrink-0">
                {dict.poem.title}
              </Link>
              <ChevronRight className="h-4 w-4 flex-shrink-0" strokeWidth={1} />
              <span className="line-clamp-1 w-28 overflow-hidden text-foreground md:w-auto">
                {poem.title}
              </span>
            </nav>
          </div>

          <div>
            {showPinYin ? (
              <Button size={"xs"} aria-label={dict.poem.pinyin_hide} asChild>
                <Link href="?" replace>
                  {dict.poem.pinyin}
                </Link>
              </Button>
            ) : (
              <Button
                size={"xs"}
                variant="secondary"
                aria-label={dict.poem.pinyin_show}
                className={cn(!isShi && "hidden", "md:inline-flex")}
                asChild
              >
                <Link href="?py=t" replace>
                  {dict.poem.pinyin}
                </Link>
              </Button>
            )}
            <span
              className={cn(
                "mx-2 text-muted-foreground/40",
                !isShi && "hidden",
                "md:inline-flex",
              )}
            >
              |
            </span>
          </div>
        </div>
      </HeaderMain>

      {/* 正文 */}
      {<Body poem={poem} py={showPinYin} />}

      {/* 标签 */}
      <article className="chinese mt-8 px-4">
        {poem.tags.length > 0 && (
          <div className="mt-12 flex items-center justify-start space-x-2">
            {poem.tags.map((item) => {
              return (
                <Button variant={"secondary"} key={item.id} asChild>
                  <Link href={`/tag/${item.id}/1`}>
                    {item.type === "词牌名" && (
                      <Album className="mr-1 h-4 w-4 opacity-70" />
                    )}
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </div>
        )}

        <h2 id={"#" + dict.poem.translation} prose-h2="" className="text-left">
          {dict.poem.translation}
        </h2>

        {(poem.translation || "暂未完善").split("\n").map((line, index) =>
          line ? (
            <p key={index} prose-p="">
              {line}
            </p>
          ) : (
            <p key={index}>&nbsp;</p>
          ),
        )}

        <h2 id={"#" + dict.poem.share} prose-h2="">
          {dict.poem.share}
        </h2>

        <p prose-p="" className="flex items-center space-x-4">
          <Button asChild variant={"outline"}>
            <Link
              href={`https://twitter.com/intent/tweet?text=${title} https://aspoem.com/poem/${poem.id}`}
              target="_blank"
              className="dark:hidden"
            >
              <TwitterIcon className="mr-2 h-6 w-6 text-blue-500" /> 分享到
              Twitter
            </Link>
          </Button>

          <Button asChild variant={"outline"} className="hidden dark:flex">
            <Link
              href={`https://twitter.com/intent/tweet?text=${title} https://aspoem.com/poem/${poem.id}?dark`}
              target="_blank"
            >
              <TwitterIcon className="mr-2 h-6 w-6 text-blue-500" /> 分享到
              Twitter
            </Link>
          </Button>

          <SaveShareButton data={poem} />
        </p>

        <h2 id={"#" + dict.poem.more} className="prose-h2 mb-6">
          {dict.poem.more}
        </h2>

        <More
          authorId={poem.authorId}
          tagIds={poem.tags.map((item) => item.id)}
          lang={params.lang}
        />

        <h2 id={"#" + dict.poem.comment} prose-h2="">
          {dict.poem.comment}
        </h2>

        <p prose-p="">
          {dict.poem.comment_desc1}
          <b>{dict.poem.comment_desc2}</b>
        </p>

        <h2 id={"#" + dict.poem.report_error} prose-h2="">
          {dict.poem.report_error}
        </h2>
        <p prose-p="">
          <InfoIcon className="-mt-1 mr-2 inline-block text-destructive" />
          {dict.poem.report_error_desc}
        </p>

        <div className="mt-12">
          <Twikoo />
        </div>
      </article>

      <footer className="h-16"></footer>

      <AutoHant poem={poem} />
    </>
  );
}
