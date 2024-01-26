import { ScrollArea } from "~/components/ui/scroll-area";
import { DesktopMenu, MobileMenu } from "./components/menu";
import Link from "next/link";
import dynamic from "next/dynamic";

const Search = dynamic(() => import("./components/search"), { ssr: false });
const ModeToggle = dynamic(() => import("~/components/mode-toggle"), {
  ssr: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex bg-background/20 p-0">
      <aside className="hidden lg:block">
        <div className="fixed left-0 top-0 h-screen bg-muted/50">
          <ScrollArea className="sticky top-0 h-full w-72 border-border">
            <header className="h-16">
              <Link
                href={"/"}
                className="text-outline flex h-16 items-center justify-center font-serif text-4xl font-bold"
              >
                AsPoem
                <span className="text-muted-foreground">.com</span>
              </Link>
            </header>

            <div className="mt-4">
              <DesktopMenu />
            </div>
          </ScrollArea>
        </div>
        <div className="w-72"></div>
      </aside>

      <MobileMenu />

      <div className="flex-1 bg-gradient-to-t from-background to-muted/10">
        <header
          className="sticky top-0 z-40 flex min-h-16 w-full flex-row-reverse items-center justify-between border-b border-border/40 bg-gradient-to-b from-background to-muted/40 pl-14 pr-4 backdrop-blur lg:pl-0"
          id="header_main"
        >
          <div className="flex items-center justify-center">
            <div className="mr-2 hidden lg:block">
              <Search />
            </div>
            <ModeToggle />
          </div>
        </header>
        <main className="relative m-auto max-w-screen-md">{children}</main>
      </div>
    </div>
  );
}
