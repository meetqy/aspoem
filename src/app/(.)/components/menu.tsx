"use client";

import { PopoverTrigger } from "@radix-ui/react-popover";
import {
  Album,
  ArrowUpRightIcon,
  Check,
  CircleDot,
  GithubIcon,
  MenuIcon,
  Rocket,
  Rows2,
  Tag,
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

function Content({ className }: { className?: string }) {
  const pathname = usePathname();
  const { data: poemCount } = api.poem.count.useQuery();
  const { data: authorCount } = api.author.count.useQuery();

  const [style, setStyle] = useState("zinc");

  useEffect(() => {
    const style = localStorage.getItem("style");
    const body = document.body;
    body.classList.add(`theme-${style}`);

    setStyle(style ?? "zinc");
  }, []);

  return (
    <div className={cn(className)}>
      <Nav
        isCollapsed={false}
        links={[
          {
            title: "诗词",
            label: <span className="font-mono">{poemCount}</span>,
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
            label: <span className="font-mono">{authorCount}</span>,
            icon: UserRound,
            variant: /^(\/author)/.test(pathname) ? "default" : "ghost",
            href: "/author",
          },
          {
            title: "词牌名",
            icon: Album,
            label: <CircleDot className="h-5 w-5" />,
            variant: /^(\/ci-pai-ming)/.test(pathname) ? "default" : "ghost",
            href: "/ci-pai-ming",
          },
          {
            title: "标签",
            icon: Tag,
            label: <CircleDot className="h-5 w-5" />,
            variant: /^(\/tag)/.test(pathname) ? "default" : "ghost",
            href: "/tag",
          },
        ]}
      />
      <div className="px-4">
        <Separator className="my-4" />
      </div>
      <p className="px-4 text-xs">联系方式</p>
      <div className="font-serif">
        <Nav
          isCollapsed={false}
          links={[
            {
              title: <span className="font-serif">Github</span>,
              icon: GithubIcon,
              variant: "ghost",
              href: "https://github.com/meetqy/aspoem",
              label: (
                <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground" />
              ),
            },
            {
              title: <span className="font-serif">Twitter</span>,
              icon: TwitterIcon,
              variant: "ghost",
              href: "https://twitter.com/meetqy",
              label: (
                <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground" />
              ),
            },
            {
              title: <span className="font-serif">Product Hunt</span>,
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

      <div className="px-4">
        <Separator className="my-4" />
      </div>
      <p className="px-4 text-xs">主题</p>
      <div className="my-4 flex justify-between px-4">
        {["zinc", "rose", "blue", "green", "orange"].map((item) => (
          <Button
            key={item}
            variant={"default"}
            size={"icon"}
            className={cn(
              `theme-${item}`,
              "rounded-full border-2 bg-transparent hover:bg-transparent",
              style === item ? "border-primary" : "border-transparent",
            )}
            onClick={() => {
              const body = document.body;
              body.classList.remove(`theme-${style}`);
              body.classList.add(`theme-${item}`);

              setStyle(item);
              localStorage.setItem("style", item);
            }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              {item === style && <Check className="h-4 w-4" />}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

export function DesktopMenu({ className }: { className?: string }) {
  return (
    <div className={cn("hidden lg:block", className)}>
      <Content />
    </div>
  );
}

export function MobileMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className={cn("lg:hidden", className)}>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="fixed left-4 top-3 z-50"
          >
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
