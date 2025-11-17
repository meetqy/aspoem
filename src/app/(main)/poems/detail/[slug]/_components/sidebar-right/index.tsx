import { AdsBanner300_250 } from "@/components/ads";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import type { ApiPoemFindDetail } from "@/server/api/router/poem";
import { AuthorCard } from "./author-card";
import { Feedback } from "./feedback";
import { ReadSetting } from "./read-setting";

export function SidebarRight({ poem }: { poem: ApiPoemFindDetail }) {
  return (
    <Sidebar
      collapsible="none"
      className="h-[calc(100vh-4rem)] bg-transparent sticky top-[4rem] w-80 hidden xl:block"
    >
      <ScrollArea className="h-full">
        <SidebarContent className="gap-4 py-12">
          <Feedback poem={poem} />

          <ReadSetting />

          <div className="overflow-hidden rounded-lg border space-y-2 flex items-center justify-center min-h-[250px]">
            <AdsBanner300_250 />
          </div>

          <AuthorCard poem={poem} />
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}
