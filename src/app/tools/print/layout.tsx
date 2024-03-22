import { api } from "~/trpc/server";
import { Aside } from "./components/aside";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Aside />
      <main className="h-full overflow-y-auto">{children}</main>
    </div>
  );
}
