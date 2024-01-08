"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { cn } from "~/utils";
import styles from "./poems.module.css";

export default function Poems({ authorId }: { authorId: number }) {
  const { data } = api.poem.findByAuthorId.useQuery({
    authorId,
    pageSize: 9999,
  });

  const poems = data?.data;

  const colors = [
    "blue",
    "yellow",
    "purple",
    "green",
    "pink",
    "indigo",
    "teal",
    "cyan",
    "lime",
    "orange",
  ];

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {poems?.map((poem, i) => {
        const bg = colors[i % colors.length];

        return (
          <Link
            href={`/poem/${poem.id}`}
            key={poem.id}
            title={poem.title}
            className={cn(
              "flex rounded-md px-4 py-2 text-xl transition-all",
              bg && styles[bg],
            )}
          >
            {poem.title}
          </Link>
        );
      })}
    </div>
  );
}
