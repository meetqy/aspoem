"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { api } from "~/trpc/react";

export const More = ({
  authorId,
  tagIds,
}: {
  authorId: number;
  tagIds: number[];
}) => {
  const { data: poems } = api.poem.findByAuthorId.useQuery({
    authorId,
    pageSize: 4,
    page: 1,
    select: ["title", "content"],
  });

  const tagIds_0 = tagIds[0];

  const { data: tagPoems } = api.poem.findByTagId.useQuery(
    {
      id: tagIds_0!,
      pageSize: 4,
    },
    {
      enabled: !!tagIds_0,
    },
  );

  const allData = (poems?.data ?? []).concat(tagPoems?.data ?? []);

  const data = useMemo(() => {
    const resultArray: typeof allData = [],
      itemIds: { [key in number]: boolean } = {};

    allData.forEach((item) => {
      if (!itemIds[item.id]) {
        itemIds[item.id] = true;
        resultArray.push(item);
      }
    });

    return resultArray;
  }, [allData]);

  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {data.map((item) => (
        <div
          key={item.id}
          className="cursor-pointer rounded-md border border-border p-4 transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md"
          onClick={() => {
            router.push(`/poem/${item.id}`);
          }}
        >
          <span className="line-clamp-1 text-lg">
            {item.content.split("\n")[0]}
          </span>
          <div className="mt-4 line-clamp-1 text-end text-muted-foreground">
            —— {item.author.dynasty}·{item.author.name}《
            <span>{item.title}</span>》
          </div>
        </div>
      ))}
    </div>
  );
};
