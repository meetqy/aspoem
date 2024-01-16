import { ChevronRight, InfoIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import PinYinText from "./components/PinYinText";
import { type Metadata } from "next";
import { cache } from "react";
import dynamic from "next/dynamic";
import { Button } from "~/components/ui/button";

type Props = {
  params: { id: string };
  searchParams: { py?: string };
};

const MyGiscus = dynamic(() => import("./components/my-giscus"), {
  ssr: false,
});

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
    description: `${poem.content.substring(0, 100)} `,
    keywords,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const poem = await getItem(params.id);

  const contentPinYin = poem.contentPinYin?.split("\n\n") ?? [];

  const showPinYin = searchParams.py === "t" ? true : false;

  const blockArray = poem.content.split("\n\n");

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

      <article className="p-8 text-center">
        <PinYinText
          text={poem.title}
          pinyin={showPinYin ? poem.titlePinYin ?? "" : ""}
          type="h1"
        />
        <h2 prose-h2="" className="mt-6 !border-0">
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

        <blockquote prose-blockquote="" className="text-left">
          {poem.introduce}
        </blockquote>

        {blockArray.map((block, index) => {
          const blockPinYin = contentPinYin[index];

          return (
            <>
              {blockArray.length > 1
                ? index > 0 && (
                    <p key={index} prose-p="" className="pinyin pinyin_p">
                      <span data-text></span>
                    </p>
                  )
                : null}

              {block.split("\n").map((line, index) => (
                <PinYinText
                  className="mt-6"
                  key={index}
                  text={line}
                  pinyin={showPinYin ? blockPinYin?.split("\n")[index] : ""}
                />
              ))}
            </>
          );
        })}
      </article>

      <article className="chinese mt-8 px-4">
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
          <MyGiscus />
        </div>
      </article>

      <footer className="h-16"></footer>
    </>
  );
}
