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

const Twikoo = dynamic(() => import("./components/twikoo"), {
  ssr: false,
});

const SaveShareButton = dynamic(() => import("./components/xhs"), {
  ssr: false,
});

type Props = {
  params: { id: string };
  searchParams: { py?: string };
};

const getItem = cache(async (id: string) => {
  const poem = await api.poem.findById.query(Number(id));

  if (!poem) {
    return notFound();
  }

  return poem;
});

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const poem = await getItem(params.id);

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
    twitter: {
      images: `/api/og/poem/${params.id}`,
    },
    openGraph: {
      images: `/api/og/poem/${params.id}`,
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const poem = await getItem(params.id);

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
              <Link href="/" className="flex-shrink-0" replace>
                诗词
              </Link>
              <ChevronRight className="h-4 w-4 flex-shrink-0" strokeWidth={1} />
              <span className="line-clamp-1 w-28 overflow-hidden text-foreground md:w-auto">
                {poem.title}
              </span>
            </nav>
          </div>

          <div>
            {showPinYin ? (
              <Button size={"xs"} aria-label="不显示拼音" asChild>
                <Link href="?" replace>
                  拼音
                </Link>
              </Button>
            ) : (
              <Button
                size={"xs"}
                variant="secondary"
                aria-label="显示拼音"
                className={cn(!isShi && "hidden", "md:inline-flex")}
                asChild
              >
                <Link href="?py=t" replace>
                  拼音
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

        <h2 id="#译文" prose-h2="" className="text-left">
          译文
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

        <h2 id="#分享" prose-h2="">
          分享
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

        <h2 id="#更多探索" className="prose-h2 mb-6">
          更多探索
        </h2>

        <More
          authorId={poem.authorId}
          tagIds={poem.tags.map((item) => item.id)}
        />

        <h2 id="#畅所欲言" prose-h2="">
          畅所欲言
        </h2>
        <p prose-p="">
          不同的年龄、成长环境、经历，都会有不同的看法，没有标准答案。
          <br />
          欢迎留下你的随想！👏🏻👏🏻👏🏻
        </p>
        <p prose-p="">
          <InfoIcon className="-mt-1 mr-2 inline-block text-blue-500" />
          发现错误，也可以在下方留言，指正哦！
        </p>

        <div className="mt-12">
          <Twikoo />
        </div>
      </article>

      <footer className="h-16"></footer>
    </>
  );
}
