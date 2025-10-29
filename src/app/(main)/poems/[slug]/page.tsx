import { Sidebar, SidebarContent, SidebarProvider } from '@/components/ui/sidebar'

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SidebarProvider className="container mx-auto">
        <Sidebar side="left" className="sticky top-[4rem] h-[calc(100vh-4rem)] !border-none">
          <aside className="size-full text-center">left</aside>
        </Sidebar>

        <SidebarContent>
          <main className="max-w-screen-md mx-auto bg-green-500 w-full">
            Children
          </main>
        </SidebarContent>

        <Sidebar side="right" className="sticky !border-none top-[4rem] h-[calc(100vh-4rem)]">
          <aside className="size-full text-center">right</aside>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}
