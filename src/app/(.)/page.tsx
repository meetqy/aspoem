import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import CardItem from "../_components/CardItem/index";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default async function Page() {
  const { data: poems, page, hasNext } = await api.poem.find.query();

  if (!poems || poems.length === 0) {
    return notFound();
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {poems.map((poem) => (
          <CardItem key={poem.id} href={`/poem/${poem.id}`} text={poem.title} />
        ))}
      </div>

      <div className="divider"></div>

      <div className="flex justify-between">
        <button className="btn btn-disabled btn-outline opacity-0">
          <ChevronLeftIcon className="h-6 w-6" />
          上一页
        </button>
        <Link
          href={`/list/${page + 1}`}
          className={`btn btn-neutral ${!hasNext && "btn-disabled opacity-0"}`}
        >
          下一页
          <ChevronRightIcon className="h-6 w-6" />
        </Link>
      </div>
    </>
  );
}
