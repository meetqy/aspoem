"use client";

import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import type { ApiPoemListItems } from "@/server/api/router/poem";
import type { RouterInputs } from "@/trpc/react";
import { api } from "@/trpc/react";
import { PoemListItem } from "./poem-list-item";

type QueryKey =
  | "getRecommendedList"
  | "getLatestList"
  | "getHotList"
  | "getLatestListByDynasty";

interface PoemLoadMoreProps<T extends QueryKey> {
  nextCursor?: string;
  queryKey: T;
  queryParams?: Omit<RouterInputs["poem"][T], "cursor" | "limit">;
}

export const PoemLoadMore = <T extends QueryKey>({
  nextCursor,
  queryKey,
  queryParams,
}: PoemLoadMoreProps<T>) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0,
  });

  const query = (api.poem[queryKey] as any).useInfiniteQuery(
    {
      limit: 20,
      ...queryParams,
    },
    {
      getNextPageParam: (lastPage: { nextCursor?: string }) =>
        lastPage.nextCursor,
      initialCursor: nextCursor,
      enabled: !!nextCursor,
    },
  );

  useEffect(() => {
    if (isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [
    isIntersecting,
    query.hasNextPage,
    query.isFetchingNextPage,
    query.fetchNextPage,
  ]);

  const items: ApiPoemListItems =
    query.data?.pages.flatMap(
      (page: { items: ApiPoemListItems }) => page.items,
    ) || [];

  return (
    <section>
      <div className="space-y-4">
        {items.map((poem) => (
          <PoemListItem key={poem.id} poem={poem} />
        ))}
      </div>

      {query.hasNextPage && (
        <div className="mt-12 flex justify-center" ref={ref}>
          <Button
            size="lg"
            variant="secondary"
            disabled={query.isFetchingNextPage}
            onClick={() => query.fetchNextPage()}
          >
            {query.isFetchingNextPage ? "加载中..." : "加载更多..."}
          </Button>
        </div>
      )}
    </section>
  );
};
