import { type Author, type Poem } from "@prisma/client";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "~/utils";

export default function Section({ poem }: { poem: Poem & { author: Author } }) {
  const content = poem.content.split("\n");

  const Author = ({ className }: { className?: string }) => {
    return (
      <div className={cn(className, "text-secondary-foreground")}>
        {poem.author.dynasty && (
          <>
            <span>{poem.author.dynasty}</span>
            <span className="mx-1">·</span>
          </>
        )}

        <Link
          href={`/author/${poem.authorId}`}
          className="relative z-10 hover:underline"
        >
          {poem.author.name}
        </Link>
      </div>
    );
  };

  return (
    <section className="group relative justify-between border-b border-border bg-card p-4 text-card-foreground transition-all">
      <div className="flex justify-between">
        <div className="w-full font-bold lg:w-3/5">
          <Link
            href={`/poem/${poem.id}`}
            className="underline-animation relative z-10 flex-1 text-xl text-primary"
          >
            {poem.title}
          </Link>
        </div>

        <div className="mt-1.5 flex font-mono text-xs font-normal text-muted-foreground/50">
          <EyeIcon className="mr-1 h-4 w-4" />
          <span>{poem.views}</span>
        </div>
      </div>

      <Author className="mt-1" />

      <div className="mt-2 line-clamp-2 text-muted-foreground">
        {content.slice(0, 2).map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </section>
  );
}
