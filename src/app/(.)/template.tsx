import Link from "next/link";
import { description } from "~/utils/constant";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="container m-auto flex space-x-4">
      <ul className="menu menu-lg w-72 rounded-box bg-base-200">
        <Link
          href={"/"}
          title={description}
          className="text-stroke btn btn-ghost flex h-20 cursor-pointer items-center justify-center font-serif text-5xl"
        >
          As Poem
        </Link>
        <li>
          <a>菜单一</a>
        </li>
        <li>
          <a>菜单二</a>
        </li>
        <li>
          <a>菜单三</a>
        </li>
      </ul>
      <main className="min-h-screen flex-1 overflow-hidden rounded-box">
        {children}
      </main>
      <aside className="flex w-72 flex-col rounded-box bg-base-200"></aside>
    </div>
  );
}
