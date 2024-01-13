import { ScrollArea } from "~/components/ui/scroll-area";
import Menu from "./components/menu";
import Link from "next/link";
import dynamic from "next/dynamic";

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
          <main className="m-auto max-w-screen-md">{children}</main>
        </ScrollArea>
      </div>
    </div>
  );
}
