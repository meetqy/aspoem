import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import styles from "./page.module.css";
import { ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import BackButton from "~/app/_components/BackButton";

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

export default async function Page({ params }: { params: { id: string } }) {
  const poem = await api.poem.findById.query(Number(params.id));

  if (!poem) {
    return notFound();
  }

  const titlePinYin = poem.titlePinYin?.split(" ") ?? [];

  const contentPinYin = poem.contentPinYin?.split("\n") ?? [];

  return (
    <div className="relative min-h-full">
      <div className="breadcrumbs sticky top-0 z-50 flex items-center rounded-t-box bg-base-100/80 px-4 text-sm backdrop-blur">
        <BackButton />
        <div className="mx-5 leading-none text-base-content/50">|</div>
        <ul>
          <li>
            <Link href={"/"}>全部</Link>
          </li>
          <li>
            <Link href={`/poem/${poem.id}?lt=${poem.title}`}>{poem.title}</Link>
          </li>
        </ul>
      </div>

      <article className="prose prose-2xl relative m-auto h-full pb-4 pt-8 text-center prose-p:text-3xl">
        <div className={`${styles.title} text-stroke-base-100`}>
          <h1>{poem.title}</h1>
        </div>

        <h1 className={`${styles.title2} text-stroke-base-100`}>
          <ruby>
            {poem.title.split("").map((char, index) => {
              return (
                <RubyChar key={index} char={char} pinyin={titlePinYin[index]} />
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
  );
}
