import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import styles from "./page.module.css";
import BackButton from "~/app/_components/BackButton";
import Aside from "~/app/_components/Aside";
import { InboxIcon, UserIcon } from "@heroicons/react/24/outline";
import { type Metadata } from "next";

const RubyChar = ({
  char,
  pinyin,
  className = "px-2",
}: {
  char: string;
  pinyin?: string;
  className?: string;
}) => {
  if (/\./.test(pinyin ?? "")) {
    pinyin = "";
  }

  return (
    <>
      <span className={`${pinyin ? className : ""}`}>{char}</span>
      {
        <>
          <rp>(</rp>
          <rt>{pinyin}</rt>
          <rp>)</rp>
        </>
      }
    </>
  );
};

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const poem = await api.poem.findById.query(Number(params.id));

  if (!poem) {
    return notFound();
  }

  return {
    title: `${poem.title}: ${poem.author.name} | AsPoem`,
    description: `${poem.content.substring(0, 100)} `,
    keywords: [poem.title, poem.author.name],
  };
}

export default async function Page({ params }: Props) {
  const poem = await api.poem.findById.query(Number(params.id));

  if (!poem) {
    return notFound();
  }

  const titlePinYin = poem.titlePinYin?.split(" ") ?? [];

  const contentPinYin = poem.contentPinYin?.split("\n") ?? [];

  return (
    <>
      <div className="main-wrapper">
        <header className="sticky top-0 z-50 rounded-t-box px-4 backdrop-blur">
          <div className="breadcrumbs flex items-center text-sm">
            <BackButton />
            <div className="mx-5 leading-none text-base-content/50">|</div>
            <ul>
              <li>
                <Link href={"/"}>全部</Link>
              </li>
              <li>
                <Link href={`/poem/${poem.id}?lt=${poem.title}`}>
                  {poem.title}
                </Link>
              </li>
            </ul>
          </div>
        </header>

        <article className="prose prose-2xl relative m-auto pb-4 pt-8 text-center prose-p:text-3xl">
          <div className={`${styles.title} text-stroke-base-100`}>
            <h1>{poem.title}</h1>
          </div>

          <h1 className={`${styles.title2} text-stroke-base-100`}>
            <ruby>
              {poem.title.split("").map((char, index) => {
                return (
                  <RubyChar
                    key={index}
                    char={char}
                    pinyin={titlePinYin[index]}
                  />
                );
              })}
            </ruby>
          </h1>

          <p>
            {poem.author.dynasty && (
              <span className="font-light">{poem.author.dynasty} · </span>
            )}
            <span
              className="bg-gradient-to-tr from-primary via-current to-secondary bg-clip-text"
              style={{
                WebkitTextFillColor: "transparent",
              }}
            >
              {poem.author.name}
            </span>
          </p>

          <div className="tracking-widest">
            {poem.content.split("\n").map((line, index) => {
              const linePinYin = contentPinYin[index];
              const charPinYin = linePinYin?.split(" ");

              return (
                <p key={index}>
                  <ruby>
                    {line.split("").map((char, i) => {
                      return (
                        <RubyChar
                          className="px-1.5"
                          key={i}
                          char={char}
                          pinyin={charPinYin?.[i]}
                        />
                      );
                    })}
                  </ruby>
                </p>
              );
            })}
          </div>
        </article>
      </div>

      <Aside>
        <div className="join absolute bottom-4 left-0 flex w-full px-4">
          <Link
            href={`/create/author?id=${poem.authorId}`}
            className="btn join-item flex-1"
          >
            <UserIcon className="h-4 w-4" />
            作者
          </Link>

          <Link href={`/create?id=${poem.id}`} className="btn join-item flex-1">
            <InboxIcon className="h-4 w-4" />
            作品
          </Link>
        </div>
      </Aside>
    </>
  );
}
