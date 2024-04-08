"use client";

import { usePathname, useRouter } from "next/navigation";
import { type Locale, type Dictionary } from "~/dictionaries";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { cn } from "~/utils";
import {
  Album,
  Check,
  GithubIcon,
  Rocket,
  Rows2,
  SendIcon,
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
import Link from "next/link";

export function Content({
  className,
  dict,
  lang,
}: {
  className?: string;
  dict: Dictionary;
  lang: Locale;
}) {
  const pathname = usePathname().replace(`/${lang}`, "");

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
            title: dict.menu.author,
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
      <p className="px-4 text-f50 text-muted-foreground">{dict.menu.theme}</p>
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
      <p className="px-4 text-f50 text-muted-foreground">
        {dict.menu.language}
      </p>
      <div className="my-4 px-4 text-f50">
        <Select
          value={lang}
          onValueChange={(value) => {
            localStorage.setItem("lang", value);
            router.replace(`/${value}/${pathname}`);
          }}
        >
          <SelectTrigger className="w-full" aria-label={dict.menu.language}>
            <SelectValue placeholder={dict.menu.language} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh-Hans">中文简体</SelectItem>
            <SelectItem value="zh-Hant">中文繁体</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ko">한국어</SelectItem>
            <SelectItem value="ja">日本語</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="px-4">
        <Separator className="my-4" />
      </div>
      <p className="px-4 text-f50">{dict.menu.contact}</p>
      <nav className="flex space-x-2 p-4">
        {[
          {
            title: "GitHub",
            href: "https://github.com/meetqy/aspoem",
            icon: <GithubIcon className="h-6 w-6" strokeWidth={1.5} />,
          },
          {
            title: "twitter",
            href: "https://twitter.com/meetqy",
            icon: <TwitterIcon className="h-6 w-6" strokeWidth={1.5} />,
          },
          {
            title: `ProductHunt`,
            href: "https://www.producthunt.com/products/aspoem-com-learn-chinese-poetry",
            icon: <Rocket className="h-6 w-6" strokeWidth={1.5} />,
          },
          {
            title: "留言",
            href: `/${lang}/feedback`,
            icon: (
              <SendIcon
                className="h-6 w-6 text-destructive"
                strokeWidth={1.5}
              />
            ),
          },
        ].map(({ href, icon, title }) => (
          <Button
            key={href}
            size={"icon"}
            variant={"ghost"}
            aria-label={title}
            asChild
          >
            <Link
              aria-label={title}
              href={href}
              className="flex cursor-pointer justify-center"
            >
              {icon}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );
}
