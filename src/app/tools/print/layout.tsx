import { Aside } from "./components/aside";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Aside />
      <main className="m-auto h-full">{children}</main>
    </div>
  );
}
