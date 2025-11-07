import { RubyText } from "@/components/ruby-text";
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
    <div className="flex flex-1 flex-col">
      <SidebarProvider className="relative container-wrapper">
        <SidebarContent>
          <main
            className="@container/poem mx-auto w-full @poem/md:py-24 py-12 font-cursive"
            style={{
              fontSize: 20,
            }}
          >
            <RubyText
              className="text-5xl @md/poem:text-7xl"
              as="h1"
              text={poem.title}
              pinyin={poem.titlePinyin}
            />

            <h2 className="text-center mt-[1.5em] flex items-center justify-center">
              <RubyText
                className="text-xl @md/poem:text-3xl"
                classNames={{
                  pinyin: "text-base",
                }}
                as="span"
                text={`[${poem.dynasty!.name}]`}
                pinyin={` ${poem.dynasty!.pinyin} `}
              />

              <span className="mx-2"></span>

              <RubyText
                classNames={{
                  pinyin: "text-base",
                }}
                className="text-xl @md/poem:text-3xl"
                as="span"
                text={poem.author.name}
                pinyin={poem.author.pinyin}
              />
            </h2>

            <div className="mt-[3em]">
              <div className="leading-[2.5em] text-[2rem] @md/poem:text-4xl tracking-[0.2em] @md/poem:tracking-[0.15em] transition-all">
                {poem.paragraphs.map((paragraph, index) => (
                  <RubyText
                    key={index}
                    as="p"
                    className="text-inherit"
                    text={paragraph}
                    pinyin={poem.paragraphsPinyin[index]!}
                    annotation={poem.annotation as Record<string, string>}
                    classNames={{
                      symbol: "lg:after:inline after:flex",
                    }}
                  />
                ))}
              </div>
            </div>
          </main>
        </SidebarContent>

        <SidebarRight poem={poem} />
      </SidebarProvider>
    </div>
  );
}
