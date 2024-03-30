"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { cn } from "~/utils";
import { Button } from "~/components/ui/button";
import "./poems.css";
import { type Locale } from "~/dictionaries";

export default function Poems({
  authorId,
  lang,
}: {
  authorId: number;
  lang: Locale;
}) {
  const { data } = api.poem.findByAuthorId.useQuery({
    authorId,
    pageSize: 9999,
  });

  const poems = data?.data ?? [];

  const json: { [key in string]: NonNullable<typeof poems> } = {};

  for (const poem of poems) {
    const firstLetter = (poem.titlePinYin ?? "")
      .padEnd(1, "#")[0]!
      .toLocaleUpperCase();

    const temp = json[firstLetter] ?? [];
    temp.push(poem);
    json[firstLetter] = temp;
  }

  // Sort by letter a -> z, '#' last
  const letters = Object.keys(json).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });

  const colors = [
    "text-blue-500",
    "text-yellow-500",
    "text-purple-500",
    "text-green-500",
    "text-pink-500",
    "text-indigo-500",
    "text-teal-500",
    "text-cyan-500",
    "text-lime-500",
    "text-orange-500",
  ];

  return (
    <div className="mt-8 w-full space-y-8 md:px-4">
      {letters.map((char, i) => {
        const poems = json[char];
        const textColor = colors[i % colors.length]!;

        return (
          <div key={char}>
            <h2
              className={cn(textColor, "tag-group__title")}
              prose-h2=""
              id={`#author-${char === "#" ? "other" : char}`}
            >
              {char}
              <span className="text-base font-normal text-muted-foreground">
                ({poems?.length})
              </span>
            </h2>
            <div prose-p="" className="flex flex-wrap gap-4 px-4 lg:px-0">
              {poems?.map((poem) => {
                return (
                  <Button
                    key={poem.id}
                    variant={"secondary"}
                    className="line-clamp-1 block w-min max-w-sm truncate text-f50 md:max-w-full"
                    asChild
                  >
                    <Link href={`/${lang}/poem/${poem.id}`} title={poem.title}>
                      {poem.title}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
