import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/trpc/server";
import { SidebarLeft } from "./_components/sidebar-left";

export default async function Home() {
  const { items } = await api.poem.getHotList({ limit: 20 });

  return (
    <div className="flex flex-1 flex-col">
      <SidebarProvider className="relative container-wrapper">
        <SidebarLeft />

        <SidebarContent>
          <main className="max-w-screen-md mx-auto w-full lg:py-16 py-12">
            <div className="mb-6">
              <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl mb-4">
                推荐诗文
              </h1>
              <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
                推荐诗文，发现更多优秀作品。
              </p>
            </div>

            <div className="space-y-4">
              {items.map((poem) => (
                <Card
                  key={poem.id}
                  className="shadow-none hover:bg-accent/30 transition-colors"
                >
                  <CardHeader>
                    <h2 className="font-heading [&+]*:[code]:text-xl mt-10 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-16 [&+.steps]:!mt-0 [&+.steps>h3]:!mt-4 [&+h3]:!mt-6 [&+p]:!mt-4">
                      {poem.title}
                    </h2>
                    <p className="text-muted-foreground">
                      [{poem.author.dynasty.name}] {poem.author.name}
                    </p>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {poem.paragraphs.slice(0, 4).map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="border-t">
                    <div className="space-x-2">
                      {["咏物", "写花", "纪实", "唐诗三百首"].map((tag) => (
                        <Badge variant="secondary" key={tag}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Button size={"lg"} variant="secondary">
                加载更多...
              </Button>
            </div>
          </main>
        </SidebarContent>
      </SidebarProvider>
    </div>
  );
}
