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
    <div className="h-screen bg-background py-4">
      <div className="container flex h-full w-full overflow-hidden rounded-xl border border-border bg-background p-0 shadow-xl">
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

          <div className="mt-2">
            <Menu />
          </div>
        </ScrollArea>

        <ScrollArea className="scroll-area flex flex-1">
          <header className="header min-h-16" id="header_main"></header>
          <main>{children}</main>
        </ScrollArea>

        <aside className="scroll-area w-72 border-l border-border">
          <header className="header">
            <div className="flex h-16 items-center justify-center">
              <Search />
            </div>
          </header>
          <div className="absolute bottom-4 right-4">
            <ModeToggle />
          </div>
        </aside>
      </div>
    </div>
  );
}
