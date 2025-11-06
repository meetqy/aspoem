import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { AuthorCard } from "./author-card";
import { Feedback } from "./feedback";
import { ReadSetting } from "./read-setting";

const author = {
  id: "bai-juyi",
  name: "白居易",
  namePinYin: "Bái Jū yì",
  dynasty: "唐",
  birthDate: 772,
  deathDate: 846,
  introduce: "白居易，字乐天，号香山居士，唐代著名诗人。",
  epithets: ["诗仙", "乐天先生", "香山居士"],
  style: "擅长写景抒情，语言通俗易懂。",
  _count: {
    poems: 100,
  },
};

export function SidebarRight() {
  return (
    <Sidebar
      collapsible="none"
      className="h-[calc(100vh-4rem)] bg-transparent sticky top-[4rem] w-80 hidden xl:block"
    >
      <ScrollArea className="h-full">
        <SidebarContent className="gap-4 pt-12">
          <Feedback />

          <ReadSetting />

          <AuthorCard author={author} />
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}
