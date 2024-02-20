import {
  Album,
  BookAIcon,
  ChevronRight,
  InfoIcon,
  MousePointerSquareIcon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import PinYinText from "./components/PinYinText";
import { type Metadata } from "next";
import { cache } from "react";
import { Button } from "~/components/ui/button";
import { MyHost, cn } from "~/utils";
import dynamic from "next/dynamic";
import { type Article, type WithContext } from "schema-dts";

const Twikoo = dynamic(() => import("./components/twikoo"), {
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

const getTitle = (poem: Awaited<ReturnType<typeof getItem>>) => {
  return `${poem.title}-${poem.author.dynasty}·${poem.author.name} 拼音、注解、译文（白话文）`;
};

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
    title: getTitle(poem),
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

  const title = getTitle(poem);

  const contentPinYin = poem.contentPinYin?.split("\n") ?? [];
  const showPinYin = searchParams.py === "t" ? true : false;
  const blockArray = poem.content.split("\n");

  // 最大行的字数 大于 18个字 就缩进
  const retract = blockArray.find((item) => item.length > 18);

  const annotation = JSON.parse(poem.annotation ?? "{}") as {
    [key in string]: string;
  };

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(addJsonLd()) }}
      />

      <HeaderMain>
        <div className="flex flex-1 items-center justify-between">
          <div className="flex h-16 items-center px-4">
            <nav className="flex items-center space-x-2">
              <Link href="/" className="flex-shrink-0 text-muted-foreground">
                全部
              </Link>
              <ChevronRight className="h-4 w-4 flex-shrink-0" strokeWidth={1} />
              <Link className="line-clamp-1" href={`/poem/${poem.id}`}>
                {poem.title}
              </Link>
            </nav>
          </div>

          <div className="hidden lg:block">
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
                asChild
              >
                <Link href="?py=t" replace>
                  拼音
                </Link>
              </Button>
            )}
            <span className="mx-2 text-muted-foreground/40">|</span>
          </div>
        </div>
      </HeaderMain>

      <article className="py-8 text-center">
        {/* 标题 */}
        <PinYinText
          text={poem.title}
          pinyin={showPinYin ? poem.titlePinYin ?? "" : ""}
          type="h1"
          className="px-4"
        />

        <p
          className={cn(
            "mt-4 !border-0 md:mt-6",
            showPinYin ? "mb-12" : "mb-6",
            "md:prose-h2 prose-h3 transition-all",
          )}
        >
          {poem.author.dynasty && (
            <span className="font-light">{poem.author.dynasty} · </span>
          )}

          <Link
            href={`/author/${poem.author.id}`}
            className="underline-animation font-light"
          >
            {poem.author.name}
          </Link>
        </p>

        <div className="px-4 md:px-0">
          {poem.introduce && (
            <blockquote
              prose-blockquote=""
              className={cn(
                "bg-muted/70 py-2 text-left text-lg !not-italic text-muted-foreground transition-all",
                showPinYin ? "mb-12" : "mb-6",
              )}
            >
              {poem.introduce}
            </blockquote>
          )}

          {/* 内容 */}
          {blockArray.map((line, index) => {
            const blockPinYin = contentPinYin[index];

            return (
              <PinYinText
                key={index}
                text={line}
                align={poem.genre != "诗" ? "left" : "center"}
                retract={retract ? true : false}
                pinyin={showPinYin ? blockPinYin : ""}
                annotation={annotation}
              />
            );
          })}
        </div>
      </article>

      <article className="chinese mt-8 px-4">
        {poem.tags.length > 0 && (
          <div className="mt-12 flex justify-start space-x-2">
            {poem.tags.map((item) => {
              return (
                <Button
                  variant={"secondary"}
                  key={item.id}
                  className={cn("text-base")}
                  asChild
                >
                  <Link href={`/tag/list/${item.id}?page=1`}>
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

          <Button asChild variant={"outline"}>
            <Link
              href={`/api/og/xhs/${poem.id}`}
              target="_blank"
              title={`${getTitle(poem)} 小红书风格预览图`}
            >
              <BookAIcon className="mr-2 h-6 w-6 text-destructive" />
              分享到小红书
            </Link>
          </Button>
        </p>

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
