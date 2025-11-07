import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

interface AuthorListItemProps {
  author: Author;
}

export function AuthorListItem({ author }: AuthorListItemProps) {
  return (
    <Card className="transition-shadow shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">
              <Link
                href={`/authors/${author.slug}`}
                className="hover:underline"
              >
                {author.name}
              </Link>
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{author.dynasty.name}</Badge>
              <span className="text-sm text-muted-foreground">
                {author._count.poems} 首作品
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {author.introduce || "暂未完善"}
        </p>
      </CardContent>
    </Card>
  );
}
