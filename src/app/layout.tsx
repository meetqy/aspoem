import { ThemeProvider } from "~/components/theme-provider";
import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/utils";

import { type Metadata } from "next";
// import localFont from "next/font/local";
import dynamic from "next/dynamic";
import LoadFont from "./load-font";

// const fontSTKaiti = localFont({
//   variable: "--font-st-kaiti",
//   src: "./fonts/STKaiti.woff2",
//   fallback: ["system-ui"],
//   preload: false,
// });

const MicrosoftClarity = dynamic(() => import("./metrics/microsoft-clarity"), {
  ssr: false,
});

const GoogleAnalytics = dynamic(() => import("./metrics/google-analytics"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "AsPoem.com - 现代化中国诗词学习网站",
  description: `aspoem.com 是现代化的中国诗词学习网站，提供全站搜索、拼音标注、注释和白话文翻译等功能。无论您对唐诗宋词感兴趣还是想深入学习，都是您的理想选择，从这里开始您的诗歌之旅！`,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: [
    "中国诗词学习",
    "现代化诗词网站",
    "全站搜索诗词",
    "拼音标注诗词",
    "注释诗词",
    "白话文翻译诗词",
    "诗词学习资源",
    "学习唐诗宋词",
    "诗词学习网站推荐",
  ],
  metadataBase: new URL("https://aspoem.com"),
  twitter: {
    creator: "@meetqy",
    images: "/opengraph-image",
  },
  openGraph: {
    images: "/opengraph-image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body
        className={cn(
          "min-h-screen bg-background font-cursive font-normal text-foreground antialiased",
          // fontSTKaiti.variable,
        )}
      >
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TRPCReactProvider>

        <GoogleAnalytics id={process.env.NEXT_PUBLIC_GA_ID!} />
        <MicrosoftClarity id={process.env.NEXT_PUBLIC_MC_ID!} />
        <LoadFont />
      </body>
    </html>
  );
}
