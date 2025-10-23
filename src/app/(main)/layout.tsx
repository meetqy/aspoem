import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { navMain } from "@/lib/nav-main";

export default function Layout({ children, breadcrumb }: { children: React.ReactNode; breadcrumb: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar items={navMain} />
      <SidebarInset>
        <header className="bg-background/95 sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4 backdrop-blur-sm">
          <SidebarTrigger className="mr-3 -ml-1" />
          {breadcrumb}
        </header>
        <main className="relative flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
