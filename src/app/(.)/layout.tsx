import Menu from "../_components/Menu";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="container m-auto flex max-w-screen-2xl p-4">
        <Menu />

        <main className="flex min-h-screen flex-1 rounded-box">{children}</main>
      </main>
    </>
  );
}
