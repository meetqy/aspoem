import { notFound, redirect } from "next/navigation";
import { api } from "~/trpc/server";
import "./index.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { type Sort } from "~/types";
import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import SectionClick from "./SectionClick";

export default async function ListPage({
  params,
  searchParams,
}: {
  params?: { page: string };
  searchParams?: { sort: Sort };
}) {
  const toHref = (href: string) => {
    if (searchParams?.sort) {
      return `${href}?sort=${searchParams?.sort}`;
    }

    return href;
  };

  if (params && Number(params.page) === 1) {
    return redirect(toHref(`/`));
  }

  const {
    data: poems,
    page,
    hasNext,
  } = await api.poem.find.query({
    page: Number(params?.page ?? 1),
    pageSize: 12,
    sort: searchParams?.sort,
  });

  if (!poems || poems.length === 0) {
    return notFound();
  }

  return (
    <>
      <div className="flex-1 px-4 pb-4">
        <header className="sticky top-0 z-50 -mx-4 flex h-16 items-center justify-between rounded-t-box bg-base-100/70 backdrop-blur">
          <span className="ml-4 flex items-center text-2xl">
            <CubeTransparentIcon className="mr-2 h-6 w-6 text-success" />
            <span>全部</span>
          </span>
          <div className="flex flex-1 justify-end px-4">
            <ul className="menu menu-horizontal space-x-2 rounded-box">
              <li>
                <Link href={"?"} className={searchParams?.sort ? "" : "active"}>
                  默认
                </Link>
              </li>
              <li>
                <Link
                  href={"?sort=updatedAt"}
                  className={searchParams?.sort === "updatedAt" ? "active" : ""}
                >
                  更新时间
                </Link>
              </li>
              <li>
                <Link
                  href={"?sort=improve"}
                  className={searchParams?.sort === "improve" ? "active" : ""}
                >
                  完善度
                </Link>
              </li>
            </ul>
          </div>
        </header>

        <div className="w-full space-y-4">
          {poems.map((poem) => {
            const content = poem.content.split("\n");

            return (
              <SectionClick
                key={poem.id}
                href={`/poem/${poem.id}?lt=${poem.title}`}
              >
                <section className="input-bordered block cursor-pointer rounded-box border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-base-content">
                      <Link
                        href={`/poem/${poem.id}?lt=${poem.title}`}
                        className="underline-animation text-xl font-semibold"
                      >
                        {poem.title}
                      </Link>

                      <span className="ml-2 font-light">
                        <Link
                          href={`/author/${poem.authorId}?lt=${poem.author.name}`}
                          className="link link-primary no-underline hover:underline"
                        >
                          @{poem.author.name}
                        </Link>
                        {poem.author.dynasty && (
                          <>
                            <span className="mx-1">·</span>
                            <span>{poem.author.dynasty}</span>
                          </>
                        )}
                      </span>
                    </div>

                    <span className="text-sm font-normal text-base-content/70">
                      更新时间：
                      {poem.updatedAt && format(poem.updatedAt, "yyyy-MM-dd")}
                    </span>
                  </div>

                  <div className="mt-2 text-base-content/70">
                    {content.slice(0, 4).map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>

                  {content.length > 8 && (
                    <div className="flex justify-between">
                      <p className="text-sm text-base-content/70">......</p>
                    </div>
                  )}
                </section>
              </SectionClick>
            );
          })}
        </div>

        <footer className="mt-12 flex justify-between rounded-box">
          <Link
            href={toHref(`/list/${page - 1}`)}
            className={`btn btn-neutral ${
              page === 1 && "btn-disabled opacity-0"
            }`}
          >
            <ChevronLeftIcon className="h-6 w-6" />
            上一页
          </Link>
          <Link
            href={toHref(`/list/${page + 1}`)}
            className={`btn btn-neutral ${
              !hasNext && "btn-disabled opacity-0"
            }`}
          >
            下一页
            <ChevronRightIcon className="h-6 w-6" />
          </Link>
        </footer>
      </div>
    </>
  );
}
