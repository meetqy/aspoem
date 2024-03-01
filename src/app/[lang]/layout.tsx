import { ScrollArea } from "~/components/ui/scroll-area";
import { DesktopMenu, MobileMenu } from "./components/menu";
import Link from "next/link";
import dynamic from "next/dynamic";
import { type Locale, getDictionary } from "./dictionaries";
import { type Metadata } from "next/types";
import Root from "../root";

const Search = dynamic(() => import("./components/search"), { ssr: false });
const ModeToggle = dynamic(() => import("~/components/mode-toggle"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: {
    template: "%s | 现代化中国诗词学习网站",
    default: "AsPoem | 现代化中国诗词学习网站",
  },
  description: `aspoem.com 是现代化的中国诗词学习网站，提供全站搜索、拼音标注、注释和白话文翻译等功能。无论您对唐诗宋词感兴趣还是想深入学习，都是您的理想选择，从这里开始您的诗歌之旅！`,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: [
    "中国诗词学习",
    "现代化诗词网站",
    "全站搜索诗词",
    "拼音标注诗词",
    "诗词注解",
    "白话文翻译诗词",
    "学习唐诗宋词",
    "诗词学习网站推荐",
    "pinyin",
  ],
  metadataBase: new URL("https://aspoem.com"),
  twitter: {
    creator: "@meetqy",
    images: "/twitter-image",
  },
};

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);

  return (
    <html lang={params.lang}>
      <Root>
        <div className="relative z-10 flex bg-background/20 p-0">
          <aside className="hidden lg:block">
            <div className="fixed left-0 top-0 h-screen bg-muted/50">
              <ScrollArea className="sticky top-0 h-full w-72 border-border">
                <header className="h-16">
                  <Link
                    href={`/${params.lang}`}
                    className="text-outline flex h-16 items-center justify-center font-serif text-[2.5rem] font-bold"
                  >
                    AsPoem
                    <span className="text-muted-foreground">.com</span>
                  </Link>
                </header>

                <div>
                  <DesktopMenu dict={dict} lang={params.lang} />
                </div>
              </ScrollArea>
            </div>
            <div className="w-72"></div>
          </aside>

          <MobileMenu dict={dict} lang={params.lang} />

          <div className="flex-1 bg-gradient-to-t from-background to-muted/10">
            <header
              className="sticky top-0 z-40 flex min-h-16 w-full flex-row-reverse items-center justify-between border-b border-border/40 bg-gradient-to-b from-background to-muted/40 pl-14 pr-4 backdrop-blur lg:pl-0"
              id="header_main"
            >
              <div className="flex items-center justify-center">
                <div className="mr-2 hidden lg:block">
                  <Search dict={dict} lang={params.lang} />
                </div>
                <ModeToggle />
              </div>
            </header>
            <main className="relative m-auto max-w-screen-md">{children}</main>
          </div>
        </div>
      </Root>
    </html>
  );
}
