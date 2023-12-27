import { notFound, redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import CardItem from "~/app/_components/CardItem";

export default async function Page({ params }: { params: { page: string } }) {
  if (Number(params.page) === 1) return redirect("/");

  const {
    data: poems,
    page,
    hasNext,
  } = await api.poem.find.query({
    page: Number(params.page),
  });

  if (!poems || poems.length === 0) {
    return notFound();
  }

  return (
    <div className="py-4">
      <div className="grid grid-cols-4 gap-4">
        {poems.map((poem) => (
          <CardItem key={poem.id} href={`/poem/${poem.id}`} text={poem.title} />
        ))}
      </div>

      <div className="divider"></div>

      <div className="flex justify-between">
        <Link
          href={`/list/${page - 1}`}
          className={`btn btn-neutral ${
            page === 1 && "btn-disabled opacity-0"
          }`}
        >
          <ChevronLeftIcon className="h-6 w-6" />
          上一页
        </Link>
        <Link
          href={`/list/${page + 1}`}
          className={`btn btn-neutral ${!hasNext && "btn-disabled opacity-0"}`}
        >
          下一页
          <ChevronRightIcon className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}
