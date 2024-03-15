import { type Author, type Poem } from "@prisma/client";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "~/utils";
import { type Locale } from "~/dictionaries";

export default function Section({
  poem,
  lang,
}: {
  poem: Poem & { author: Author };
  lang: Locale;
}) {
  const content = poem.content.split("\n");

  return (
    <section className="group relative cursor-pointer justify-between rounded-md border border-border bg-card p-4 text-card-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md">
      <div className="flex justify-between">
        <div className="w-full lg:w-3/5">
          <Link
            href={`/${lang}/poem/${poem.id}`}
            className="underline-animation text-f200 relative z-10 flex-1 text-primary"
          >
            {poem.title}
          </Link>
        </div>

        <div className="mt-1.5 flex font-mono text-xs font-normal text-muted-foreground/50">
          <EyeIcon className="mr-1 h-4 w-4" />
          <span>{poem.views}</span>
        </div>
      </div>

      <div className={cn("!text-f50 text-secondary-foreground")}>
        <span>{poem.author.dynasty}</span> ·
        <Link
          href={`/${lang}/author/${poem.authorId}`}
          className="relative z-10 hover:underline"
        >
          {poem.author.name}
        </Link>
      </div>

      <div className="text-f50 mt-2 line-clamp-2 text-muted-foreground">
        {content.slice(0, 2).map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      <Link
        href={`/${lang}/poem/${poem.id}`}
        title="查看详情"
        className="pointer-events-auto absolute left-0 top-0 h-full w-full"
      />
    </section>
  );
}
