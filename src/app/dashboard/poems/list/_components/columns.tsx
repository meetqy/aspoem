import type { Author, Poem } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Poem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 32,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",

    cell: ({ row }) => (
      <div className="w-24 line-clamp-1">{row.getValue("title") || ""}</div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <div className="w-24 line-clamp-1">{row.getValue("slug")}</div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[] | null;
      if (!tags || tags.length === 0)
        return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      return <div>{(row.getValue("author") as Author | null)?.name}</div>;
    },
  },
  {
    accessorKey: "dynasty",
    header: "Dynasty",
    cell: ({ row }) => {
      return (
        <div>{(row.getValue("dynasty") as { name: string } | null)?.name}</div>
      );
    },
  },
  {
    accessorKey: "paragraphs",
    header: "Paragraphs",
    cell: ({ row }) => {
      const paragraphs = row.getValue("paragraphs") as string[];
      const preview = paragraphs?.[0] || "";
      const truncated =
        preview.length > 50 ? `${preview.slice(0, 50)}...` : preview;

      return <div className="max-w-72 line-clamp-1">{truncated}</div>;
    },
  },
];
