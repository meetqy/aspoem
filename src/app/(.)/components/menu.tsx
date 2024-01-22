"use client";

import { Album, CircleDotIcon, Rows2, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { Nav } from "~/components/ui/nav";
import { api } from "~/trpc/react";

export default function Menu() {
  const pathname = usePathname();
  const { data: poemCount } = api.poem.count.useQuery();
  const { data: authorCount } = api.author.count.useQuery();

  return (
    <Nav
      isCollapsed={false}
      links={[
        {
          title: "诗词",
          label: (poemCount ?? 0).toString(),
          icon: Rows2,
          variant:
            pathname === "/" ||
            pathname.startsWith("/list") ||
            pathname.startsWith("/poem")
              ? "default"
              : "ghost",
          href: "/",
        },
        {
          title: "诗人",
          label: (authorCount ?? 0).toString(),
          icon: UserRound,
          variant: /^(\/author)/.test(pathname) ? "default" : "ghost",
          href: "/author",
        },
        {
          title: "词牌名",
          icon: Album,
          label: <CircleDotIcon className="h-5 w-5" strokeWidth={1} />,
          variant: /^(\/ci-pai-ming)/.test(pathname) ? "default" : "ghost",
          href: "/ci-pai-ming",
        },
      ]}
    />
  );
}
