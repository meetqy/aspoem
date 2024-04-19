import Image from "next/image";
import { type Locale } from "~/dictionaries";
import { api } from "~/trpc/server";
import { R2Host } from "~/utils";
import Loading from "../loading";
import Link from "next/link";
import { HeaderMain } from "~/components/ui/header";
import { Button } from "~/components/ui/button";
import { ShuffleIcon } from "lucide-react";

export default async function Page({
  params,
}: {
  params: { lang: Locale; page: string };
}) {
  const data = await api.card.random.query();

  if (!data) return <Loading />;

  return (
    <>
      <HeaderMain>
        <div className="flex items-center px-4">
          <span className="text-f200">诗词片段</span>
          <Button
            asChild
            variant={"outline"}
            size={"sm"}
            className="ml-4 h-8 w-8 border-transparent bg-transparent p-0 lg:border-border"
            aria-label="随机诗词片段"
          >
            <Link href={`/${params.lang}/quota?t=${Date.now()}`}>
              <ShuffleIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </HeaderMain>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {data.map((item) => (
            <Link
              href={`/${params.lang}/poem/${item.poemId}`}
              key={item.id}
              title={`查看《${item.poem.title}》原文`}
              className="relative block aspect-[3/4] cursor-pointer overflow-hidden rounded-md shadow-md"
            >
              <Image
                key={item.id}
                alt={`${item.content} - 《${item.poem.title}》 | 诗词摘抄片段`}
                src={`${R2Host}/aspoem/${item.url}_md.webp`}
                fill
                priority
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
