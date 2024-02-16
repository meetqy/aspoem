import { type Author, type Poem } from "@prisma/client";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
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
    <section className="group relative flex cursor-pointer flex-col justify-between rounded-md border border-border bg-card p-4 text-card-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md sm:flex-row">
      <div className="flex-1">
        <div className="w-full font-bold lg:w-3/5">
          <Link
            href={`/poem/${poem.id}`}
            className="underline-animation relative z-10 flex-1 text-xl"
          >
            {poem.title}
          </Link>

          <Author className="ml-2" />
        </div>

        <div className="mt-2 line-clamp-2 group-hover:text-accent-foreground">
          {content.slice(0, 2).map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-shrink-0 justify-end pt-1 font-mono text-sm font-normal text-muted-foreground/50 sm:mt-0 sm:w-24">
        <EyeIcon className="mr-1 h-5 w-5" />
        <span>{poem.views}</span>
      </div>

      <Link
        href={`/poem/${poem.id}`}
        title="查看详情"
        className="pointer-events-auto absolute left-0 top-0 h-full w-full"
      ></Link>
    </section>
  );
}
