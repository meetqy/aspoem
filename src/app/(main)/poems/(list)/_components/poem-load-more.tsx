"use client";

import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { PoemListItem } from "./poem-list-item";

interface PoemLoadMoreProps {
  nextCursor?: string;
  queryKey: "getRecommendedList" | "getLatestList" | "getHotList";
}

export const PoemLoadMore = ({ nextCursor, queryKey }: PoemLoadMoreProps) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0,
  });

  const query = api.poem[queryKey].useInfiniteQuery(
    {
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: nextCursor,
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

  const items = query.data?.pages.flatMap((page) => page.items) || [];

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
