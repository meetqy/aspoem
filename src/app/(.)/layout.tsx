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
    <div className="h-screen py-4 ">
      <div className="container relative z-10 flex h-full w-full overflow-hidden rounded-xl border border-border bg-background p-0 shadow-xl">
        <ScrollArea className="scroll-area w-72 border-r border-border">
          <header className="header">
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

        <ScrollArea className="scroll-area flex flex-1">
          <header
            className="header relative flex min-h-16 flex-row-reverse items-center justify-between pr-4"
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
