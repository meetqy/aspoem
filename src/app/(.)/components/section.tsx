import { type Author, type Poem } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "~/utils";

export default function Section({ poem }: { poem: Poem & { author: Author } }) {
  const content = poem.content.split("\n");

  const Author = ({ className }: { className?: string }) => {
    return (
      <span className={cn("font-light", className)}>
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
    );
  };

  return (
    <section className="group relative block cursor-pointer rounded-md border border-border bg-card p-4 text-card-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md">
      <div className="flex justify-between">
        <div className="w-full font-bold lg:w-3/5">
          <Link
            href={`/poem/${poem.id}`}
            className="underline-animation relative z-10 flex-1 text-xl font-semibold"
          >
            {poem.title}
          </Link>

          <Author className="ml-2" />
        </div>

        <div className="hidden flex-shrink-0 pt-1 text-sm font-normal text-muted-foreground lg:flex">
          {poem.updatedAt ? (
            <span>
              更新时间：
              <span className="font-mono text-xs">
                {format(poem.updatedAt, "yyyy-MM-dd")}
              </span>
            </span>
          ) : (
            <span>
              创建时间：
              <span className="font-mono text-xs">
                {poem.createdAt && format(poem.createdAt, "yyyy-MM-dd")}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 line-clamp-2 group-hover:text-accent-foreground">
        {content.slice(0, 2).map((line, index) => (
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
