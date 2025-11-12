"use client";
import { SquarePenIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface PoemListItemProps {
  poem: {
    slug: string;
    titleSlug: string;
    title: string;
    paragraphs: string[];
    author: {
      name: string;
      slug: string;
      dynasty: {
        name: string;
      };
    };
  };
  tags?: string[];
  paragraphsSlice?: number;
}

export function PoemListItem({
  poem,
  tags = [],
  paragraphsSlice = 4,
}: PoemListItemProps) {
  const router = useRouter();

  return (
    <Card
      className="shadow-none hover:bg-accent/30 transition-colors mt-4"
      onClick={() => {
        router.push(`/poems/detail/${poem.slug}`);
      }}
    >
      <CardHeader>
        <h2 className="font-heading [&+]*:[code]:text-xl mt-10 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-16 [&+.steps]:!mt-0 [&+.steps>h3]:!mt-4 [&+h3]:!mt-6 [&+p]:!mt-4">
          <Link href={`/poems/detail/${poem.slug}`}>{poem.title}</Link>
        </h2>
        <p className="text-muted-foreground">
          [{poem.author.dynasty.name}] {poem.author.name}
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {poem.paragraphs.slice(0, paragraphsSlice).map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-t">
        <div className="flex w-full">
          <div className="space-x-2 flex shrink-0 w-2/3">
            {tags.map((tag) => (
              <Badge variant="secondary" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex-1 flex justify-end">
            <Button variant={"link"} size={"sm"} asChild>
              <Link
                target="_blank"
                href={`https://github.com/meetqy/aspoem-backup/blob/main/poems/${poem.author.slug}/${poem.titleSlug}.md?plain=1`}
              >
                <SquarePenIcon />
                完善
              </Link>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
