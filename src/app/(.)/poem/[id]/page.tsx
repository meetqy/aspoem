import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderMain } from "~/components/ui/header";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";
import PinYinText from "./components/PinYinText";
import Back from "~/components/ui/back";
import { type Metadata } from "next";
import { cache } from "react";
import dynamic from "next/dynamic";

type Props = {
  params: { id: string };
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

export default async function Page({ params }: Props) {
  const poem = await getItem(params.id);

  const contentPinYin = poem.contentPinYin?.split("\n") ?? [];

  return (
    <>
      <HeaderMain>
        <div className="flex h-16 items-center px-4">
          <Back />

          <Separator orientation="vertical" className="mx-4 h-4" />

          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground">
              全部
            </Link>
            <ChevronRight className="h-4 w-4" strokeWidth={1} />
            <Link href={`/poem/${poem.id}`}>{poem.title}</Link>
          </nav>
        </div>
      </HeaderMain>

      <article className="p-8 text-center">
        <PinYinText
          text={poem.title}
          pinyin={poem.titlePinYin ?? ""}
          type="h1"
          outline
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

        {poem.content.split("\n").map((line, index) => {
          const linePinYin = contentPinYin[index];

          return (
            <PinYinText
              className="mt-6"
              key={index}
              text={line}
              pinyin={linePinYin}
            />
          );
        })}
      </article>

      <article className="chinese mt-8 px-4">
        <h2 id="#译文" prose-h2="" className="text-left">
          译文
        </h2>

        <p
          prose-p=""
          dangerouslySetInnerHTML={{
            __html: (poem.translation ?? "暂未完善").replaceAll("\n", "<br/>"),
          }}
        />

        <h2 id="#畅所欲言" prose-h2="" className="mt-8">
          畅所欲言
        </h2>
        <p prose-p="">
          不同的年龄、成长环境、经历，都会有不同的看法，没有标准答案。
          <br />
          欢迎留下你的随想！👏🏻👏🏻👏🏻
        </p>

        <div className="mt-12">
          <MyGiscus />
        </div>
      </article>

      <footer className="h-16"></footer>
    </>
  );
}
