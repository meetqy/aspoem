import { RubyText } from "@/components/ruby-text";
import { SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarLeft } from "./_components/sidebar-left";
import { SidebarRight } from "./_components/sidebar-right";

const poem = {
  title: "直中書省",
  titlePinyin: "Zhí Zhōng Shū Shěng",
  author: "白居易",
  authorPinyin: "Bái Jū yì",
  dynasty: "唐",
  dynastyPinyin: "Táng",
  paragraphs: [
    "絲綸閣下文章靜，鐘鼓樓中刻漏長。",
    "獨坐黃昏誰是伴，紫薇花對紫薇郎。",
  ],
  paragraphsPinyin: [
    "Sī Lún Gé Xià Wén Zhāng Jìng ， Zhōng Gǔ Lóu Zhōng Kè Lòu Cháng 。",
    "Dú Zuò Huáng Hūn Shuí Shì Bàn ， Zǐ Wēi Huā Duì Zǐ Wēi Láng 。",
  ],
  annotation: {
    紫薇花: "落葉亞喬木，夏季開紅紫色的花，秋天花謝。",
    絲綸閣: "指替皇帝撰擬詔書的閣樓。",
    刻漏: "古時用來滴水計時的器物。",
    紫微郎:
      "唐代官名，指中書舍人，因中書省曾改名紫微省，取天文紫微垣為義，故稱。",
  },
};

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SidebarProvider className="relative container-wrapper">
        <SidebarLeft />

        <SidebarContent>
          <main
            className="@container/poem h-[2000px] mx-auto w-full @poem/md:py-24 py-12"
            style={{
              fontFamily: `楷体, 楷体_gb2312, "Kaiti SC", STKaiti, "AR PL UKai CN", "AR PL UKai HK", "AR PL UKai TW", "AR PL UKai TW MBE", "AR PL KaitiM GB", KaiTi, KaiTi_GB2312, DFKai-SB, TW-Kai, cursive`,
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
                text={`[${poem.dynasty}]`}
                pinyin={` ${poem.dynastyPinyin} `}
              />

              <span className="mx-2"></span>

              <RubyText
                classNames={{
                  pinyin: "text-base",
                }}
                className="text-xl @md/poem:text-3xl"
                as="span"
                text={poem.author}
                pinyin={poem.authorPinyin}
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
                    annotation={poem.annotation}
                    classNames={{
                      symbol: "lg:after:inline after:flex",
                    }}
                  />
                ))}
              </div>
            </div>
          </main>
        </SidebarContent>

        <SidebarRight />
      </SidebarProvider>
    </div>
  );
}
