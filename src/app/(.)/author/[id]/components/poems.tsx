"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function Poems({ authorId }: { authorId: number }) {
  const { data } = api.poem.findByAuthorId.useQuery({ authorId });

  const poems = data?.data;
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {poems?.map((poem) => {
        return (
          <div
            onClick={() => router.push(`/poem/${poem.id}`)}
            key={poem.id}
            className="relative cursor-pointer overflow-hidden rounded-md border border-border/40 bg-gradient-to-br from-background to-muted p-4"
          >
            <h1 prose-h2="" className="border-none !pb-0">
              {poem.title}
            </h1>
            <p
              prose-p=""
              className="line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: poem.content.replace(/\n/g, "<br />"),
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
