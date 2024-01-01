"use client";

import Link from "next/link";
import Logo from "./Logo";
import { api } from "~/trpc/react";
import { usePathname } from "next/navigation";

export default function Menu() {
  const { data: poemCount } = api.poem.count.useQuery();

  const pathname = usePathname();

  return (
    <aside className="sticky top-4 h-[calc(100vh-2rem)] w-72 rounded-box bg-base-100">
      <ul className="menu menu-lg w-full rounded-box p-4">
        <Logo />
        <li className="mt-4">
          <Link
            href={"/"}
            className={`flex items-center justify-between ${
              pathname === "/" ? "active" : ""
            }`}
          >
            全部
            <span className="badge badge-sm font-mono uppercase">
              {poemCount}
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={"/tag/list"}
            className={`flex items-center justify-between ${
              pathname === "/tag/list" ? "active" : ""
            }`}
          >
            标签
          </Link>
        </li>
      </ul>
    </aside>
  );
}
