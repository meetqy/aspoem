import Link from "next/link";
import { api } from "~/trpc/server";
import Logo from "../_components/Logo";
import { CommandInputSearch } from "../_components/CommandMenu";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const counts = {
    poem: await api.poem.count.query(),
  };

  return (
    <>
      <main className="container m-auto flex max-w-screen-2xl space-x-4 p-4">
        <ul className="menu menu-lg sticky left-0 top-0 h-screen w-72 overflow-y-auto rounded-box bg-base-100 p-4">
          <Logo />
          <li className="mt-4">
            <Link href={"/"} className="flex items-center justify-between">
              全部
              <span className="badge badge-sm font-mono uppercase">
                {counts.poem}
              </span>
            </Link>
          </li>
        </ul>

        <main className="min-h-screen flex-1 rounded-box bg-base-100 py-4">
          {children}
        </main>

        <aside className="w-72 rounded-box bg-base-100 p-4">
          <CommandInputSearch />
        </aside>
      </main>
    </>
  );
}
