import { Header } from '@/components/header'
import { Sidebar, SidebarContent, SidebarGroup, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background">
      <Header />

      <div className="container mx-auto">
        <SidebarProvider className="relative h-[calc(100vh-4rem)]">
          <Sidebar side="left" className="relative">
            <div className="size-full bg-red-500">23213</div>
          </Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarTrigger />
              {children}
            </SidebarGroup>
            <SidebarGroup>2</SidebarGroup>
          </SidebarContent>
          <Sidebar side="right" className="relative">
            <div className="size-full bg-blue-500">23213</div>
          </Sidebar>
        </SidebarProvider>
      </div>
    </div>
  )
}
