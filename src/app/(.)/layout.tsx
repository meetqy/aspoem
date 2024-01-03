import Menu from "~/components/Menu";
import { SearchInput } from "~/components/SearchInput";

export default function Template({
  children,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="container m-auto flex min-h-screen max-w-screen-2xl p-4">
      <aside className="sticky top-4 h-[calc(100vh-2rem)] w-72 rounded-box bg-base-100">
        <Menu />
      </aside>
      <main className="mx-4 flex-1 rounded-box bg-base-100">{children}</main>
      <aside className="sticky top-4 h-[calc(100vh-2rem)] w-72 rounded-box bg-base-100 p-4">
        <SearchInput />
        <div id="right_aside"></div>
      </aside>
    </div>
  );
}
