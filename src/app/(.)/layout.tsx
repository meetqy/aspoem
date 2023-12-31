import Link from "next/link";
import { api } from "~/trpc/server";
import Logo from "../_components/Logo";

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
      <main className="container m-auto flex max-w-screen-2xl p-4">
        <aside className=" sticky top-4 h-[calc(100vh-2rem)] w-72 rounded-box bg-base-100">
          <ul className="menu menu-lg w-full rounded-box p-4">
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
        </aside>

        <main className="flex min-h-screen flex-1 rounded-box">{children}</main>
      </main>
    </>
  );
}
