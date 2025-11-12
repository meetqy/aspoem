import { PoemParagraphs } from "@/components/poem-paragraphs";
import { SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/trpc/server";
import { SidebarRight } from "./_components/sidebar-right";

export default async function PoemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const poem = await api.poem.findDetail({ slug });

  return (
    <div className="flex flex-col flex-1">
      <SidebarProvider className="relative container-wrapper">
        <SidebarContent>
          <PoemParagraphs poem={poem} />
        </SidebarContent>

        <SidebarRight poem={poem} />
      </SidebarProvider>
    </div>
  );
}
