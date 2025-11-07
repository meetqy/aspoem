import { SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/trpc/server";
import { SidebarLeft } from "./_components/sidebar-left";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await api.dynasty.getAuthorsCount();

  return (
    <div className="flex flex-1 flex-col">
      <SidebarProvider className="relative container-wrapper">
        <SidebarLeft dynasty={data} />

        <SidebarContent>
          <main className="max-w-screen-lg mx-auto w-full lg:py-16 py-12">
            {children}
          </main>
        </SidebarContent>
      </SidebarProvider>
    </div>
  );
}
