import Image from "next/image";
import { getDictionary, type Locale } from "~/dictionaries";
import { api } from "~/trpc/server";
import { R2Host } from "~/utils";
import Loading from "../../loading";
import Link from "next/link";
import { Pagination } from "~/components/pagination";

export default async function Page({
  params,
}: {
  params: { lang: Locale; page: string };
}) {
  const dict = await getDictionary(params.lang);
  const page = Number(params.page);
  const data = await api.card.find.query({
    page,
    pageSize: 30,
  });

  if (!data) return <Loading />;

  const { data: cards, hasNext } = data;

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3">
        {cards.map((item) => (
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
      <Pagination
        page={page}
        hasNext={hasNext}
        prefixUrl={`/${params.lang}/quota`}
        dict={dict}
      />
    </div>
  );
}
