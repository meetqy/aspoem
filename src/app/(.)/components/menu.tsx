"use client";

import { Rows2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { Nav } from "~/components/ui/nav";
import { api } from "~/trpc/react";

export default function Menu() {
  const pathname = usePathname();
  const { data: poemCount } = api.poem.count.useQuery();

  return (
    <Nav
      isCollapsed={false}
      links={[
        {
          title: "诗词",
          label: (poemCount ?? 0).toString(),
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
