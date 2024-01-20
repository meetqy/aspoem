import { ChevronRight, InfoIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import PinYinText from "./components/PinYinText";
import { type Metadata } from "next";
import { cache } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils";
import dynamic from "next/dynamic";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const poem = await getItem(params.id);

  const { dynasty } = poem.author;

  const keywords = [poem.title, poem.author.name];

  if (dynasty) {
    keywords.push(dynasty);
  }

  return {
    title: `${poem.title}@${poem.author.name}${dynasty ? `·${dynasty}` : ""}`,
    description: `《${
      poem.title
    }》拼音、注释、白话文。${poem.introduce?.substring(0, 50)}`,
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

  const contentPinYin = poem.contentPinYin?.split("\n") ?? [];
  const showPinYin = searchParams.py === "t" ? true : false;
  const blockArray = poem.content.split("\n");

  // 最大行的字数 大于 18个字 就缩进
  const retract = blockArray.find((item) => item.length > 18);

  const annotation = JSON.parse(poem.annotation ?? "{}") as {
    [key in string]: string;
  };

  poem.introduce =
    "传入旅舍的捣衣声，应和着孤城城头的画角，一片秋声在广阔的天地间回荡。归去的燕子向东从海上飞走，南来的大雁自空中落下，栖息在沙滩上。这儿有楚王携宋玉游兰台时感受到的惬意的凉风，有庾亮与殷浩辈在南楼吟咏戏谑时的大好月色，清风明月的景象，还都与当年一样。";

  return (
    <>
      <HeaderMain>
        <div className="flex flex-1 items-center justify-between">
          <div className="flex h-16 items-center px-4">
            <nav className="flex items-center space-x-2">
              <Link href="/" className="text-muted-foreground">
                全部
              </Link>
              <ChevronRight className="h-4 w-4" strokeWidth={1} />
              <Link href={`/poem/${poem.id}`}>{poem.title}</Link>
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
        <PinYinText
          text={poem.title}
          pinyin={showPinYin ? poem.titlePinYin ?? "" : ""}
          type="h1"
        />
        <h2
          prose-h2=""
          className={cn(
            "mt-6 !border-0",
            showPinYin ? "mb-12" : "mb-6",
            "transition-all",
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
        </h2>

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
              align={poem.genre === "词" ? "left" : "center"}
              retract={retract ? true : false}
              pinyin={showPinYin ? blockPinYin : ""}
              annotation={annotation}
            />
          );
        })}
      </article>

      <article className="chinese mt-8">
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

        <h2 id="#畅所欲言" prose-h2="" className="mt-8">
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
