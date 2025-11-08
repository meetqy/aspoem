import { BookOpenIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/server";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const author = await api.author.findBySlug({ slug });

  if (!author) {
    notFound();
  }

  const lifespan =
    author.birthDate && author.deathDate
      ? `${author.birthDate}年 - ${author.deathDate}年`
      : author.birthDate
        ? `${author.birthDate}年 -`
        : author.deathDate
          ? `- ${author.deathDate}年`
          : "生卒年不详";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
          {author.name}
        </h1>

        <div className="flex items-center gap-4 text-muted-foreground">
          <Badge variant="outline">{author.dynasty.name}</Badge>

          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{lifespan}</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <BookOpenIcon className="h-4 w-4" />
            <span>共有 {author._count.poems} 首作品</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
        {author.introduce || "暂无简介"}
      </p>

      {/* 作品列表 - 可以后续添加 */}
      <h2 className="font-heading [&+]*:[code]:text-xl mt-10 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-16 [&+.steps]:!mt-0 [&+.steps>h3]:!mt-4 [&+h3]:!mt-6 [&+p]:!mt-4">
        作品列表
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
        {author.poems.map((poem) => (
          <Link
            key={poem.slug}
            href={`/poems/detail/${poem.slug}`}
            className="line-clamp-1 hover:underline"
          >
            {poem.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

// 生成页面元数据
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const author = await api.author.findBySlug({ slug });

  if (!author) {
    notFound();
  }

  return {
    title: `${author.name} - 诗人详情`,
    description: author.introduce
      ? `${author.introduce.slice(0, 100)}...`
      : `${author.name}，${author.dynasty.name}诗人，共有${author._count.poems}首作品`,
  };
}
