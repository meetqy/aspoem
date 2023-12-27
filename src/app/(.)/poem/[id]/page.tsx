import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import styles from "./page.module.css";

export default async function Page({ params }: { params: { id: string } }) {
  const poem = await api.poem.findById.query(Number(params.id));

  if (!poem) {
    return notFound();
  }

  return (
    <div className="relative h-full min-h-full">
      <Link
        href={`/create?id=${poem.id}`}
        className="btn btn-circle absolute right-4 top-4"
      >
        <PencilSquareIcon className="h-6 w-6" />
      </Link>

      <article className="prose prose-2xl relative m-auto h-full text-center">
        <div className={`${styles.title} text-stroke-base-100`}>
          <h1>{poem.title}</h1>
        </div>

        <div className="h-8"></div>

        <h1 className={`${styles.title2} text-stroke-base-100`}>
          {poem.title}
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
          {poem.content.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
