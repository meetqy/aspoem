import { cn } from "~/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Dictionary } from "~/dictionaries";

interface Props {
  page: number;
  hasNext: boolean;
  prefixUrl: string;
  params?: string;
  dict: Dictionary;
}

export const Pagination = ({
  page,
  hasNext,
  prefixUrl,
  params,
  dict,
}: Props) => {
  const prev = `${prefixUrl}/${page - 1 < 1 ? 1 : page - 1}`;
  const next = `${prefixUrl}/${page + 1}`;

  return (
    <footer
      className={cn(
        "mb-4 mt-8 flex h-16 justify-between p-4",
        page === 1 && !hasNext && "hidden",
      )}
    >
      <Button
        variant="ghost"
        className={cn("flex items-center")}
        asChild={page > 1}
        disabled
      >
        <Link
          href={params ? `${prev}?${params}` : prev}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" strokeWidth={1} />
          {dict.pagination.prev}
        </Link>
      </Button>

      <Button
        variant="ghost"
        className={cn("flex items-center")}
        asChild={hasNext}
        disabled
      >
        <Link
          href={params ? `${next}?${params}` : next}
          className="flex items-center"
        >
          {dict.pagination.next}
          <ChevronRight className="ml-2 h-4 w-4" strokeWidth={1} />
        </Link>
      </Button>
    </footer>
  );
};
