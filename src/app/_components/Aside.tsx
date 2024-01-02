import { CommandInputSearch } from "./Search";

export default async function Aside({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <aside className="sticky top-4 h-[calc(100vh-2rem)] w-72 rounded-box bg-base-100 p-4">
      <CommandInputSearch />
      {children}
    </aside>
  );
}
