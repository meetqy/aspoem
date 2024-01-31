import { Album, ChevronRight, InfoIcon, TwitterIcon } from "lucide-react";
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
  return `${poem.title}@${poem.author.name}·${poem.author.dynasty} 拼音、注解、译文（白话文）- 现代化中国诗词学习网站`;
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
    `${poem.author.name}的诗词`,
    `${poem.author.dynasty}朝诗人：${poem.author.name}`,
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
            className="bg-gradient-to-tr from-foreground via-muted-foreground/50 to-accent-foreground bg-clip-text no-underline"
            style={{
              WebkitTextFillColor: "transparent",
            }}
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
                align={
                  ["词", "骈文"].includes(poem.genre ?? "") ? "left" : "center"
                }
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
                >
                  {item.type && <Album className="mr-1 h-4 w-4 opacity-70" />}
                  {item.name}
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
          <Button asChild>
            <Link
              href={`https://twitter.com/intent/tweet?text=${title} https://aspoem.com/poem/${poem.id}`}
              target="_blank"
            >
              <TwitterIcon className="mr-2 h-6 w-6" /> 分享到 Twitter
            </Link>
          </Button>

          {/* <Button asChild>
            <Link
              href={`https://www.pinterest.com/pin/create/button/?url=https://aspoem.com/poem/${poem.id}&title=${title}`}
              target="_blank"
            >
              <svg
                className="mr-2 h-6 w-6 fill-current"
                viewBox="0 0 1920 1920"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1368.619 1166.432c-90.774 96.64-206.614 142.4-334.614 132.8-95.573-7.253-220.053-73.707-221.333-74.347l-63.787-34.24-13.76 71.04c-37.653 193.6-82.346 334.827-181.653 439.787-11.627-214.613 38.933-400.213 88-580.48 20.587-75.52 41.813-153.707 58.027-232.213l4.16-20.374-10.774-17.813c-50.88-84.267-35.946-233.6 31.254-313.387 25.28-30.186 53.44-45.12 85.226-45.12 14.614 0 29.974 3.2 46.187 9.494 68.587 26.773 62.187 92.8 9.813 265.173-34.88 114.773-70.933 233.387-18.986 320.213 27.093 45.227 74.133 74.774 139.946 87.787 146.56 28.693 276.054-39.573 355.307-188.16 98.987-185.387 101.973-486.827-51.307-640.107-168.32-168.106-443.733-199.04-670.08-75.306-201.706 110.293-298.56 308.586-252.906 517.44 20.16 91.946-16.64 136.533-41.28 155.306-58.56-45.973-62.187-170.24-58.347-277.013 11.84-321.6 295.253-525.76 556.16-554.453 320.427-35.414 669.12 103.253 715.627 436.586 32.106 230.294-34.88 472.64-170.88 617.387m276.48-632.107C1595.712 180.62 1245.312-41.14 812.139 6.432c-305.174 33.6-637.014 275.2-650.987 656.64-5.973 162.027 6.613 335.253 144.96 391.467l19.52 7.893 19.52-7.467c60.587-23.146 164.907-113.386 126.4-289.173-35.733-163.2 39.04-313.067 199.893-401.067 151.36-82.773 386.027-100.053 543.467 57.28 106.667 106.667 121.92 346.987 32.64 514.347-39.893 74.773-113.813 158.72-240.533 133.76-52.587-10.453-65.067-31.147-69.12-37.973-27.627-46.187 2.666-146.134 29.546-234.347 44.374-146.133 99.734-328.213-73.066-395.627-94.08-36.586-185.707-12.373-251.947 66.347-91.307 108.48-112.853 294.4-51.52 417.813-14.72 68.587-33.067 135.787-52.373 206.72-59.414 218.134-120.854 443.734-80.854 723.52l12.48 86.934 71.36-51.094c165.12-118.08 235.627-281.706 284.374-503.253 52.8 22.933 130.133 51.093 200 56.427 162.133 12.16 306.88-45.227 420.48-166.08 157.226-167.467 235.2-444.16 198.72-705.174"
                  fill-rule="evenodd"
                />
              </svg>
              分享到 Pinterest
            </Link>
          </Button> */}
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
