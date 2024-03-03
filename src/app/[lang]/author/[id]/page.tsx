import { CalendarIcon, ChevronRight, LinkIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { HeaderMain } from "~/components/ui/header";
import { api } from "~/trpc/server";
import Poems from "./components/poems";
import { Button } from "~/components/ui/button";
import { getDictionary, type Locale } from "~/dictionaries";

type Props = {
  params: { id: string; lang: Locale };
  searchParams?: { tab: "relations" };
};

export const revalidate = 3600;

const getItem = cache(async ({ id }: Props["params"]) => {
  const author = await api.author.findById.query(Number(id));

  if (!author) {
    notFound();
  }

  return author;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getItem(params);

  const keywords = [author.name];

  if (author.dynasty) {
    keywords.push(author.dynasty);
  }

  return {
    title: `${author.dynasty}·${author.name}的所有诗词（共${author._count.poems}首）`,
    description: `${author.dynasty}·${author.name}（${author.namePinYin}），${author.introduce}`,
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
  const dict = getDictionary(params.lang);

  const author = await getItem(params);

  return (
    <>
      <HeaderMain>
        <div className="flex h-16 items-center px-4">
          <nav className="flex items-center space-x-1 text-muted-foreground">
            <Link href={`/${params.lang}/author`}>
              {(await dict).author_detail.title}
            </Link>
            <ChevronRight className="h-4 w-4" strokeWidth={1} />
            <span className="line-clamp-1 text-foreground">{author.name}</span>
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
            <span>{author.name}</span>{" "}
            <span className="font-mono text-xl font-normal !tracking-tighter text-muted-foreground">
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
              <Button variant={"secondary"}>{author.dynasty}朝</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full md:mt-8">
        {!searchParams?.tab && <Poems authorId={author.id} />}
      </main>

      <footer className="h-16"></footer>
    </>
  );
}
