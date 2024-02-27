import { cn } from "~/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  hasNext: boolean;
  prefixUrl: string;
  params?: string;
}

export const Pagination = ({ page, hasNext, prefixUrl, params }: Props) => {
  const prev = `${prefixUrl}/${page - 1}`;
  const next = `${prefixUrl}/${page + 1}`;

  return (
    <footer className="mb-4 mt-8 flex h-16 justify-between p-4">
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
          上一页
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
          下一页 <ChevronRight className="ml-2 h-4 w-4" strokeWidth={1} />
        </Link>
      </Button>
    </footer>
  );
};
