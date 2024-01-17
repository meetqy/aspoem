import { type Author, type Poem } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";

export default function Section({ poem }: { poem: Poem & { author: Author } }) {
  const content = poem.content.split("\n");

  return (
    <section className="group relative block cursor-pointer rounded-md border border-border bg-card p-4 text-card-foreground hover:bg-accent hover:text-accent-foreground">
      <div className="flex items-center justify-between">
        <div className="font-bold">
          <Link
            href={`/poem/${poem.id}`}
            className="underline-animation relative z-10 text-xl font-semibold"
          >
            {poem.title}
          </Link>

          <span className="ml-2 font-light">
            <Link
              href={`/author/${poem.authorId}`}
              className="relative z-10 font-bold text-blue-700 transition-all hover:text-blue-700/70 hover:underline dark:text-blue-500 hover:dark:text-blue-500/70"
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

      <div className="mt-2 line-clamp-4 group-hover:text-accent-foreground">
        {content.slice(0, 4).map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      <Link
        href={`/poem/${poem.id}`}
        title="查看详情"
        className="pointer-events-auto absolute left-0 top-0 h-full w-full"
      ></Link>
    </section>
  );
}
