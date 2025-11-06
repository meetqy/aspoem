import { SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarLeft } from "./_components/sidebar-left";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <SidebarProvider className="relative container-wrapper">
        <SidebarLeft />

        <SidebarContent>
          <main className="max-w-screen-md mx-auto w-full lg:py-16 py-12">
            {children}
          </main>
        </SidebarContent>
      </SidebarProvider>
    </div>
  );
}
