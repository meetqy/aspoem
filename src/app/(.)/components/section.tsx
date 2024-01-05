import { type Author, type Poem } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";

export default function Section({ poem }: { poem: Poem & { author: Author } }) {
  const content = poem.content.split("\n");

  return (
    <section className="block cursor-pointer rounded-md border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="font-bold">
          <Link
            href={`/poem/${poem.id}?lt=${poem.title}`}
            className="underline-animation text-xl font-semibold"
          >
            {poem.title}
          </Link>

          <span className="ml-2 font-light">
            <Link
              href={`/author/${poem.authorId}?lt=${poem.author.name}`}
              className="font-bold text-blue-700 transition-all hover:text-blue-700/70 hover:underline"
            >
              <span className="font-serif">@</span>
              {poem.author.name}
            </Link>
            {poem.author.dynasty && (
              <>
                <span className="mx-1">·</span>
                <span>{poem.author.dynasty}</span>
              </>
            )}
          </span>
        </div>

        {poem.updatedAt ? (
          <span className="text-sm font-normal text-muted-foreground">
            更新时间：
            <span className="font-mono text-xs">
              {format(poem.updatedAt, "yyyy-MM-dd")}
            </span>
          </span>
        ) : (
          <span className="text-sm font-normal text-muted-foreground">
            创建时间：
            <span className="font-mono text-xs">
              {poem.createdAt && format(poem.createdAt, "yyyy-MM-dd")}
            </span>
          </span>
        )}
      </div>

      <div className="mt-2 text-muted-foreground">
        {content.slice(0, 4).map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      {content.length > 8 && (
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">......</p>
        </div>
      )}
    </section>
  );
}
