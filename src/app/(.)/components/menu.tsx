"use client";

import { PopoverTrigger } from "@radix-ui/react-popover";
import {
  Album,
  ArrowUpRightIcon,
  CircleDotIcon,
  GithubIcon,
  MenuIcon,
  Rocket,
  Rows2,
  TwitterIcon,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Nav } from "~/components/ui/nav";
import { Popover, PopoverContent } from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { cn } from "~/utils";

export default function Menu() {
  return (
    <>
      <Desktop className="hidden lg:block" />
      <Mobile className="lg:hidden" />
    </>
  );
}

function Content({ className }: { className?: string }) {
  const pathname = usePathname();
  const { data: poemCount } = api.poem.count.useQuery();
  const { data: authorCount } = api.author.count.useQuery();

  return (
    <div className={cn(className)}>
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
      <div className="px-4">
        <Separator className="my-4" />
      </div>
      <p className="px-4 text-xs">其他</p>
      <div className="font-serif">
        <Nav
          isCollapsed={false}
          links={[
            {
              title: "Github",
              icon: GithubIcon,
              variant: "ghost",
              href: "https://github.com/meetqy/aspoem",
              label: (
                <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground" />
              ),
            },
            {
              title: "Twitter",
              icon: TwitterIcon,
              variant: "ghost",
              href: "https://twitter.com/intent/tweet?url=https://aspoem.com&text=%E7%8E%B0%E4%BB%A3%E5%8C%96%E4%B8%AD%E5%9B%BD%E8%AF%97%E8%AF%8D%E5%AD%A6%E4%B9%A0%E7%BD%91%E7%AB%99",
              label: (
                <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground" />
              ),
            },
            {
              title: "Product Hunt",
              icon: Rocket,
              variant: "ghost",
              href: "https://www.producthunt.com/products/aspoem-com-learn-chinese-poetry",
              label: (
                <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground" />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

function Desktop({ className }: { className?: string }) {
  return (
    <div className={cn(className)}>
      <Content />
    </div>
  );
}

function Mobile({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className={cn(className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button size={"icon"}>
            <MenuIcon className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Content />
        </PopoverContent>
      </Popover>
    </div>
  );
}
