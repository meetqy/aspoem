import {
  CalendarIcon,
  LinkIcon,
  ListBulletIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Aside from "~/app/_components/Aside";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { id: string } }) {
  const author = await api.author.findById.query(Number(params.id));

  if (!author) {
    return notFound();
  }

  return (
    <>
      <main className="mx-4 flex-1 rounded-box bg-base-100 py-8">
        <header className="m-auto flex max-w-screen-sm rounded-box">
          <div className="avatar">
            <div className="h-36 w-36 rounded-full shadow">
              <Image
                src={`https://picsum.photos/200?t=${author.id}`}
                alt={`${author.name} virtual avatar`}
                width={150}
                height={150}
              />
            </div>
          </div>

          <div className="ml-24 text-left">
            <h1 className="text-stroke-base-100 text-5xl">
              {author.name}{" "}
              <span className="text-2xl capitalize leading-none text-base-content">
                {author.namePinYin}
              </span>
            </h1>
            <p className="mt-4 line-clamp-3">{author.introduce}</p>
            <div className="mt-8">
              <p className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-base-content/50" />
                <span className="ml-2">
                  <span className="text-success">
                    {author.birthDate ?? "?"} 年
                  </span>
                  <span className="mx-2 text-base-content/20">~</span>
                  <span className="text-base-content">
                    {author.deathDate ?? "?"} 年
                  </span>
                </span>
              </p>
              <p className="flex items-center">
                <LinkIcon className="h-5 w-5 text-base-content/50" />
                <Link
                  href={`https://zh.wikipedia.org/wiki/${author.name}`}
                  target="_blank"
                  className="link link-primary ml-2"
                >
                  维基百科/{author.name}
                </Link>
              </p>
              <div className="mt-8 space-x-4">
                <div className="btn btn-sm">{author.dynasty}朝</div>
                <div className="btn btn-sm">Tag 2</div>
                <div className="btn btn-sm">Tag 3</div>
              </div>
            </div>
          </div>
        </header>

        <div className="input-bordered border-b px-4">
          <ul className="menu menu-horizontal mt-24 w-full space-x-4 bg-base-100">
            <li>
              <a className="active">
                <ListBulletIcon className="h-5 w-5" />
                作品
                <span className="badge badge-ghost badge-sm">
                  {author._count.poems}
                </span>
              </a>
            </li>
            <li>
              <a>
                <UsersIcon className="h-5 w-5" />
                关系
                <span className="badge badge-warning badge-sm">NEW</span>
              </a>
            </li>
          </ul>
        </div>
      </main>

      <Aside>
        <div className="absolute bottom-4 left-0 w-full px-4">
          <Link
            href={`/create/author?id=${author.id}`}
            className="btn btn-block flex-1"
          >
            <PencilSquareIcon className="h-4 w-4" />
            完善
          </Link>
        </div>
      </Aside>
    </>
  );
}
