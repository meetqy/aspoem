import { ScrollArea } from "~/components/ui/scroll-area";
import Menu from "./components/menu";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Nav } from "~/components/ui/nav";
import {
  ArrowUpRightIcon,
  GithubIcon,
  Rocket,
  TwitterIcon,
} from "lucide-react";

const Search = dynamic(() => import("./components/search"), { ssr: false });
const ModeToggle = dynamic(() => import("~/components/mode-toggle"), {
  ssr: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <div className="relative z-10 flex h-full w-full overflow-hidden bg-background/20 p-0 shadow-xl backdrop-blur">
        <ScrollArea className="w-72 border-border bg-muted/50">
          <header className="h-16">
            <Link
              href={"/"}
              className="text-outline flex h-16 items-center justify-center text-4xl font-bold"
            >
              AsPoem
              <span className="text-muted-foreground">.com</span>
            </Link>
          </header>

          <div className="mt-2 w-full">
            <Menu />
          </div>

          <div className="my-8 h-[1px] w-full px-4">
            <div className="h-full w-full bg-border"></div>
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
        </ScrollArea>

        <ScrollArea className="flex flex-1 bg-gradient-to-t from-background to-muted/10">
          <header
            className="sticky top-0 z-50 flex min-h-16 w-full flex-row-reverse items-center justify-between border-b border-border/40 bg-muted/20 pr-4 backdrop-blur"
            id="header_main"
          >
            <div className="flex items-center justify-center">
              <div className="mr-2">
                <Search />
              </div>
              <ModeToggle />
            </div>
          </header>
          <main className="relative m-auto max-w-screen-md">{children}</main>
        </ScrollArea>
      </div>
    </div>
  );
}
