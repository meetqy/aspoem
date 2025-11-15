import { PoemTypography } from "@/components/poem-typography";
import { Button } from "@/components/ui/button";
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
        <SidebarContent className="pb-12">
          <PoemTypography
            poem={poem}
            classNames={{
              content: poem.isOrderliness ? "text-center" : "text-left",
            }}
          />

          <div className="max-w-screen-md w-full mx-auto">
            <div className="flex gap-2 flex-wrap">
              {poem.tags.map((tag) => (
                <Button variant={"secondary"} key={tag.slug}>
                  {tag.name}
                </Button>
              ))}
            </div>
            <section className="prose font-sans max-w-none mt-8">
              {poem.translation && (
                <>
                  <h2>译文</h2>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: poem.translation.replaceAll("\n", "<br/>"),
                    }}
                  />
                </>
              )}

              {poem.annotation && (
                <>
                  <h2>注解</h2>
                  <ul>
                    {Object.entries(poem.annotation || {}).map(
                      ([key, value]) => (
                        <li key={key}>
                          {key}：{value}
                        </li>
                      ),
                    )}
                  </ul>
                </>
              )}
            </section>
          </div>
        </SidebarContent>

        <SidebarRight poem={poem} />
      </SidebarProvider>
    </div>
  );
}
