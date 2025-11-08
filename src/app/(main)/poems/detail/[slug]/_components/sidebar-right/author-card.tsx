import { CalendarIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ApiPoemFindDetail } from "@/server/api/router/poem";

export function AuthorCard({ poem }: { poem: ApiPoemFindDetail }) {
  const { author, dynasty } = poem;

  const lifespan = `${author.birthDate || "?"}年—${author.deathDate || "?"}年`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          {/* 作者头像 */}
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {author.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            {/* 作者姓名 */}
            <div>
              <h3 className="text-xl font-semibold">{author.name}</h3>
              <p className="text-sm text-muted-foreground">{author.pinyin}</p>
            </div>

            {/* 生卒年/朝代 */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{lifespan}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{dynasty!.name}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 文学地位/称号 */}
        {author.epithets && (
          <div className="flex items-center gap-2">
            {author.epithets.map((item) => (
              <Badge key={item} variant="secondary" className="text-sm">
                {item}
              </Badge>
            ))}
          </div>
        )}

        {/* 核心风格/创作特色 */}
        <div>
          <p className="text-sm text-muted-foreground">创作特色</p>
          <p className="text-sm">{author.style || "待完善"}</p>
        </div>

        {/* 作者简介 */}
        <div>
          <p className="text-sm text-muted-foreground">简介</p>
          <p className="text-sm line-clamp-3">{author.introduce || "待完善"}</p>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="secondary" asChild className="w-full">
          <Link href={`/authors/detail/${author.slug}`}>
            <UserIcon />
            进入主页
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
