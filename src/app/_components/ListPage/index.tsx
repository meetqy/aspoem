import { notFound, redirect } from "next/navigation";
import { api } from "~/trpc/server";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";

export default async function ListPage({
  params,
}: {
  params?: { page: string };
}) {
  if (params && Number(params.page) === 1) return redirect("/");

  const {
    data: poems,
    page,
    hasNext,
  } = await api.poem.find.query({
    page: Number(params?.page ?? 1),
  });

  if (!poems || poems.length === 0) {
    return notFound();
  }

  return (
    <div>
      <ul className="menu menu-vertical sticky top-0 mx-4 rounded-box bg-base-100/70 shadow backdrop-blur lg:menu-horizontal">
        <li>
          <a>添加时间</a>
        </li>
        <li>
          <a>随机模式</a>
        </li>
        <li>
          <a>创作时间线</a>
        </li>
      </ul>

      <div className="mt-4 w-full space-y-4">
        {poems.map((poem) => {
          const content = poem.content.split("\n");

          return (
            <section className="mx-4 block cursor-pointer rounded-box border p-8">
              <div className="flex justify-between">
                <div className="font-bold text-base-content">
                  <Link
                    href={`/poem/${poem.id}?lt=${poem.title}`}
                    className="text-3xl underline-offset-4 hover:underline"
                  >
                    {poem.title}
                  </Link>
                  <span className="ml-2 font-light">
                    <span className="text-primary">@{poem.author.name}</span>
                    {poem.author.dynasty && (
                      <>
                        <span className="mx-1">·</span>
                        <span className="hover:underline">
                          {poem.author.dynasty}
                        </span>
                      </>
                    )}
                  </span>
                </div>

                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-xs"
                  >
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
                  >
                    <li>
                      <a>Item 1</a>
                    </li>
                    <li>
                      <a>Item 2</a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-2 text-lg">
                {content.slice(0, 8).map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>

              {content.length > 8 && (
                <div className="flex justify-between">
                  <p>......</p>
                  <Link
                    href={`/poem/${poem.id}?lt=${poem.title}`}
                    className="btn btn-outline btn-primary btn-sm font-normal"
                  >
                    查看详情 <ChevronRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <footer className="mx-4 mt-12 flex justify-between rounded-box">
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
      </footer>
    </div>
  );
}
