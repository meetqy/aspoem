import Link from "next/link";
import { api } from "~/trpc/server";
import { description } from "~/utils/constant";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const counts = {
    poem: await api.poem.count.query(),
  };

  return (
    <div className="container relative m-auto flex space-x-4">
      <ul className="menu menu-lg sticky left-0 top-0 h-screen w-72 overflow-y-auto rounded-box bg-base-200">
        <Link
          href={"/"}
          title={description}
          className="text-stroke-neutral-content btn btn-neutral flex h-20 cursor-pointer items-center justify-center font-serif text-5xl shadow-inner"
        >
          As Poem
        </Link>
        <li className="mt-4">
          <Link href={"/"} className="flex items-center justify-between">
            全部
            <span className="font-mono text-xs text-base-content/50">
              {counts.poem}
            </span>
          </Link>
        </li>
        <li>
          <a>作者</a>
        </li>
        <li>
          <a></a>
        </li>
      </ul>
      <main className="min-h-screen flex-1 overflow-hidden rounded-box">
        {children}
      </main>
      <aside className="sticky top-0 flex h-screen w-72 flex-col overflow-y-auto rounded-box bg-base-200"></aside>
    </div>
  );
}
