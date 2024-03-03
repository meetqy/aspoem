"use client";

import { usePathname, useRouter } from "next/navigation";
import { type Locale, type Dictionary } from "~/dictionaries";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { cn } from "~/utils";
import {
  Album,
  ArrowUpRightIcon,
  Check,
  GithubIcon,
  Rocket,
  Rows2,
  Tag,
  TwitterIcon,
  UserRound,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Nav } from "~/components/ui/nav";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function Content({
  className,
  dict,
  lang,
}: {
  className?: string;
  dict: Dictionary;
  lang: Locale;
}) {
  const pathname = usePathname().replace(/(zh-Hans|zh-Hant)\/?/, "");

  const { data: poemCount } = api.poem.count.useQuery();
  const { data: authorCount } = api.author.count.useQuery();
  const { data: tagsCount } = api.tag.count.useQuery();
  const router = useRouter();

  const [style, setStyle] = useState("zinc");

  useEffect(() => {
    const style = localStorage.getItem("style") ?? "zinc";
    const body = document.body;
    body.classList.add(`theme-${style}`);
    body.setAttribute("data-theme", style);

    setStyle(style);
  }, []);

  return (
    <div className={cn(className)}>
      <Nav
        isCollapsed={false}
        links={[
          {
            title: dict.menu.poem,
            label: <span className="font-mono">{poemCount}</span>,
            icon: Rows2,
            variant:
              /^\/(poem|list)/.test(pathname) ||
              pathname === "" ||
              pathname === "/"
                ? "default"
                : "ghost",
            href: `/${lang}`,
          },
          {
            title: dict.menu.auhtor,
            label: <span className="font-mono">{authorCount}</span>,
            icon: UserRound,
            variant: /^(\/author)/.test(pathname) ? "default" : "ghost",
            href: `/${lang}/author/list/1`,
          },
          {
            title: dict.menu.ci_pai_ming,
            icon: Album,
            label: <span className="font-mono">{tagsCount?.[1]}</span>,
            variant: /^(\/ci-pai-ming)/.test(pathname) ? "default" : "ghost",
            href: `/${lang}/ci-pai-ming/1`,
          },
          {
            title: dict.menu.tag,
            icon: Tag,
            label: <span className="font-mono">{tagsCount?.[0]}</span>,
            variant: /^(\/tag)/.test(pathname) ? "default" : "ghost",
            href: `/${lang}/tag`,
          },
        ]}
      />
      <div className="px-4">
        <Separator className="my-4" />
      </div>
      <p className="px-4 text-xs">{dict.menu.contact}</p>
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
      <p className="px-4 text-xs">{dict.menu.theme}</p>
      <div className="my-4 flex justify-between px-4">
        {["zinc", "rose", "blue", "green", "orange"].map((item) => (
          <Button
            key={item}
            variant={"default"}
            size={"icon"}
            aria-label={`${item} theme`}
            className={cn(
              `theme-${item}`,
              "rounded-full border-2 bg-transparent hover:bg-transparent",
              style === item ? "border-primary" : "border-transparent",
            )}
            onClick={() => {
              const body = document.body;
              body.classList.remove(`theme-${style}`);
              body.classList.add(`theme-${item}`);
              body.setAttribute("data-theme", item);

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
      <p className="px-4 text-xs">{dict.menu.theme}</p>
      <div className="my-4 px-4">
        <Select
          value={lang}
          onValueChange={(value) => {
            localStorage.setItem("lang", value);
            router.replace(`/${value}/${pathname}`);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={dict.menu.language} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh-Hans">中文简体</SelectItem>
            <SelectItem value="zh-Hant">中文繁体</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
