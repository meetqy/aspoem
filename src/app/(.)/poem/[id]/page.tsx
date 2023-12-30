import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import styles from "./page.module.css";

const RubyChar = ({ char, pinyin }: { char: string; pinyin?: string }) => {
  if (/\./.test(pinyin ?? "")) {
    pinyin = "";
  }

  return (
    <>
      <span className={`${pinyin ? "px-2" : ""}`}>{char}</span>
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
      <Link
        href={`/create?id=${poem.id}`}
        className="btn btn-circle absolute right-4 top-4"
      >
        <PencilSquareIcon className="h-6 w-6" />
      </Link>

      <article className="prose prose-2xl relative m-auto h-full text-center prose-p:text-3xl">
        <div className={`${styles.title} text-stroke-base-100`}>
          <h1>{poem.title}</h1>
        </div>

        <div className="h-8"></div>

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
                      <RubyChar key={i} char={char} pinyin={charPinYin?.[i]} />
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
