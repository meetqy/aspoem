import { CalendarIcon, ChevronRight, LinkIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { HeaderMain } from "~/components/ui/header";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import Poems from "./components/poems";

type Props = {
  params: { id: string };
  searchParams?: { tab: "relations" };
};

export const revalidate = 3600;

const getItem = cache(async (id: string) => {
  const author = await api.author.findById.query(Number(id));

  if (!author) {
    return notFound();
  }

  return author;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getItem(params.id);

  const keywords = [author.name];

  if (author.dynasty) {
    keywords.push(author.dynasty);
  }

  return {
    title: `${author.name}·${author.dynasty}的所有诗词`,
    description: `${author.name}，${author.dynasty}朝著名诗人，${author.introduce}一起来学习${author.name}的诗词吧！`,
    keywords: [
      author.name,
      "诗词",
      "作品精选",
      `${author.name}的经典诗词`,
      `${author.name}的诗词与${author.dynasty}代文学`,
      `${author.name}的豪放诗风与独特创作风格`,
    ],
  };
}

export default async function Page({ params, searchParams }: Props) {
  const author = await getItem(params.id);

  return (
    <>
      <HeaderMain>
        <div className="flex h-16 items-center px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">作者</span>
            <ChevronRight className="h-4 w-4" strokeWidth={1} />
            <span>{author.name}</span>
          </nav>
        </div>
      </HeaderMain>

      <header className="rounded-box m-auto flex max-w-screen-sm px-4 py-8">
        <Avatar className="hidden h-36 w-36 md:block">
          <AvatarFallback>
            <span className="text-3xl">{author.name}</span>
          </AvatarFallback>
        </Avatar>

        <div className="text-left md:ml-16">
          <h1 prose-h1="">
            <span className="text-outline">{author.name}</span>{" "}
            <span className="font-serif text-2xl font-normal capitalize !tracking-tighter">
              {author.namePinYin}
            </span>
          </h1>
          <p className="mt-4 line-clamp-3">{author.introduce}</p>
          <div className="mt-8">
            <p className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span className="ml-2">
                <span className="font-mono text-sm">
                  {author.birthDate ?? "?"}
                </span>
                年<span className="mx-2 text-muted-foreground">~</span>
                <span className="font-mono text-sm">
                  {author.deathDate ?? "?"}
                </span>
                年
              </span>
            </p>
            <p className="flex items-center">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
              <Link
                href={`https://zh.wikipedia.org/wiki/${author.name}`}
                target="_blank"
                className="ml-2 text-blue-600 hover:underline"
              >
                维基百科/{author.name}
              </Link>
            </p>
            <div className="mt-8 space-x-4">
              <Badge>{author.dynasty}朝</Badge>
              <Badge variant={"secondary"}>标签二</Badge>
              <Badge variant={"secondary"}>标签三</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full md:mt-8">
        <div className="flex h-16 items-center border-b border-border px-4">
          <Tabs value={searchParams?.tab ?? ""}>
            <TabsList>
              <TabsTrigger value="" asChild>
                <Link href={`?`} replace>
                  诗词
                  <span className="ml-2 inline-block rounded-md bg-red-600 p-0 px-1 font-mono text-xs text-white">
                    {author._count.poems}
                  </span>
                </Link>
              </TabsTrigger>
              {/* <TabsTrigger value="relations" asChild>
                <Link href={`?tab=relations`} replace>
                  关系
                </Link>
              </TabsTrigger> */}
            </TabsList>
          </Tabs>
        </div>

        {!searchParams?.tab && <Poems authorId={author.id} />}
      </main>
    </>
  );
}
