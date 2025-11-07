"use client";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Author {
  id: string;
  name: string;
  slug: string;
  introduce?: string | null;
  dynasty: {
    name: string;
    slug: string;
  };
  _count: {
    poems: number;
  };
}

interface AuthorTableProps {
  authors: Author[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
  };
}

export function AuthorTable({ authors, pagination }: AuthorTableProps) {
  const { page, totalPages } = pagination;

  // 生成分页数组
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // 如果总页数小于等于最大显示数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 始终显示第一页
      pages.push(1);

      if (page > 4) {
        pages.push("ellipsis");
      }

      // 显示当前页周围的页码
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 3) {
        pages.push("ellipsis");
      }

      // 始终显示最后一页
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-12">
      <ScrollArea className="lg:h-[60vh] h-full w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">作者</TableHead>
              <TableHead className="w-1/5">朝代</TableHead>
              <TableHead className="w-1/5 text-center">作品数量</TableHead>
              <TableHead className="w-2/5 text-right">简介</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {authors.map((author) => (
              <TableRow key={author.id}>
                <TableCell>
                  <Link href={`/authors/detail/${author.slug}`}>
                    {author.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/authors/dynasty/${author.dynasty.slug}`}>
                    {author.dynasty.name}
                  </Link>
                </TableCell>
                <TableCell className="text-center w-20">
                  {author._count.poems}
                </TableCell>
                <TableCell className="text-muted-foreground text-right">
                  <div className="truncate">
                    {author.introduce || "暂无简介"}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* 分页组件 */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${page - 1}`}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {getPageNumbers().map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={`?page=${pageNum}`}
                    isActive={pageNum === page}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href={`?page=${page + 1}`}
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
