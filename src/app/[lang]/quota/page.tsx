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
          随机诗词片段
          <Button
            asChild
            variant={"outline"}
            size={"sm"}
            className="ml-4 h-8 w-8 p-0"
          >
            <Link href={`/${params.lang}/quota?t=${Date.now()}`}>
              <ShuffleIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </HeaderMain>
      <div className="py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {data.map((item) => (
            <Link
              href={`/${params.lang}/poem/${item.poemId}`}
              key={item.id}
              title={item.content || "诗词片段摘抄"}
              className="relative block aspect-[3/4] cursor-pointer overflow-hidden rounded-md shadow-md"
            >
              <Image
                key={item.id}
                alt={item.content || "诗词片段摘抄"}
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
