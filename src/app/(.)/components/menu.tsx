"use client";

import { Rows2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { Nav } from "~/components/ui/nav";

export default function Menu() {
  const pathname = usePathname();

  return (
    <Nav
      isCollapsed={false}
      links={[
        {
          title: "诗词",
          label: "128",
          icon: Rows2,
          variant: /^((\/)|(\/test\/))/.test(pathname) ? "default" : "ghost",
          href: "/",
        },
        // {
        //   title: "Drafts",
        //   label: "9",
        //   icon: File,
        //   variant: pathname === "/drafts" ? "default" : "ghost",
        //   href: "/drafts",
        // },
      ]}
    />
  );
}
